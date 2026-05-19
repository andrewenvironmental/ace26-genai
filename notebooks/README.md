# Notebook Backup Demo

`ace26-chat-playground-backup.ipynb` is a Jupyter/Colab-friendly backup version of the workshop playground.

It supports two modes:

- `USE_LIVE_AZURE = False`: runs a no-service walkthrough with canned Fort Worth CIP snippets.
- `USE_LIVE_AZURE = True`: calls the configured Azure AI Services/OpenAI deployment and Azure AI Search index.

The notebook avoids hard-coded secrets. Use environment variables, prompted keys, explicit bearer tokens, or Azure CLI tokens in a local Jupyter environment.
