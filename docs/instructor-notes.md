# Instructor Notes

These notes support the ACE Pre-Conference AI Workshop activity guide.

## Screenshot Checklist

The participant guide uses screenshots from the signed-in workshop environment:

- Project home with `New Foundry` enabled.
- `Build > Models` showing the deployed workshop models.
- Model playground setup panel and chat panel.
- Instructions field after editing the system prompt.
- Parameter controls for max completion tokens and reasoning effort.
- File search tool with vector store `documents` attached.
- Grounded answer with references expanded.
- Structured table response from the Fort Worth CIP.
- Guardrail instruction and off-topic response.

Refresh the screenshots if the Microsoft Foundry UI changes before publication.

## Capacity Plan

For a room with up to 100 concurrent users, avoid sending everyone straight into broad file-search questions. Use this flow:

- `gpt-5.4-nano`: first warmup prompt for the whole room.
- `gpt-5.4-mini`: most individual prompt exercises.
- `gpt-5.4-pro`: instructor-led grounded file-search demo and small participant batches.

Before the workshop, apply the workshop capacity profile:

```powershell
.\infra\scripts\Set-WorkshopModelCapacity.ps1 -Mode Workshop
```

After the workshop, return to the dev profile:

```powershell
.\infra\scripts\Set-WorkshopModelCapacity.ps1 -Mode Dev
```

The full capacity plan is in `infra/WORKSHOP_CAPACITY.md`.

## Facilitation Notes

- Keep file search turned off during Part 1 so participants can compare baseline model behavior with grounded responses later.
- File search adds retrieval work. Ask participants to wait for grounded answers to finish before submitting another prompt.
- The broad Fort Worth CIP prompt can take several minutes. Use the focused prompts in the activity for the main walkthrough.
- `gpt-5.4-pro` supports `medium`, `high`, and `xhigh` reasoning effort in this environment. It returned an unsupported-parameter error when set to `low`.
- The structured table example completed more reliably with `gpt-5.4-mini` than `gpt-5.4-pro` in the playground.

## Current Infrastructure Values

These values come from `.env` or `infra/main.parameters.local.json`. Replace placeholders with your actual environment values.

- Resource group: `$AZURE_RESOURCE_GROUP`
- AI Services account: `$AZURE_AI_SERVICES_ACCOUNT`
- Foundry project: `$AZURE_AI_SERVICES_PROJECT`
- Chat deployment: `gpt-5.4-pro`
- Participant deployment: `gpt-5.4-mini`
- High-concurrency fallback deployment: `gpt-5.4-nano`
- Embedding deployment: `text-embedding-3-small`
- Vector store: `documents`
- Search index: `documents`
- Web app placeholder: see deployment outputs

## Known Operations Notes

- If vector stores do not appear, confirm the user has `Azure AI User` on the AI Services resource and project.
- If budget creation fails, IT may need to grant billing-scope permissions beyond `Cost Management Contributor`.
- If file search feels slow, use a smaller model variant for the workshop or narrow the question to a specific topic.

## Participant Troubleshooting Guide

Common issues participants may encounter and how to help them:

- **"I can't find the workshop project."** Confirm they are signed in to the correct tenant/directory. Have them select their profile icon in the top right and verify or switch directories.
- **"I don't see File search or Tools in the setup panel."** They may need to scroll down in the left setup panel. Confirm `New Foundry` is toggled on.
- **"File search is not returning results."** Confirm the `documents` vector store is attached (visible in the left panel under `File search`). If missing, walk through the attach steps again.
- **"My response is taking a very long time."** Grounded (file search) answers take longer, especially broad prompts. Ask the participant to wait rather than resubmit. If it takes more than 3-4 minutes, suggest switching to a more focused prompt.
- **"I got an error about reasoning effort."** The `low` setting is not available for `gpt-5.4-pro`. Have them set it to `medium` or higher.
- **"The model deployment is not listed."** Confirm they opened `Build > Models > Deployments`. The deployment may be in a different tab or the page may need a refresh.
- **"I'm getting rate-limited or throttled."** Multiple participants submitting broad prompts simultaneously can hit capacity. Ask the group to pause, then stagger submissions or switch to shorter prompts.
