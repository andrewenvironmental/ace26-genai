# Workshop Infrastructure

This folder is intended for public-safe infrastructure as code.

Commit:

- Reusable Bicep modules.
- Sanitized example parameter files.
- Deployment scripts that read values from environment variables.
- Documentation describing required permissions and enablement steps.

Do not commit:

- Real subscription IDs, tenant IDs, or directory names.
- Real participant, group, managed identity, service principal, or object IDs.
- Existing resource names from client or training environments.
- Keys, connection strings, endpoint secrets, generated deployment outputs, or model access approval details.
- Local parameter files such as `*.local.json` or `*.local.bicepparam`.

Recommended layout:

- `main.bicep`: resource-group-scoped workshop resources.
- `resource-group.bicep`: subscription-scoped resource group creation.
- `main.parameters.example.json`: public-safe sample values.
- `main.parameters.local.json`: ignored local values for a real deployment.

For this workshop, keep role assignments and model deployments disabled by default in public examples. Enable them only in local/private parameters after IT confirms permissions, provider registration, regional policy, model access, and quota.

Lowest-cost defaults:

- Azure AI Search defaults to `free`. Azure AI Search SKU cannot be downgraded in place after creation, so moving from `basic` to `free` requires recreating the Search service or the resource group.
- Application Insights is disabled by default because it can create a managed Log Analytics resource group.
- Container Registry is disabled by default for the workshop demo unless app/container workflows require it.
- Model deployments are disabled by default. Deploy only the specific chat and embedding deployments needed for the workshop.

Before provisioning, run the enablement check:

```powershell
.\infra\scripts\Test-AzureEnablement.ps1 -SubscriptionId $env:AZURE_SUBSCRIPTION_ID
```

Track any findings in `IT_ENABLEMENT.md`.

To index the Fort Worth CIP PDF into Azure AI Search:

```powershell
$searchKey = az search admin-key show `
  --resource-group $env:AZURE_RESOURCE_GROUP `
  --service-name "<search-service-name>" `
  --query primaryKey `
  --output tsv

python infra/scripts/index_pdf_to_search.py `
  --search-endpoint "https://<search-service-name>.search.windows.net" `
  --api-key $searchKey `
  --index-name documents `
  --pdf examples/fort-worth-fy2021-2025-adopted-cip.pdf
```

To create a Foundry-native vector store using the account key:

```powershell
.\infra\scripts\Create-FoundryVectorStore.ps1
```

If the Foundry portal shows `Microsoft.CognitiveServices/accounts/AIServices/assets/read`
permission errors, ask an Owner or User Access Administrator to run the commands printed by:

```powershell
.\infra\scripts\Print-RequiredRoleAssignments.ps1
```

The focused handoff for this specific portal error is in `FOUNDRY_RBAC_FIX.md`.
The roles that were actually granted during setup are recorded in `PERMISSIONS_GRANTED.md`.

Example deployment flow:

```powershell
az account set --subscription $env:AZURE_SUBSCRIPTION_ID

az deployment sub what-if `
  --location $env:AZURE_LOCATION `
  --template-file infra/resource-group.bicep `
  --parameters infra/resource-group.parameters.local.json

az deployment sub create `
  --location $env:AZURE_LOCATION `
  --template-file infra/resource-group.bicep `
  --parameters infra/resource-group.parameters.local.json

az deployment group what-if `
  --resource-group $env:AZURE_RESOURCE_GROUP `
  --template-file infra/main.bicep `
  --parameters infra/main.parameters.local.json
```

To tear down and reprovision the demo environment:

```powershell
.\infra\scripts\Remove-WorkshopResources.ps1 `
  -WorkshopResourceGroup $env:AZURE_RESOURCE_GROUP `
  -IncludeManagedResourceGroups

# Review the printed resource groups, then rerun with -Yes.
.\infra\scripts\Remove-WorkshopResources.ps1 `
  -WorkshopResourceGroup $env:AZURE_RESOURCE_GROUP `
  -IncludeManagedResourceGroups `
  -Yes
```
