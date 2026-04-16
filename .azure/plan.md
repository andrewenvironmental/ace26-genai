# Azure Workshop Infrastructure Plan

Status: Planning

## Goal

Prepare infrastructure as code for the ACE26 generative AI workshop in a dedicated Azure tenant/subscription, while intentionally surfacing issues that require IT or Microsoft enablement before the workshop.

## Repository Decision

Keep reusable Bicep modules, templates, and sanitized example parameter files in this repository only if the repository is intended to be public.

Keep tenant-specific, subscription-specific, or organization-specific deployment values in a private repository or in ignored local parameter files. Do not commit real subscription IDs, tenant IDs, participant object IDs, service principal object IDs, existing resource names, model access approvals, keys, connection strings, or generated deployment outputs to a public repo.

## Current Azure Context

- Tenant: dedicated workshop tenant, configured locally
- Subscription display name: configured locally
- Role observed: Contributor
- Resource group: not yet created
- Expected blocker: Contributor can create many resources but cannot create role assignments without Owner or User Access Administrator.
- Expected blocker: resource providers may not be registered in a brand-new subscription.
- Expected blocker: Azure OpenAI / Foundry model availability and quota may require Microsoft approval and may take days.

## Proposed IaC Scope

- Resource group creation should be separate from the resource-group-scoped Bicep deployment.
- Main deployment should create workshop resources inside that resource group.
- Initial deployment should favor low-risk resources first: storage, Key Vault, Application Insights, Azure AI Search, and optionally AI Services / Foundry after provider registration and model access are confirmed.
- Role assignments should remain disabled by default and called out as an IT-owned enablement step unless an Owner or User Access Administrator runs that portion.
- Model deployments should remain disabled by default until model access, regional quota, SKU, and model version are confirmed.

## Resource Inventory From Workshop Activity

Required for Part 1, Azure AI Foundry Chat Playground:

- Resource group for workshop resources.
- Azure AI Foundry hub and project, or an equivalent existing Foundry project participants can access.
- Azure AI Services / Azure OpenAI account.
- Chat model deployment for playground chat.
- Embedding model deployment for grounded data / retrieval.
- Azure AI Search service with a prebuilt index for the workshop documents.
- Storage account and blob container for source documents used by "add your data".
- Key Vault for optional storage of endpoints, deployment names, and keys if key-based integration is used.
- RBAC assignments for instructors, participants, Foundry managed identities, Search, Storage, AI Services, and Key Vault access.

Likely supporting resources:

- Application Insights / Log Analytics for diagnostics and usage visibility.
- Container Registry only if the selected Foundry workspace pattern requires it.
- Managed identities for services that need to read documents, call AI Services, or write indexes.
- Budget alert or cost monitoring because participant experimentation can generate variable token/search costs.

For Part 2, web application that uses an agent with multiple layers of tools for problem solving related to work orders, data validation and processing, spatial lookup, etc. 
- Architecture and resource needs will depend heavily on the final app design, but likely will include at least:
  - Azure App Service or Azure Container Apps.
May instead use:
  - App Service plan or Container Apps environment, depending on hosting choice.
  - User-assigned managed identity for the app.
  - App Configuration if the app needs non-secret runtime settings.
  - Static Web Apps only if the tool is a frontend-only demo that calls a secured backend elsewhere.
  - Azure Functions only if the activity includes background ingestion, document processing, or API glue.

Not currently required by the written activity:

- Database
- API Management

## Enablement Items To Track

- Register required Azure resource providers:
  - Microsoft.CognitiveServices
  - Microsoft.MachineLearningServices
  - Microsoft.Search
  - Microsoft.Storage
  - Microsoft.KeyVault
  - Microsoft.Insights
  - Microsoft.ContainerRegistry, if Foundry hub/project dependencies need ACR
- Confirm policy allows the target regions.
- Confirm who can create the resource group.
- Confirm who can assign RBAC roles.
- Confirm Azure OpenAI / Foundry model library access.
- Confirm quota and regional availability for chat and embedding model deployments.
- Confirm whether public network access is acceptable for workshop resources.

## Next Steps

1. Sanitize the existing Bicep draft from the private infra folder before copying it here. Completed: copied Bicep modules and replaced prior-environment defaults with public-safe placeholders/create-new defaults.
2. Split subscription-scope resource group creation from resource-group-scope resource deployment. Completed: `infra/resource-group.bicep` handles resource group creation.
3. Add a public-safe `main.parameters.example.json`. Completed: public example disables role assignments and model deployments by default.
4. Add an ignored local parameter file pattern for real tenant/subscription/resource names. Completed: `.gitignore` now ignores `.env`, `.env.*`, and local infra parameter files while allowing `.env.example`.
5. Run Azure validation checks before any deployment attempt.
6. Attempt a staged deployment and capture permission/provider/model-access failures as IT enablement items.
