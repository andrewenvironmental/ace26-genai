# ACE26 GenAI Workshop

ACE workshop materials and demo guidance for the ACE26 GenAI workshop.

## Instructions for participants

The repo is organized around an Azure-hosted public web app that gives attendees a playground backed by Azure AI Services/OpenAI and Azure AI Search for use during the workshop.

To complete the workshop activities, please open the web app at the URL provided by your instructor. The web app will have instructions for each activity, and you can use it to explore the capabilities of Azure AI Services and Azure AI Search. The corresponding activity guide is available in the `docs/activity-guide.md` file, for reference. The web app will have the most up-to-date instructions and guidance.

## Information for maintainers
- Web app source: `app/`
- Azure deployment assets: `infra/`
- Deployment runbook: `docs/deployment-azure-app-service.md`
- Azure config discovery: `docs/azure-config-discovery.md`
- Participant activity guide for the web lab: `docs/activity-guide.md`
- App API flow notes: `docs/playground-api-usage.md`

Do not commit service endpoints, keys, tenant-specific values, or participant data. Keep runtime configuration in local settings, deployment parameters, or managed Azure configuration.

## Documentation Map

Start with `docs/README.md` for the current documentation index and `docs/repo-organization.md` for repo organization recommendations.

## Contingency Notebook

The Colab/Jupyter notebook is retained as a last-resort offline continuity path, not the primary workshop experience. Use it only when the Azure-hosted web lab cannot support the room.

- Runbook: `docs/colab-fallback.md`
- Notebook notes: `notebooks/README.md`
- Notebook file: `notebooks/ace26-chat-playground-backup.ipynb`
