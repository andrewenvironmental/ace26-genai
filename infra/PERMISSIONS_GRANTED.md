# Permissions Granted

This file records the permissions needed to make the ACE26 Foundry workshop environment usable and repeatable.

## Current User

User principal:

```text
6b08945f-7519-47e0-9589-fe3723d2883f
```

User sign-in:

```text
agoldberg@ekiconsult.com
```

## Subscription-Level Roles

Scope:

```text
/subscriptions/d522d6af-2079-410e-a2d1-e93e2b912485
```

Roles:

```text
Contributor
Cost Management Contributor
```

Notes:

- `Contributor` is enough to create most workshop resources.
- `Contributor` is not enough to create role assignments.
- `Cost Management Contributor` was visible on the subscription, but budget deployment still returned:

```text
Access to data for entityId: d522d6af-2079-410e-a2d1-e93e2b912485 is unauthorized.
```

This likely requires additional billing-scope permissions or billing account access beyond Azure RBAC.

## Foundry / AI Services User Roles

Foundry account scope:

```text
/subscriptions/d522d6af-2079-410e-a2d1-e93e2b912485/resourceGroups/rg-ace26-genai-workshop-dev/providers/Microsoft.CognitiveServices/accounts/aceaiworksho-ai-is6hct
```

Roles assigned to the user:

```text
Owner
Azure AI User
Azure AI Owner
Azure AI Project Manager
Cognitive Services User
```

Project scope:

```text
/subscriptions/d522d6af-2079-410e-a2d1-e93e2b912485/resourceGroups/rg-ace26-genai-workshop-dev/providers/Microsoft.CognitiveServices/accounts/aceaiworksho-ai-is6hct/projects/aceaiworksho-ai-is6hct-project
```

Roles assigned to the user:

```text
Azure AI User
```

Result:

- Foundry vector-store API works with the user's Entra token.
- The `documents` vector store is visible through the API and should be visible in the portal after token/session refresh.
- This fixed the portal error:

```text
Microsoft.CognitiveServices/accounts/AIServices/assets/read
```

## Foundry Project Managed Identity

Project:

```text
aceaiworksho-ai-is6hct-project
```

Project managed identity principal ID:

```text
4c8507d7-888e-4823-be61-73a5a1b53333
```

Role assigned:

```text
Azure AI User
```

Scope:

```text
/subscriptions/d522d6af-2079-410e-a2d1-e93e2b912485/resourceGroups/rg-ace26-genai-workshop-dev/providers/Microsoft.CognitiveServices/accounts/aceaiworksho-ai-is6hct
```

Roles still recommended but not assigned because current user lacks role-assignment rights at the Search and Storage scopes:

```text
Search Index Data Contributor
Storage Blob Data Reader
```

Recommended commands for an Owner or User Access Administrator:

```powershell
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

## Replication Checklist

For the workshop developer/admin:

```powershell
az role assignment create `
  --assignee-object-id "<developer-or-group-object-id>" `
  --assignee-principal-type User `
  --role "Azure AI User" `
  --scope "<ai-services-account-resource-id>"
```

For the workshop admin who needs to manage Foundry users/projects:

```powershell
az role assignment create `
  --assignee-object-id "<admin-object-id>" `
  --assignee-principal-type User `
  --role "Azure AI Owner" `
  --scope "<ai-services-account-resource-id>"
```

For budget management:

```text
Cost Management Contributor at subscription scope may not be sufficient.
Ask IT to confirm billing account / billing profile access needed to create subscription budgets.
```
