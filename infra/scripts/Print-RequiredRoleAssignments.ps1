param(
    [string]$SubscriptionId = 'd522d6af-2079-410e-a2d1-e93e2b912485',
    [string]$ResourceGroup = 'rg-ace26-genai-workshop-dev',
    [string]$AiServicesAccountName = 'aceaiworksho-ai-is6hct',
    [string]$ProjectName = 'aceaiworksho-ai-is6hct-project',
    [string]$SearchServiceName = 'aceaiworksho-search-is6hct',
    [string]$StorageAccountName = 'aceaiworkshostis6hct',
    [string]$UserObjectId = '6b08945f-7519-47e0-9589-fe3723d2883f'
)

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
