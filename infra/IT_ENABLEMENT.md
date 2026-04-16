# IT Enablement Checklist

Use this checklist to separate deployment bugs from tenant/subscription enablement issues.

## Access

- Confirm the workshop subscription is active.
- Confirm the deployment operator can create a resource group.
- Confirm who has Owner or User Access Administrator for RBAC role assignments.
- Confirm participant access strategy: group-based access is preferred over individual users.

## Resource Providers

Required providers:

- `Microsoft.CognitiveServices`
- `Microsoft.Search`
- `Microsoft.Storage`
- `Microsoft.KeyVault`
- `Microsoft.Insights`
- `Microsoft.ContainerRegistry`
- `Microsoft.Web`, if deploying web apps for Part 2
- `Microsoft.OperationalInsights`, if using Log Analytics

Run:

```powershell
.\infra\scripts\Test-AzureEnablement.ps1 -SubscriptionId $env:AZURE_SUBSCRIPTION_ID
```

## Azure AI / Model Access

- Confirm Azure AI Foundry is available in the tenant.
- Confirm Azure OpenAI or Azure AI Services model library access is approved.
- Confirm the region for the chat model deployment.
- Confirm the region for the embedding model deployment.
- Confirm available quota and SKU for each model deployment.
- For the 100-participant workshop profile, confirm East US 2 `GlobalStandard` quota for `gpt-5.4-pro` capacity 160, `gpt-5.4-mini` capacity 300, `gpt-5.4-nano` capacity 1000, and `text-embedding-3-small` capacity 100.
- Confirm whether content filtering / responsible AI policy requires IT or Microsoft review.

## Policy And Networking

- Confirm allowed regions.
- Confirm whether public network access is allowed for workshop-only resources.
- Confirm whether Key Vault soft delete and purge protection settings satisfy policy.
- Confirm whether local auth/API keys are allowed for Search and AI Services, or whether Entra-only auth is required.

## Cost Control

- Confirm budget owner.
- Add a budget alert before participant access.
- Keep model deployments disabled until quota and cost expectations are approved.
- Use the smallest Search/App Service SKUs that support the activity.
