# Colab Fallback Runbook

Use this path when the live Foundry playground, workshop App Service, or participant Azure access is not reliable enough for the room.

## Attendee Link

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/andrewenvironmental/ace26-genai/blob/main/notebooks/ace26-chat-playground-backup.ipynb)

Direct URL:

```text
https://colab.research.google.com/github/andrewenvironmental/ace26-genai/blob/main/notebooks/ace26-chat-playground-backup.ipynb
```

## Recommended Workshop Flow

1. Ask attendees to open the Colab link.
2. Leave `USE_LIVE_AZURE = False`.
3. Select `Runtime > Run all`.
4. Use the output cells to discuss prompt iteration, document grounding, source review, and structured output.
5. Use the final share-out prompt to compare what changed after adding instructions or retrieved snippets.

Offline mode is the safest room-wide fallback because it does not require Azure sign-in, GitHub Codespaces quota, API keys, or working role assignments.

## Instructor Live Mode

Use live mode only from an instructor-controlled notebook or with a small helper group.

1. Set `USE_LIVE_AZURE = True`.
2. Fill in:
   - `AZURE_AI_SERVICES_ENDPOINT`
   - `AZURE_OPENAI_CHAT_DEPLOYMENT`
   - `AZURE_SEARCH_ENDPOINT`
   - `AZURE_SEARCH_INDEX`
3. Use prompted keys or bearer tokens. Do not hard-code secrets in the notebook.
4. Run the Search and Chat helper cells before the prompt examples.

## Troubleshooting

- If Colab asks users to sign in, they can still view the notebook; running and saving changes may require a Google account.
- If live mode fails, switch back to `USE_LIVE_AZURE = False` and rerun.
- If the notebook appears stale after a merge, refresh the Colab browser tab or reopen the direct URL.
- If attendees need an editable copy, use `File > Save a copy in Drive`.
