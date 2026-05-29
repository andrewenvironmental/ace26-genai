# Workshop Playground API Usage

The playground app gives instructors a small code-level API example to pair with the Foundry portal activity. This supplements the activity guide; it is not a replacement for the participant walkthrough.

## Runtime Flow

1. Browser sends participant messages to `POST /api/chat`.
2. Server optionally searches the configured Azure AI Search index.
3. Server injects retrieved snippets into the system context.
4. Server calls Azure OpenAI chat completions using the configured deployment.
5. Browser displays the answer and retrieved source snippets.

## Endpoints

### `GET /api/config`

Returns public workshop configuration for the UI, including model deployment name, Search index name, default instructions, and prompt examples.

### `POST /api/search`

Queries Azure AI Search.

Request:

```json
{
  "query": "WTP Minor Improvements",
  "top": 4
}
```

Response:

```json
{
  "enabled": true,
  "documents": [
    {
      "title": "Fort Worth FY2021-2025 Adopted CIP",
      "sourceFile": "fort-worth-fy2021-2025-adopted-cip.pdf",
      "page": 12,
      "chunk": 1,
      "content": "..."
    }
  ]
}
```

### `POST /api/chat`

Calls the configured Azure OpenAI deployment.

Request:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Use the documents. What is WTP Minor Improvements?"
    }
  ],
  "systemPrompt": "You are an AI assistant for the ACE26 workshop.",
  "reasoningEffort": "medium",
  "maxCompletionTokens": 900,
  "useGrounding": true,
  "top": 4
}
```

Response:

```json
{
  "message": {
    "role": "assistant",
    "content": "..."
  },
  "sources": [],
  "usage": {}
}
```

## Authentication

In Azure App Service, the server uses the web app's system-assigned managed identity.

Locally, the server falls back to Azure CLI tokens:

```powershell
az login
cd app
npm start
```

For temporary local testing only, `AZURE_OPENAI_API_KEY` and `AZURE_SEARCH_API_KEY` are also supported.
