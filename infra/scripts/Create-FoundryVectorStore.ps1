param(
    [string]$ResourceGroup = $env:AZURE_RESOURCE_GROUP,
    [string]$AiServicesAccountName = $env:AZURE_AI_SERVICES_ACCOUNT,
    [string]$ProjectName = $env:AZURE_AI_SERVICES_PROJECT,
    [string]$VectorStoreName = 'documents',
    [string]$FilePath = 'examples/fort-worth-fy2021-2025-adopted-cip.pdf'
)

$ErrorActionPreference = 'Stop'

foreach ($name in 'ResourceGroup','AiServicesAccountName','ProjectName') {
    if ([string]::IsNullOrWhiteSpace((Get-Variable -Name $name).Value)) {
        throw "Missing required parameter -$name or corresponding environment variable. See infra/README.md for setup."
    }
}

if (-not (Test-Path -LiteralPath $FilePath)) {
    throw "PDF file not found: $FilePath"
}

$account = az cognitiveservices account show `
    --resource-group $ResourceGroup `
    --name $AiServicesAccountName `
    --query "{endpoint:properties.endpoints.'AI Foundry API'}" `
    --output json | ConvertFrom-Json

$projectEndpoint = "$($account.endpoint.TrimEnd('/'))/api/projects/$ProjectName"

# This setup helper uses an account key because the workshop environment allows local auth.
# If local auth is disabled by policy, update this script to use an Entra token instead.
$key = az cognitiveservices account keys list `
    --resource-group $ResourceGroup `
    --name $AiServicesAccountName `
    --query key1 `
    --output tsv

$headers = @{
    'api-key' = $key
}

Write-Host "Creating vector store '$VectorStoreName'..."
$vectorStore = Invoke-RestMethod `
    -Method Post `
    -Uri "$projectEndpoint/vector_stores?api-version=v1" `
    -Headers $headers `
    -ContentType 'application/json' `
    -Body (@{ name = $VectorStoreName } | ConvertTo-Json -Compress)

Write-Host "Uploading file '$FilePath'..."
$file = Get-Item -LiteralPath $FilePath
$upload = Invoke-RestMethod `
    -Method Post `
    -Uri "$projectEndpoint/files?api-version=v1" `
    -Headers $headers `
    -Form @{
        purpose = 'assistants'
        file = $file
    }

Write-Host "Attaching file to vector store..."
$vectorFile = Invoke-RestMethod `
    -Method Post `
    -Uri "$projectEndpoint/vector_stores/$($vectorStore.id)/files?api-version=v1" `
    -Headers $headers `
    -ContentType 'application/json' `
    -Body (@{ file_id = $upload.id } | ConvertTo-Json -Compress)

while ($vectorFile.status -eq 'in_progress') {
    Start-Sleep -Seconds 5
    $files = Invoke-RestMethod `
        -Method Get `
        -Uri "$projectEndpoint/vector_stores/$($vectorStore.id)/files?api-version=v1" `
        -Headers $headers
    $vectorFile = $files.data | Where-Object { $_.id -eq $upload.id } | Select-Object -First 1
    Write-Host "File status: $($vectorFile.status)"
}

[PSCustomObject]@{
    ProjectEndpoint = $projectEndpoint
    VectorStoreName = $vectorStore.name
    VectorStoreId = $vectorStore.id
    FileId = $upload.id
    FileStatus = $vectorFile.status
}
