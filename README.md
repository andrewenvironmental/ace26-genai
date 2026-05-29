# ACE26 GenAI Workshop

Public-safe workshop materials, Azure infrastructure, and demo guidance for the ACE26 GenAI workshop.

## Primary Delivery Path

The repo is organized around an Azure-hosted public web app that gives attendees a workshop-safe chat playground backed by Azure AI Services/OpenAI and Azure AI Search.

- Web app source: `app/`
- Azure deployment assets: `infra/`
- Deployment runbook: `docs/deployment-azure-app-service.md`
- Azure config discovery: `docs/azure-config-discovery.md`
- Participant activity guide: `docs/new-foundry-activity-guide.md`
- App API flow notes: `docs/playground-api-usage.md`
- Demo risk plan: `docs/demo-risk-mitigation.md`

Do not commit service endpoints, keys, tenant-specific values, or participant data. Keep runtime configuration in local settings, deployment parameters, or managed Azure configuration.

## Documentation Map

Start with `docs/README.md` for the current documentation index and `docs/repo-organization.md` for repo organization recommendations.

## Contingency Notebook

The Colab/Jupyter notebook is retained as a last-resort offline continuity path, not the primary workshop experience. Use it only when the Azure-hosted app and Foundry-based activity cannot support the room.

- Runbook: `docs/colab-fallback.md`
- Notebook notes: `notebooks/README.md`
- Notebook file: `notebooks/ace26-chat-playground-backup.ipynb`
