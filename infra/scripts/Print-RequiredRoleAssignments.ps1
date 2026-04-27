param(
    [string]$SubscriptionId = $env:AZURE_SUBSCRIPTION_ID,
    [string]$ResourceGroup = $env:AZURE_RESOURCE_GROUP,
    [string]$AiServicesAccountName = $env:AZURE_AI_SERVICES_ACCOUNT,
    [string]$ProjectName = $env:AZURE_AI_SERVICES_PROJECT,
    [string]$SearchServiceName = $env:AZURE_SEARCH_SERVICE,
    [string]$StorageAccountName = $env:AZURE_STORAGE_ACCOUNT,
    [string]$UserObjectId = $env:AZURE_USER_OBJECT_ID
)

foreach ($name in 'SubscriptionId','ResourceGroup','AiServicesAccountName','ProjectName','SearchServiceName','StorageAccountName','UserObjectId') {
    if ([string]::IsNullOrWhiteSpace((Get-Variable -Name $name).Value)) {
        throw "Missing required parameter -$name or corresponding environment variable. See infra/README.md for setup."
    }
}

$accountScope = "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroup/providers/Microsoft.CognitiveServices/accounts/$AiServicesAccountName"
$projectScope = "$accountScope/projects/$ProjectName"
$searchScope = "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroup/providers/Microsoft.Search/searchServices/$SearchServiceName"
$storageScope = "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroup/providers/Microsoft.Storage/storageAccounts/$StorageAccountName"

$projectPrincipalId = az resource show `
    --ids $projectScope `
    --api-version 2025-06-01 `
    --query identity.principalId `
    --output tsv

@"
# Run these as Owner or User Access Administrator.

az role assignment create --assignee-object-id $UserObjectId --assignee-principal-type User --role "Azure AI User" --scope "$accountScope"
az role assignment create --assignee-object-id $UserObjectId --assignee-principal-type User --role "Reader" --scope "$accountScope"

# Project managed identity permissions recommended by Foundry docs.
az role assignment create --assignee-object-id $projectPrincipalId --assignee-principal-type ServicePrincipal --role "Azure AI User" --scope "$accountScope"
az role assignment create --assignee-object-id $projectPrincipalId --assignee-principal-type ServicePrincipal --role "Search Index Data Contributor" --scope "$searchScope"
az role assignment create --assignee-object-id $projectPrincipalId --assignee-principal-type ServicePrincipal --role "Storage Blob Data Reader" --scope "$storageScope"

# Optional, if the workshop operators need to manage Search directly.
az role assignment create --assignee-object-id $UserObjectId --assignee-principal-type User --role "Search Index Data Contributor" --scope "$searchScope"
az role assignment create --assignee-object-id $UserObjectId --assignee-principal-type User --role "Storage Blob Data Contributor" --scope "$storageScope"
"@
