# Repo Organization Recommendations

The repo is moving from an offline-first notebook fallback toward an Azure-specific public web app. Keep the default reader path focused on the web app, Azure deployment, and Foundry activity guide.

## Recommended Structure

- `app/`: primary public web app source.
- `infra/`: Azure deployment assets for the workshop app and supporting services.
- `docs/`: public-safe workshop guidance, instructor notes, API flow notes, screenshots, and risk planning.
- `notebooks/`: legacy contingency notebooks only.

## Documentation Priorities

- Keep `README.md` focused on the Azure web app as the primary path.
- Keep `docs/README.md` as the documentation index.
- Keep `docs/demo-risk-mitigation.md` ranked: Azure web app first, local/app-service fallback second, offline notebook last.
- Avoid adding new Colab badges or notebook-first links outside the notebook-specific docs.
- Do not commit secrets, real participant data, private endpoints, tenant IDs, or filled deployment parameters.

## Retirement Candidates

These files appear safe to consider for deletion after the Azure web app path is stable and any open PR/issue references are closed:

- `ACE26_Goldberg_McCormick_Jariz.pptx`: keep local/private if needed, but do not track in the public app branch because presentation files can contain author metadata and attendee/instructor PII.
- `.azure/plan.md`: keep local only; Azure planning notes can easily drift into tenant-specific values.
- `docs/instructor-notes.md`: keep local/private only; instructor operations notes can drift into real deployment values and participant details.
- `notebooks/ace26-chat-playground-backup.ipynb`: delete when offline notebook delivery is no longer needed.
- `docs/colab-fallback.md`: delete with the notebook or replace with a short note in `docs/demo-risk-mitigation.md`.
- `notebooks/README.md`: delete if the `notebooks/` directory is removed.
- `docs/pr-description-issue-1.md`: delete after the related PR/issue workflow is complete because it is historical process text, not durable workshop documentation.

Do not delete `docs/images/` or `docs/sample-output-fort-worth-cip.md` yet; they still support low-connectivity delivery, instructor prep, and public-safe screenshots.
