# ACE Pre-Conference AI Workshop Hands-on Activity

Microsoft Foundry guide

## Background

Large language models can be guided with instructions, parameters, and curated data so they are more useful for technical tasks in the water and environmental fields. In this activity, you will use the Microsoft Foundry model playground to experiment with prompts, model settings, and file search over a Fort Worth Capital Improvement Program document.

This activity uses:

- Microsoft Foundry project: `aceaiworksho-ai-is6hct-project`
- Model deployment for prompt exercises: `gpt-5.4-mini`
- Model deployment for document-grounded exercises: `gpt-5.4-pro`
- File search vector store: `documents`
- Source document: Fort Worth FY2021-2025 Adopted 5 Year Capital Improvement Program

## Learning Objectives

- Interact with a large language model in Microsoft Foundry.
- Practice prompt iteration by changing instructions, output format, and level of detail.
- Observe how model parameters affect response length and reasoning behavior.
- Compare general model responses with responses grounded in workshop documents.
- Use citations and source snippets to evaluate whether an answer is supported by the provided data.
- Discuss appropriate guardrails for public-facing or operational AI tools.

## Prerequisites and Setup

1. Go to Microsoft Foundry:

   `https://ai.azure.com`

2. Sign in with the account provided for the workshop.

3. If prompted, choose the workshop tenant or directory.

4. Open the workshop project:

   `aceaiworksho-ai-is6hct-project`

5. In the top navigation, make sure the `New Foundry` toggle is on.

6. In the top navigation, select `Build`, then in the left navigation select `Models`.

7. Open the model deployment named `gpt-5.4-mini`.

   You will use `gpt-5.4-pro` later when you add the workshop document.

![Figure 1 - Microsoft Foundry project home with New Foundry enabled](images/figure-01-project-home.png)

![Figure 2 - Build > Models with the workshop model deployment selected](images/figure-02-build-models.png)

## Activity Part 1: Use the Model Playground

Estimated time: 20 minutes

In this part, you will use the Microsoft Foundry model playground to send prompts, inspect responses, and change the model instructions. The goal is not to get one perfect answer. The goal is to see how small changes in wording and context change the model's behavior.

### 1. Open the Playground

From the workshop project:

1. Confirm `New Foundry` is turned on.
2. Select `Build`.
3. Select `Models`.
4. On the `Deployments` tab, open `gpt-5.4-mini`.
5. Select the `Playground` tab.

The playground has two main working areas:

- Setup panel: choose the model, write instructions, add tools, and adjust settings.
- Chat panel: send prompts, read responses, and continue the conversation.

![Figure 3 - Model playground with deployment, instructions, and chat panel](images/figure-03-model-playground.png)

### 2. Send a General Prompt

In the chat box, ask:

```text
Can you tell me about innovative drinking water treatment technologies?
```

Read the response and make one quick note:

- What technologies did the model mention?
- Was the answer general or specific?
- Would you trust this answer in a technical memo without checking sources?

What is happening: your prompt is sent to a cloud-hosted model deployment. The model generates a response by predicting likely next tokens based on its training and the context you provide in the playground.

Broad prompts often produce broad answers. Later prompts will show how to control length, audience, and format.

### 3. Try a Public Education Task

Imagine your team is drafting a short public-facing fact sheet for water utility customers.

Ask:

```text
How does drinking water treatment work?
```

Before changing anything, observe the answer:

- Is it too long, too short, or about right?
- Is the language accessible to the public?
- Does the response include technical terms that may need explanation?

### 4. Add Instructions

In the `Instructions` field, replace the default text with:

```text
You are an AI assistant tasked with educating the public about drinking water treatment. Respond in a short paragraph using simple language at an 8th-grade reading level. Avoid technical jargon and use straightforward examples to clarify concepts.
```

The New Foundry playground may update the instructions without showing a separate `Apply` button. To make the comparison easier, select `New chat` after changing the instructions.

Ask the same question again:

```text
How does drinking water treatment work?
```

Compare the two answers:

- Did the tone change?
- Did the reading level change?
- Did the model follow the requested length?
- Which answer would be better for a customer fact sheet?

![Figure 4 - Instructions updated for public education style](images/figure-04-instructions.png)

### 5. Refine the Output Format

Keep the same instructions and ask:

```text
Explain drinking water treatment in three bullet points.
```

Then ask:

```text
Write a two-sentence social media post about why drinking water treatment matters.
```

Finally, ask:

```text
Explain drinking water treatment for a first-grade audience.
```

Notice how the same topic can become a technical explanation, a public message, or a classroom explanation depending on how the task is framed.

### 6. Optional: Generate a Stronger System Prompt

If the playground includes a `Generate system prompt` or similar option, try it:

1. Describe the task: public education about drinking water treatment.
2. Ask the playground to generate instructions.
3. Apply the generated instructions.
4. Ask the drinking water treatment question again.

Consider whether the generated instructions are clearer than the instructions you wrote manually. Good instructions often include audience, tone, format, scope, and constraints.

### Part 1 Reflection

Discuss with a neighbor or write a short note:

- What changed the answer more: the user prompt or the model instructions?
- What instruction would you add if this assistant were used by your organization?
- What would need to be verified before publishing the answer externally?

## Activity Part 2: Adjust Model Parameters

Estimated time: 10 minutes

### Open Parameters

In the playground setup panel, select the sliders icon next to the model selector.

In the GPT-5.4 playground, the visible parameters are:

- `Max Completion Tokens`: the maximum response budget.
- `Reasoning Effort`: how much reasoning work the model should use before answering.

![Figure 5 - Model parameter controls](images/figure-05-parameters.png)

### Adjust Response Length

Set `Max Completion Tokens` to a lower value such as `800`, then ask:

```text
Explain coagulation and flocculation.
```

Then try a shorter user prompt:

```text
Answer in two sentences or fewer: explain coagulation and flocculation.
```

Consider:

- Is the answer still complete?
- Is it too short for the audience?
- How does response length affect speed and cost?

### Adjust Reasoning Effort

Open `Reasoning Effort` and compare the available choices.

Ask:

```text
What is the purpose of filtration at a wastewater treatment plant? How does this treatment process work?
```

Consider:

- Does changing the reasoning setting change response speed?
- Does the answer become more concise or more detailed?
- Which setting would you choose for factual technical work?

## Activity Part 3: Knowledge Limits and Hallucinations

### Knowledge Cutoffs

Ask a current-event question:

```text
Who won the Super Bowl in 2025?
```

Consider:

- Does the model answer confidently?
- Does it say it cannot know?
- Is the answer factual?

### Organization-Specific Questions

Ask one or more of these:

```text
Tell me about water conservation efforts in Dallas.
```

```text
What are some major water treatment challenges in Fort Worth?
```

```text
How does Trinity River Water Authority manage regional water quality?
```

Consider:

- Does the model provide specific, local information?
- Does the answer sound plausible but unsupported?
- What would you need to verify before using the response?

## Activity Part 4: Ground Responses with File Search

The workshop project includes a vector store named:

```text
documents
```

This vector store contains the Fort Worth FY2021-2025 Adopted 5 Year Capital Improvement Program.

### Add File Search

For this section, open the `gpt-5.4-pro` deployment.

In the setup panel:

1. Find `Tools`.
2. Select `Add`.
3. Select `File search`.
4. In the `Attach files` dialog, choose the existing vector index:

   `documents`

5. Select `Attach`.
6. Confirm the left panel shows `File search`, `documents`, and the vector store ID.

![Figure 6 - File search tool with documents vector store attached](images/figure-06-file-search-documents.png)

> Note: The old guide referred to `Add your data`. In the New Foundry model playground, this is now presented as the `File search` tool.

### Keep Grounded Questions Small

File search works best when the question is specific and the requested output is clear. Start with a focused question:

```text
Use the documents. Answer in one short sentence: what is WTP Minor Improvements? Cite the file.
```

Then try a structured output:

```text
Use the documents. Return only a markdown table with exactly 2 rows and 3 columns: category, description, cost. Rows: WTP Minor Improvements; Major Mains Bucket. Keep descriptions under 10 words.
```

Avoid starting with broad prompts like:

```text
Can you tell me what capital improvement projects are planned in Fort Worth related to drinking water?
```

That question works, but it can take several minutes because the model may retrieve and summarize many parts of the CIP.

### Ask a Grounded Question

With file search attached to `gpt-5.4-pro`, ask:

```text
Use the documents. Answer in one short sentence: what is WTP Minor Improvements? Cite the file.
```

The response should reference the Fort Worth CIP PDF and show `File search` under the answer.

![Figure 7 - Grounded response with references](images/figure-07-grounded-response-references.png)

Consider:

- Does the grounded answer refer to the Fort Worth CIP?
- Are references shown?
- Are the references relevant to the answer?
- Is the answer slower than the ungrounded answer?

### Create a Structured Output

For the structured table exercise, open `gpt-5.4-mini` and attach the same `documents` file search vector store.

Ask:

```text
Use the documents. Return only a markdown table with exactly 2 rows and 3 columns: category, description, cost. Rows: WTP Minor Improvements; Major Mains Bucket. Keep descriptions under 10 words.
```

![Figure 8 - Structured table response using file search](images/figure-08-structured-table-response.png)

Optional broader prompt:

```text
Use the documents. In 5 bullets or fewer, name drinking-water-related capital improvement project categories in Fort Worth. Keep each bullet under 20 words.
```

If the answer is slow, wait for the model to finish rather than resubmitting.

Avoid broad table prompts like:

```text
Use the documents. Create a small table with 4 rows. Columns: project category, description, cost, and source note. Focus on drinking water.
```

Consider:

- Are all table cells populated?
- Which fields are supported by the cited document?
- Does the model include information that may need verification?
- Would this output be good enough to paste into a spreadsheet?

## Activity Part 5: Safety and Guardrails

In `gpt-5.4-mini`, add or update the instructions:

```text
Only answer questions related to water, wastewater, environmental engineering, public infrastructure, or the provided documents. If a question is outside this scope, briefly explain that the workshop assistant is focused on water and environmental topics.
```

Select `New chat`, then ask an off-topic question:

```text
Write a movie review of a superhero film.
```

Consider:

- Did the model follow the scope restriction?
- Would stronger guardrails be needed for a public-facing tool?
- What additional policies would apply to operational or critical infrastructure use cases?

![Figure 9 - Guardrail instruction and off-topic refusal](images/figure-09-guardrail-response.png)

## Wrap Up

In this activity, you configured a model to:

- Respond with different styles and formats.
- Adjust behavior through instructions and parameters.
- Use file search to ground answers in a workshop document.
- Return structured outputs such as tables.
- Apply simple scope guardrails.

Key takeaways:

- LLM responses can sound convincing even when they are incomplete or unsupported.
- Grounding with curated documents improves relevance, but does not guarantee completeness.
- Citations and references help users verify the answer.
- Prompting is iterative.
- File search adds retrieval steps, so grounded answers can be slower than general chat.
