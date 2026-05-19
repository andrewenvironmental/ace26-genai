# ACE26 Workshop Playground

This is a compact educational chat playground for the ACE26 GenAI workshop. It mirrors the core Azure AI Foundry playground workflow: participants can edit system instructions, change model settings used in the activity, ask chat questions, and optionally ground responses against the workshop Azure AI Search `documents` index.

The app is intentionally dependency-light. It uses Node.js 20, browser assets in `public/`, and Azure managed identity or local Azure CLI credentials for service calls. `web.config` is included for the current Windows App Service plan.

## Configuration

The existing Bicep template wires these app settings:

- `AZURE_AI_SERVICES_ENDPOINT`
- `AZURE_OPENAI_CHAT_DEPLOYMENT`
- `AZURE_OPENAI_API_VERSION`
- `AZURE_SEARCH_ENDPOINT`
- `AZURE_SEARCH_INDEX`
- `AZURE_SEARCH_API_VERSION`
- `AZURE_STORAGE_CONTAINER`
- `AI_FOUNDRY_PORTAL_URL`

Optional local key-based settings are supported for development only:

- `AZURE_OPENAI_API_KEY`
- `AZURE_SEARCH_API_KEY`

When keys are not present, the server uses App Service managed identity in Azure and `az account get-access-token` locally.

## Local Run

```powershell
cd app
npm start
```

Open `http://localhost:5050`.

For local keyless auth, sign in first:

```powershell
az login
```

## Deploy Notes

The web app managed identity needs:

- `Cognitive Services OpenAI User` on the Azure AI Services/OpenAI account.
- `Cognitive Services User` on the Azure AI Services/Foundry account.
- `Search Index Data Reader` on the Azure AI Search service.

The repo Bicep assigns these roles when `enableRoleAssignments` is true and the web app is created.
