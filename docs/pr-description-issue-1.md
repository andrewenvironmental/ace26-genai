# PR Description Draft

## Summary

Adds a lightweight ACE26 Workshop Playground app as a repo-hosted backup/teaching tool for the Foundry chat playground activity. The existing activity guide remains the canonical participant-facing walkthrough.

## Addresses Issue #1

- Researched open-source Azure chat/RAG playground templates and documented why this branch uses a compact custom implementation.
- Adds a self-contained educational chat playground similar to the Azure/Foundry model playground.
- Wires the app to existing workshop resources: Azure AI Services/OpenAI deployment, Azure AI Search `documents` index, storage container name, and Foundry portal link.
- Keeps the app controls aligned with the already-updated activity guide by exposing reasoning effort and max completion tokens, not temperature.
- Adds an instructor-facing API usage note showing how chat and search requests flow through the app.
- Adds an interactive share-out prompt in the activity panel.
- Adds demo risk-mitigation notes and identifies existing static backup artifacts.
- Adds a Jupyter/Colab backup notebook with live Azure and offline sample modes.
- Updates Bicep role assignments so the web app managed identity can call Foundry/OpenAI inference and read Azure AI Search.

## Still Open

- Prerecorded walkthrough/video of the intended workflow.
- Full low-code-only backup package beyond the existing Foundry activity guide and screenshots.

## Validation

- Run app syntax check.
- Run local app health/config smoke test.
- Review Bicep changes for expected role/app settings.
