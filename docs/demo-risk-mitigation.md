# Demo Risk Mitigation

Issue #1 called for practical backup paths for the live workshop demo. The activity guide already covers the primary participant workflow; this branch adds a repo-hosted playground app that can act as a non-proprietary backup alongside the native Foundry playground.

## Primary Demo

- Use Microsoft Foundry model playground.
- Follow `docs/new-foundry-activity-guide.md`.
- Use the `documents` vector store or Search index with the Fort Worth CIP source document.

## Backup Demo

- Use the app in `app/`.
- Run locally with Azure CLI auth or deploy to the workshop App Service.
- Use the same Azure AI Services account, model deployment, and Search index as the primary demo.
- Use `notebooks/ace26-chat-playground-backup.ipynb` for a Colab/Jupyter backup with live Azure or offline sample mode.

## Static Artifacts

Existing repo artifacts that support a no-live-service fallback:

- `docs/sample-output-fort-worth-cip.md`
- `docs/images/figure-01-project-home.png`
- `docs/images/figure-03-model-playground.png`
- `docs/images/figure-07-grounded-response-references.png`
- `docs/images/figure-08-structured-table-response.png`

## Remaining Backup Options

- A prerecorded walkthrough is still open.
- A low-code-only backup can use the existing Foundry activity guide and screenshots.
