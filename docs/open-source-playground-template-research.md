# Open Source Playground Template Research

The implementation in this branch is a small workshop-specific reproduction inspired by Microsoft-maintained open-source samples rather than a direct copy of any one template.

## Closest References

| Template | Why it is relevant | Fit for this repo |
| --- | --- | --- |
| [Azure-Samples/azure-search-openai-demo](https://github.com/Azure-Samples/azure-search-openai-demo) | Full RAG chat application using Azure AI Search plus Azure OpenAI, with chat, citations, settings, and deployment guidance. | Strongest reference for grounded chat behavior, but much larger than this workshop repo needs. |
| [Azure-Samples/get-started-with-ai-chat](https://github.com/Azure-Samples/get-started-with-ai-chat) | Foundry-first chat web app template with Azure AI Search support, citations, monitoring, and azd deployment pattern. | Best architectural reference for a current Foundry-oriented starter. |
| [Azure-Samples/azure-openai-chat-frontend](https://github.com/Azure-Samples/azure-openai-chat-frontend) | Reusable chat UI implementing a ChatGPT-like frontend for Azure OpenAI and AI Search backends. | Good UI reference, but it expects a separate backend and brings a full TypeScript/Lit toolchain. |
| [Azure-Samples/contoso-chat](https://github.com/Azure-Samples/contoso-chat) | End-to-end retail RAG copilot with Prompty, evaluations, deployment automation, and LLMOps practices. | Useful for production discipline, heavier than an instructor-facing workshop playground. |

## Choice

For this repo, the best fit is a custom compact app that borrows the interaction model from the Foundry/model playground and the RAG/citation pattern from `azure-search-openai-demo`.

Reasons:

- The repo already provisions Azure AI Services, Foundry project resources, Azure AI Search, storage, and a web app placeholder.
- The workshop guide already teaches the Foundry model playground, model settings, and grounded file-search workflow.
- A dependency-light Node app can run on the existing App Service without vendoring a large sample.
- Managed identity keeps the public repo free of keys and matches the infra's RBAC approach.

## Reproduced Capabilities

- Editable system instructions.
- Model deployment display from `AZURE_OPENAI_CHAT_DEPLOYMENT`.
- Reasoning effort and max completion token controls, aligned with the workshop activity.
- Chat transcript with workshop prompt shortcuts.
- Optional grounding against the configured Azure AI Search index.
- Source panel with file, page, chunk, and retrieved text.
- Foundry portal link for side-by-side comparison with the native playground.
