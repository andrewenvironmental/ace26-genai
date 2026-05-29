# ACE26 AI Workshop Lab

This is the public-facing workshop web app for the ACE26 GenAI activity. It mirrors the core Azure AI Foundry playground workflow in a simplified participant-safe interface: participants can move through the full lab, select configured model deployments, edit instructions, change reasoning and response length settings, attach a workshop data source, ask chat questions, and inspect retrieved source snippets.

The app is intentionally dependency-light. It uses Node.js 20, browser assets in `public/`, and Azure managed identity or local Azure CLI credentials for service calls. `web.config` is included for the current Windows App Service plan.

For local development, `server.js` loads `.env` from the repo root or `app/.env` before reading environment variables.

## Configuration

The existing Bicep template wires these app settings:

- `AZURE_AI_SERVICES_ENDPOINT`
- `AZURE_OPENAI_CHAT_DEPLOYMENT`
- `AZURE_OPENAI_CHAT_DEPLOYMENTS`
- `AZURE_OPENAI_API_VERSION`
- `AZURE_SEARCH_ENDPOINT`
- `AZURE_SEARCH_INDEX`
- `AZURE_SEARCH_INDEXES`
- `AZURE_SEARCH_API_VERSION`
- `AZURE_STORAGE_CONTAINER`
- `AI_FOUNDRY_PORTAL_URL`
- `PUBLIC_API_ACCESS_MODE`
- `PUBLIC_API_RATE_LIMIT_PER_MINUTE`

`AZURE_OPENAI_CHAT_DEPLOYMENT` is the default deployment. `AZURE_OPENAI_CHAT_DEPLOYMENTS` is a comma-separated list exposed in the model selector, for example:

```text
gpt-5.4-nano,gpt-5.4-mini,gpt-5.4-pro
```

`AZURE_SEARCH_INDEX` is the default workshop index. `AZURE_SEARCH_INDEXES` is an optional comma-separated list exposed as data sources.

`PUBLIC_API_ACCESS_MODE` can be `open`, `code`, or `app-service-auth`. Local development defaults to `open`; production defaults to `code`. For code mode, set `WORKSHOP_ACCESS_CODE` or `WORKSHOP_ACCESS_CODES` as an App Service setting or deployment secret.

`PUBLIC_API_RATE_LIMIT_PER_MINUTE` defaults to `120` per client IP and applies to chat and direct search requests. Set it to `0` only for controlled testing.

Production defaults to managed identity. `AZURE_OPENAI_API_KEY` and `AZURE_SEARCH_API_KEY` are accepted for local development; in production, set `ALLOW_PRODUCTION_API_KEYS=true` only as an explicit break-glass fallback.

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
