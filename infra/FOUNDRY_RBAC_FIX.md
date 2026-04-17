# Foundry RBAC Fix

The Foundry portal can show this error when opening vector stores or project assets:

```text
PermissionDenied: The principal `<user-object-id>` lacks the required data action `Microsoft.CognitiveServices/accounts/AIServices/assets/read` to perform `GET /api/projects/{projectName}/vector_stores` operation.
```

This is not a model or vector store problem. The `documents` vector store exists and has the Fort Worth CIP file attached. The portal is failing because the signed-in user has subscription `Contributor`, which can create resources but does not include Foundry data-plane permissions.

An Owner, User Access Administrator, Azure AI Owner, or Azure AI Project Manager must grant the role below.

## Required User Role

```powershell
az role assignment create `
  --assignee-object-id $env:AZURE_USER_OBJECT_ID `
  --assignee-principal-type User `
  --role "Azure AI User" `
  --scope "/subscriptions/$env:AZURE_SUBSCRIPTION_ID/resourceGroups/$env:AZURE_RESOURCE_GROUP/providers/Microsoft.CognitiveServices/accounts/$env:AZURE_AI_SERVICES_ACCOUNT"
```

## Recommended Project Identity Roles

```powershell
# Get the project managed identity principal ID first:
$projectPrincipalId = az resource show `
  --ids "/subscriptions/$env:AZURE_SUBSCRIPTION_ID/resourceGroups/$env:AZURE_RESOURCE_GROUP/providers/Microsoft.CognitiveServices/accounts/$env:AZURE_AI_SERVICES_ACCOUNT/projects/$env:AZURE_AI_SERVICES_PROJECT" `
  --api-version 2025-06-01 `
  --query identity.principalId `
  --output tsv

az role assignment create `
  --assignee-object-id $projectPrincipalId `
  --assignee-principal-type ServicePrincipal `
  --role "Azure AI User" `
  --scope "/subscriptions/$env:AZURE_SUBSCRIPTION_ID/resourceGroups/$env:AZURE_RESOURCE_GROUP/providers/Microsoft.CognitiveServices/accounts/$env:AZURE_AI_SERVICES_ACCOUNT"

az role assignment create `
  --assignee-object-id $projectPrincipalId `
  --assignee-principal-type ServicePrincipal `
  --role "Search Index Data Contributor" `
  --scope "/subscriptions/$env:AZURE_SUBSCRIPTION_ID/resourceGroups/$env:AZURE_RESOURCE_GROUP/providers/Microsoft.Search/searchServices/$env:AZURE_SEARCH_SERVICE"

az role assignment create `
  --assignee-object-id $projectPrincipalId `
  --assignee-principal-type ServicePrincipal `
  --role "Storage Blob Data Reader" `
  --scope "/subscriptions/$env:AZURE_SUBSCRIPTION_ID/resourceGroups/$env:AZURE_RESOURCE_GROUP/providers/Microsoft.Storage/storageAccounts/$env:AZURE_STORAGE_ACCOUNT"
```

After role assignment, wait a few minutes, sign out of Foundry, sign back in, and reopen the project.

Expected result: `Data + indexes`, files, and vector store `documents` become visible without the `assets/read` permission error.
