# Workshop Capacity Plan

This plan is for the ACE26 GenAI workshop environment in Microsoft Foundry.

## Current Capacity Finding

The grounded Fort Worth CIP test proved that file search works, but the broad prompt was expensive for a live workshop:

```text
Runtime: 243 seconds
Token usage: 41,745 tokens
Model: gpt-5.4-pro
Tool: File search
```

That result is useful as a success test, not as the default participant exercise. If 100 participants ask similarly broad grounded questions at once, the bottleneck will be token-per-minute capacity and latency, not only requests per minute.

## Recommended Deployment Roles

| Deployment | Workshop purpose | Capacity target |
| --- | --- | ---: |
| `gpt-5.4-pro` | Instructor demo and higher-quality grounded file-search work | 160 |
| `gpt-5.4-mini` | Participant prompt exercises and shorter grounded questions | 300 |
| `gpt-5.4-nano` | High-concurrency warmups, fallback prompts, and very short answers | 1000 |
| `text-embedding-3-small` | Document ingestion and embedding workflows | 100 |

The account is using `GlobalStandard` deployments. Capacity controls rate-limit headroom. Costs are still driven by actual model and embedding usage, so the live-workshop risk is many people sending large prompts or repeatedly resubmitting slow requests.

## Live Workshop Pattern

Use this pacing for 100 possible concurrent users:

- Use `gpt-5.4-nano` for the first whole-room warmup prompt.
- Use `gpt-5.4-mini` for most participant prompt-writing exercises.
- Use `gpt-5.4-pro` for instructor-led grounded file-search demonstrations.
- Allow participants to use file search in batches or with short prompts only.
- Ask participants not to resubmit while a grounded answer is still running.
- Keep grounded prompts narrow: 3-5 bullets, 4-row tables, or one named topic.

## Prompt Guardrails For Capacity

Prefer:

```text
Use the documents. In 5 bullets or fewer, name drinking-water-related capital improvement project categories in Fort Worth. Keep each bullet under 20 words.
```

Avoid as a first live prompt:

```text
Can you tell me what capital improvement projects are planned in Fort Worth related to drinking water?
```

The broad version works, but it can retrieve and summarize too much of the CIP for a room of participants.

## Scale Up And Down

Scale to the workshop profile:

```powershell
.\infra\scripts\Set-WorkshopModelCapacity.ps1 -Mode Workshop
```

Return to a smaller dev profile:

```powershell
.\infra\scripts\Set-WorkshopModelCapacity.ps1 -Mode Dev
```

The dev profile keeps the deployments available, but reduces `gpt-5.4-mini`, `gpt-5.4-nano`, and `text-embedding-3-small` to capacity 1.

Create a calendar reminder or automation for the post-workshop scale-down. Do not leave the workshop profile running after the event unless the workshop owner has approved the ongoing quota and cost.

Override individual capacities if IT grants more quota:

```powershell
.\infra\scripts\Set-WorkshopModelCapacity.ps1 `
  -Mode Workshop `
  -ProCapacity 160 `
  -MiniCapacity 500 `
  -NanoCapacity 1500 `
  -EmbeddingCapacity 100
```

## IT Enablement Notes

- Current `gpt-5.4-pro` quota in East US 2 only leaves room up to capacity 160. More `pro` headroom requires a quota increase or another region/deployment strategy.
- `gpt-5.4-mini`, `gpt-5.4`, and `gpt-5.4-nano` have more available quota in East US 2 and are better candidates for participant-scale traffic.
- Azure AI Search is currently on the free SKU for cost control. If the future web app relies on Azure AI Search for all 100 participants, plan a temporary upgrade/recreate to a paid SKU before the workshop, then scale back or delete after.
- Decision needed before the workshop: keep Azure AI Search on `free` for the Foundry-only activity, or recreate the Search service on `basic` if the web app becomes part of the live participant flow.
- Budget alerts still need billing-scope enablement. Subscription-level `Cost Management Contributor` was not enough in this tenant.
