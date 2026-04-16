# Foundry RBAC Fix

The Foundry portal can show this error when opening vector stores or project assets:

```text
PermissionDenied: The principal `6b08945f-7519-47e0-9589-fe3723d2883f` lacks the required data action `Microsoft.CognitiveServices/accounts/AIServices/assets/read` to perform `GET /api/projects/{projectName}/vector_stores` operation.
```

This is not a model or vector store problem. The `documents` vector store exists and has the Fort Worth CIP file attached. The portal is failing because the signed-in user has subscription `Contributor`, which can create resources but does not include Foundry data-plane permissions.

An Owner, User Access Administrator, Azure AI Owner, or Azure AI Project Manager must grant the role below.

## Required User Role

```powershell
az role assignment create `
  --assignee-object-id 6b08945f-7519-47e0-9589-fe3723d2883f `
  --assignee-principal-type User `
  --role "Azure AI User" `
  --scope "/subscriptions/d522d6af-2079-410e-a2d1-e93e2b912485/resourceGroups/rg-ace26-genai-workshop-dev/providers/Microsoft.CognitiveServices/accounts/aceaiworksho-ai-is6hct"
```

## Recommended Project Identity Roles

```powershell
az role assignment create `
  --assignee-object-id 4c8507d7-888e-4823-be61-73a5a1b53333 `
  --assignee-principal-type ServicePrincipal `
  --role "Azure AI User" `
  --scope "/subscriptions/d522d6af-2079-410e-a2d1-e93e2b912485/resourceGroups/rg-ace26-genai-workshop-dev/providers/Microsoft.CognitiveServices/accounts/aceaiworksho-ai-is6hct"

az role assignment create `
  --assignee-object-id 4c8507d7-888e-4823-be61-73a5a1b53333 `
  --assignee-principal-type ServicePrincipal `
  --role "Search Index Data Contributor" `
  --scope "/subscriptions/d522d6af-2079-410e-a2d1-e93e2b912485/resourceGroups/rg-ace26-genai-workshop-dev/providers/Microsoft.Search/searchServices/aceaiworksho-search-is6hct"

az role assignment create `
  --assignee-object-id 4c8507d7-888e-4823-be61-73a5a1b53333 `
  --assignee-principal-type ServicePrincipal `
  --role "Storage Blob Data Reader" `
  --scope "/subscriptions/d522d6af-2079-410e-a2d1-e93e2b912485/resourceGroups/rg-ace26-genai-workshop-dev/providers/Microsoft.Storage/storageAccounts/aceaiworkshostis6hct"
```

After role assignment, wait a few minutes, sign out of Foundry, sign back in, and reopen the project:

```text
aceaiworksho-ai-is6hct-project
```

Expected result: `Data + indexes`, files, and vector store `documents` become visible without the `assets/read` permission error.
