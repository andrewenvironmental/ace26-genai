# Permissions Granted

This file records the permissions needed to make the ACE26 Foundry workshop environment usable and repeatable.

Replace all `<placeholder>` values with your environment-specific values from `.env`.

## Current User

User principal:

```text
<user-object-id>
```

User sign-in:

```text
<user-email>
```

## Subscription-Level Roles

Scope:

```text
/subscriptions/<subscription-id>
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
Access to data for entityId: <subscription-id> is unauthorized.
```

This likely requires additional billing-scope permissions or billing account access beyond Azure RBAC.

## Foundry / AI Services User Roles

Foundry account scope:

```text
/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.CognitiveServices/accounts/<ai-services-account>
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
/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.CognitiveServices/accounts/<ai-services-account>/projects/<ai-services-project>
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
<ai-services-project>
```

Project managed identity principal ID:

```text
<project-managed-identity-id>
```

Role assigned:

```text
Azure AI User
```

Scope:

```text
/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.CognitiveServices/accounts/<ai-services-account>
```

Roles still recommended but not assigned because current user lacks role-assignment rights at the Search and Storage scopes:

```text
Search Index Data Contributor
Storage Blob Data Reader
```

Recommended commands for an Owner or User Access Administrator:

```powershell
az role assignment create `
  --assignee-object-id <project-managed-identity-id> `
  --assignee-principal-type ServicePrincipal `
  --role "Search Index Data Contributor" `
  --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Search/searchServices/<search-service>"

az role assignment create `
  --assignee-object-id <project-managed-identity-id> `
  --assignee-principal-type ServicePrincipal `
  --role "Storage Blob Data Reader" `
  --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>"
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
