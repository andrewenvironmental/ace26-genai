# Notebook Backup Demo

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/andrewenvironmental/ace26-genai/blob/main/notebooks/ace26-chat-playground-backup.ipynb)

`ace26-chat-playground-backup.ipynb` is a Jupyter/Colab-friendly backup version of the workshop playground.

It supports two modes:

- `USE_LIVE_AZURE = False`: runs a no-service walkthrough with canned Fort Worth CIP snippets.
- `USE_LIVE_AZURE = True`: calls the configured Azure AI Services/OpenAI deployment and Azure AI Search index.

The notebook avoids hard-coded secrets. Use environment variables, prompted keys, explicit bearer tokens, or Azure CLI tokens in a local Jupyter environment.

For the workshop fallback flow, see `docs/colab-fallback.md`.
