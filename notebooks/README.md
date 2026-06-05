# Notebook Contingency Demo

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/andrewenvironmental/ace26-genai/blob/main/notebooks/ace26-chat-playground-backup.ipynb)

`ace26-chat-playground-backup.ipynb` is a Jupyter/Colab-friendly contingency version of the workshop playground. It is retained for offline continuity, not as the primary attendee path.

It supports two modes:

- `USE_LIVE_AZURE = False`: runs a no-service walkthrough with canned Fort Worth CIP snippets.
- `USE_LIVE_AZURE = True`: calls the configured Azure AI Services/OpenAI deployment and Azure AI Search index.

The notebook avoids hard-coded secrets. Use environment variables, prompted keys, explicit bearer tokens, or Azure CLI tokens in a local Jupyter environment.

For normal workshop delivery, use the Azure-hosted public web app and the docs under `../docs/`.

For the last-resort notebook flow, keep operational runbooks local-only so tenant-specific settings do not drift into the public repo.
