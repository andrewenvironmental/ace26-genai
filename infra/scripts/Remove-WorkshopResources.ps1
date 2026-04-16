param(
    [string]$WorkshopResourceGroup = 'rg-ace26-genai-workshop-dev',

    [switch]$IncludeManagedResourceGroups,

    [switch]$Yes
)

$ErrorActionPreference = 'Stop'

$groups = @($WorkshopResourceGroup)

if ($IncludeManagedResourceGroups) {
    $managedGroups = az group list `
        --query "[?managedBy != null && contains(managedBy, '/resourceGroups/$WorkshopResourceGroup/')].name" `
        --output json | ConvertFrom-Json
    $groups += $managedGroups
}

$groups = $groups | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique

Write-Host "Resource groups selected for deletion:"
foreach ($group in $groups) {
    Write-Host "  - $group"
}

if (-not $Yes) {
    Write-Host ""
    Write-Host "Re-run with -Yes to delete these resource groups."
    exit 0
}

foreach ($group in $groups) {
    Write-Host "Deleting $group..."
    az group delete --name $group --yes --no-wait
}

Write-Host "Delete requests submitted."
