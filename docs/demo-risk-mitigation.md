# Demo Risk Mitigation

Issue #1 called for practical backup paths for the live workshop demo. The activity guide and repo-hosted playground app now cover the primary participant workflow.

## Primary Demo

- Use the ACE26 AI Workshop Lab web app.
- Follow `docs/activity-guide.md`.
- Use the `Workshop documents` data source backed by the Fort Worth CIP source document.

## Backup Demo

Primary attendee fallback:

- Use the Colab notebook in offline mode: `notebooks/ace26-chat-playground-backup.ipynb`.
- Share the runbook in `docs/colab-fallback.md`.
- Keep `USE_LIVE_AZURE = False` for room-wide reliability.

Instructor/helper fallback:

- Run the app locally with Azure CLI auth or deploy to the workshop App Service.
- Use the same Azure AI Services account, model deployment, and Search index as the primary demo.
- Use notebook live mode only from an instructor-controlled session.

## Static Artifacts

Existing repo artifacts that support a no-live-service fallback:

- `docs/sample-output-fort-worth-cip.md`
- `docs/images/figure-01-lab-overview.png`
- `docs/images/figure-02-step-prepared.png`
- `docs/images/figure-05-document-grounding.png`
- `docs/images/figure-06-guardrail-setup.png`

## Remaining Backup Options

- A prerecorded walkthrough is still open.
- A low-code-only backup can use the app screenshots and static sample outputs.
