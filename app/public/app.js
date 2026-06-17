const instructionPresets = {
  default:
    "You are an AI assistant for the ACE26 water and environmental workshop. Help participants learn prompt iteration, model settings, and document-grounded answers. Use clear language, be explicit about uncertainty, and when retrieved source snippets are supplied cite them as [source 1], [source 2], etc.",
  public:
    "You are an AI assistant tasked with educating the public about drinking water treatment. Respond in a short paragraph using simple language at an 8th-grade reading level. Avoid technical jargon and use straightforward examples to clarify concepts.",
  guardrail:
    "Only answer questions related to water, wastewater, environmental engineering, public infrastructure, or the provided documents. If a question is outside this scope, briefly explain that the workshop assistant is focused on water and environmental topics."
};

const workshopDisplayName = "ACE26 AI Pre-conference Workshop";

const legacyReasoningComparisonPrompts = new Set([
  "What is the purpose of filtration at a wastewater treatment plant? How does this treatment process work?",
  "You are advising a midsize water utility trying to reduce non-revenue water (NRW). Build a 90-day portfolio using exactly 5 actions from the list below. Constraints: total budget <= $900k, no additional headcount, and at most 2 high-complexity actions. Data: (1) District metering: cost $180k, expected NRW reduction 2.2 points, complexity medium. (2) Pressure optimization: $140k, 1.4 points, medium. (3) Acoustic leak detection sweep: $220k, 2.8 points, high. (4) Customer meter replacement blitz: $260k, 2.0 points, high. (5) SCADA alarm tuning: $90k, 0.9 points, low. (6) Illegal connection amnesty + inspection: $120k, 1.1 points, medium. (7) Night-flow analytics: $80k, 0.8 points, low. (8) Rapid repair contractor framework: $240k, 2.3 points, high. Output format: a ranked table with the 5 selected actions, totals for cost and reduction points, then a 30/60/90 timeline, then 3 key risks with mitigations, then 2 assumptions that could invalidate the plan.",
  "You are advising a midsize water utility to reduce non-revenue water (NRW). Select exactly 4 actions under these constraints: total budget <= $650k, no new headcount, and at most 1 high-complexity action. Actions: A) District metering, cost 180, impact 2.2, complexity medium. B) Pressure optimization, cost 140, impact 1.4, medium. C) Acoustic leak sweep, cost 220, impact 2.8, high. D) SCADA alarm tuning, cost 90, impact 0.9, low. E) Illegal connection amnesty + inspection, cost 120, impact 1.1, medium. F) Rapid repair contractor framework, cost 240, impact 2.3, high. Keep the answer under 220 words. Output only these sections: Selected actions, Totals and constraint check, Why the next-best excluded action was left out, One risk to monitor."
]);

const activities = [
  {
    id: "intro",
    kicker: "Start Here",
    title: "How This Lab Works",
    summary: "Before you run prompts, learn what changes from step to step and how to compare results.",
    infoOnly: true,
    learn: [
      "How each step changes what gets sent to the model",
      "What the Step Setup controls and why it matters",
      "How to tell a useful AI response from a risky one"
    ],
    tasks: [
      {
        title: "What changes as you move through the lab",
        detail:
          "Each step changes one or more parts of the request: the model deployment, system instructions, user prompt, reasoning effort, response budget, or document grounding.",
        body:
          "Use the step setup row before each run. It tells you what the app will send with the prompt. The model can only respond from the current prompt, current instructions, and any retrieved document snippets.",
        questions: [
          "What changed in this step: prompt, instructions, parameters, model, or documents?",
          "Would that change be expected to affect tone, length, detail, accuracy, speed, or citations?"
        ]
      },
      {
        title: "System instructions are part of the exercise",
        detail:
          "Some steps change the background directions sent with the prompt. When that happens, the step shows those system instructions inline so you can predict why the response should change.",
        body:
          "Do not treat the prompt box as the whole request. The full setup includes the model, system instructions, token budget, reasoning setting, and any retrieved document snippets.",
        questions: [
          "What does the system instruction ask the assistant to do differently?",
          "Would you expect that change to affect tone, scope, format, or evidence?"
        ]
      },
      {
        title: "How to compare outputs",
        detail:
          "Small changes can produce subtle differences. Compare responses by looking for evidence, unsupported specifics, missing caveats, format compliance, and usefulness for the intended audience.",
        body:
          "A longer or more confident answer is not automatically better. For public infrastructure work, the better answer is the one that is clear about uncertainty, grounded when sources are available, and easy for a human reviewer to verify.",
        questions: [
          "Which answer would you be comfortable reusing after human review?",
          "What source would you check before putting the answer in a report, memo, or public message?"
        ]
      }
    ]
  },
  {
    id: "prompting",
    kicker: "Part 1",
    title: "Use the Workshop Playground",
    summary: "Send a baseline prompt, then use instructions and prompt constraints to shape the answer.",
    learn: [
      "How prompt wording affects the tone, length, and detail of the answer",
      "How system instructions change the assistant's role and audience",
      "How to format output for different use cases: bullets, social posts, audience levels"
    ],
    settings: {
      modelHint: "mini",
      dataSourceId: "none",
      reasoningEffort: "minimal",
      maxTokens: 900,
      instructionsPreset: "default"
    },
    tasks: [
      {
        title: "1a. Configure the warmup",
        detail: "Start with a deliberately simple prompt. The point is to get a first answer on the page, then ask what you would change or ask next to make it more useful.",
        actions: [
          {
            label: "Configure warmup setup",
            modelHint: "nano",
            prompt: "In one sentence, what can generative AI help a water utility team do?"
          }
        ]
      },
      {
        title: "1b. Run a broad technical prompt",
        detail: "Use the broad prompt setup, run the question, and note whether the answer names technologies, explains evidence, or makes claims you would need to verify.",
        actions: [
          {
            label: "Prepare broad prompt",
            modelHint: "mini",
            prompt: "Can you tell me about innovative drinking water treatment technologies?"
          }
        ]
      },
      {
        title: "1c. Apply public education instructions",
        detail: "Apply the public education instructions and run the treatment question. Compare tone, reading level, and length against the broad answer.",
        actions: [
          {
            label: "Apply public instructions",
            modelHint: "mini",
            instructionsPreset: "public",
            prompt: "How does drinking water treatment work?"
          }
        ]
      },
      {
        title: "1d. Ask for three bullets",
        detail: "Use the three-bullet prompt and run it. Check whether the answer is easier to scan and whether anything important was lost.",
        actions: [
          {
            label: "Use bullet prompt",
            prompt: "Explain drinking water treatment in three bullet points."
          }
        ]
      },
      {
        title: "1e. Draft a social post",
        detail: "Use the social post prompt and run it. Check whether the tone is public-facing and whether the claim would still need review before posting.",
        actions: [
          {
            label: "Use social post prompt",
            prompt: "Write a two-sentence social media post about why drinking water treatment matters."
          }
        ]
      },
      {
        title: "1f. Change the audience level",
        detail: "Use the first-grade prompt and run it. Compare how audience framing changes word choice and technical detail.",
        actions: [
          {
            label: "Use first-grade prompt",
            prompt: "Explain drinking water treatment for a first-grade audience."
          }
        ]
      }
    ]
  },
  {
    id: "parameters",
    kicker: "Part 2",
    title: "Adjust Model Settings",
    summary: "Change response budget and reasoning effort, then compare speed, detail, and usefulness.",
    learn: [
      "What the token budget controls and when it matters",
      "How reasoning effort affects response quality and speed",
      "Why prompt-level instructions often work better than token limits alone"
    ],
    settings: {
      modelHint: "mini",
      dataSourceId: "none",
      reasoningEffort: "minimal",
      maxTokens: 800,
      instructionsPreset: "default"
    },
    tasks: [
      {
        title: "2a. Set a response budget",
        detail: "Configure an 800-token response budget, then run the process question. Watch whether the response stays complete within the smaller budget.",
        actions: [
          {
            label: "Configure 800-token setup",
            modelHint: "mini",
            maxTokens: 800,
            reasoningEffort: "minimal",
            prompt: "Explain coagulation and flocculation."
          }
        ]
      },
      {
        title: "2b. Add prompt-level brevity",
        detail: "Keep the same model settings, use the two-sentence prompt, and run it. Compare prompt-level length control with the max-token setting.",
        actions: [
          {
            label: "Use two-sentence prompt",
            prompt: "Answer in two sentences or fewer: explain coagulation and flocculation."
          }
        ]
      },
      {
        title: "2c. Compare reasoning settings",
        detail:
          "Run the same constrained planning question with minimal versus default reasoning. Watch whether each response respects the budget and complexity constraints — or ignores them.",
        comparison: true,
        actions: [
          {
            label: "Minimal reasoning",
            modelHint: "mini",
            reasoningEffort: "minimal",
            maxTokens: 1000,
            prompt:
              "You are advising a midsize water utility to reduce non-revenue water (NRW). Select exactly 4 actions under these constraints: total budget <= $650k, no new headcount, and at most 1 high-complexity action. Actions: A) District metering, cost 180, impact 2.2, complexity medium. B) Pressure optimization, cost 140, impact 1.4, medium. C) Acoustic leak sweep, cost 220, impact 2.8, high. D) SCADA alarm tuning, cost 90, impact 0.9, low. E) Illegal connection amnesty + inspection, cost 120, impact 1.1, medium. F) Rapid repair contractor framework, cost 240, impact 2.3, high. Keep the answer under 200 words. Output only: Selected actions (ranked with cost and impact), Totals and constraint check, Why the highest-impact excluded action was left out, One risk to monitor."
          },
          {
            label: "Default reasoning",
            modelHint: "mini",
            reasoningEffort: "",
            maxTokens: 1000,
            prompt:
              "You are advising a midsize water utility to reduce non-revenue water (NRW). Select exactly 4 actions under these constraints: total budget <= $650k, no new headcount, and at most 1 high-complexity action. Actions: A) District metering, cost 180, impact 2.2, complexity medium. B) Pressure optimization, cost 140, impact 1.4, medium. C) Acoustic leak sweep, cost 220, impact 2.8, high. D) SCADA alarm tuning, cost 90, impact 0.9, low. E) Illegal connection amnesty + inspection, cost 120, impact 1.1, medium. F) Rapid repair contractor framework, cost 240, impact 2.3, high. Keep the answer under 200 words. Output only: Selected actions (ranked with cost and impact), Totals and constraint check, Why the highest-impact excluded action was left out, One risk to monitor."
          }
        ]
      }
    ]
  },
  {
    id: "knowledge",
    kicker: "Part 3",
    title: "Knowledge Limits",
    summary: "Ask questions that need current or organization-specific verification.",
    learn: [
      "Why AI models can confidently answer questions they cannot actually know",
      "How to identify claims that require primary-source verification",
      "What kinds of questions are highest risk for public infrastructure use"
    ],
    settings: {
      modelHint: "mini",
      dataSourceId: "none",
      reasoningEffort: "minimal",
      maxTokens: 900,
      instructionsPreset: "default"
    },
    tasks: [
      {
        title: "3a. Test a not-yet-knowable fact",
        detail: "Run the future sports prompt, then check whether the model refuses, gives a caveat, or guesses anyway.",
        actions: [
          {
            label: "Use future sports check",
            prompt: "As of June 2026, who won the 2026 World Series and what was the final score?"
          }
        ]
      },
      {
        title: "3b. Plan verification for a current water rule",
        detail: "Run the PFAS verification prompt. The goal is to identify official sources and change points, not to accept an uncited status answer.",
        actions: [
          {
            label: "Use PFAS verification prompt",
            prompt:
              "Without using web access or provided documents, do not give a final status answer. As of April 2026, what official sources would you check to verify the current status of EPA's national drinking water rule for PFAS, and what details might have changed after the 2024 final rule?"
          }
        ]
      },
      {
        title: "3c. Check local specificity",
        detail: "Run the Dallas prompt. Separate broad, plausible statements from details you would need to confirm on a city or utility page.",
        actions: [
          {
            label: "Use Dallas prompt",
            prompt: "Tell me about water conservation efforts in Dallas."
          }
        ]
      },
      {
        title: "3d. Check an agency-specific claim",
        detail: "Choose one local organization prompt, run it, and identify any specific claims that need primary-source verification.",
        actions: [
          {
            label: "Use Fort Worth prompt",
            prompt: "What are the top three water treatment challenges Fort Worth Water has identified for 2026?"
          },
          {
            label: "Use TRWA prompt",
            prompt: "How does Trinity River Water Authority manage regional water quality?"
          }
        ]
      }
    ]
  },
  {
    id: "grounding",
    kicker: "Part 4",
    title: "Ground Responses With Documents",
    summary: "Attach the workshop document index and inspect the retrieved snippets behind the answer.",
    learn: [
      "How Retrieval-Augmented Generation (RAG) works in practice",
      "How to tell if an answer is supported by the retrieved document snippets",
      "When grounded answers are more trustworthy than general model knowledge"
    ],
    settings: {
      modelHint: "mini",
      dataSourceHint: "documents",
      reasoningEffort: "minimal",
      maxTokens: 1100,
      sourceTop: 4,
      instructionsPreset: "default"
    },
    tasks: [
      {
        title: "4a. Attach documents for a focused question",
        detail: "Attach the workshop documents, run the narrow WTP Minor Improvements question, and inspect whether the response cites retrieved snippets.",
        actions: [
          {
            label: "Attach documents and prompt",
            modelHint: "mini",
            dataSourceHint: "documents",
            sourceTop: 4,
            prompt: "Use the documents. Answer in one short sentence: what is WTP Minor Improvements? Cite the file."
          }
        ]
      },
      {
        title: "4b. Request a small table",
        detail: "Use the table setup, run the prompt, and check whether every cell is supported by the retrieved document snippets.",
        actions: [
          {
            label: "Configure table prompt",
            modelHint: "mini",
            dataSourceHint: "documents",
            prompt:
              "Use the documents. Return only a markdown table with exactly 2 rows and 3 columns: category, description, cost. Rows: WTP Minor Improvements; Major Mains Bucket. Keep descriptions under 10 words."
          }
        ]
      },
      {
        title: "4c. Try a broader grounded answer",
        detail: "Use the broader document prompt and expect a slower response. Wait for the run to finish, then decide whether the answer is complete enough.",
        actions: [
          {
            label: "Use broader document prompt",
            modelHint: "mini",
            dataSourceHint: "documents",
            prompt:
              "Use the documents. In 5 bullets or fewer, name drinking-water-related capital improvement project categories in Fort Worth. Keep each bullet under 20 words."
          }
        ]
      }
    ]
  },
  {
    id: "guardrails",
    kicker: "Part 5",
    title: "Safety And Guardrails",
    summary: "Use instructions to constrain scope, then test whether the assistant stays inside it.",
    learn: [
      "How to write a system instruction that constrains the assistant's scope",
      "How to test whether a guardrail actually holds",
      "Why guardrails still require human review before publishing AI-assisted content"
    ],
    settings: {
      modelHint: "mini",
      dataSourceId: "none",
      reasoningEffort: "minimal",
      maxTokens: 700,
      instructionsPreset: "default"
    },
    tasks: [
      {
        title: "5a. Apply a scope guardrail",
        detail: "Apply the guardrail instructions and run the movie-review prompt. A good result refuses briefly and redirects to the workshop scope.",
        actions: [
          {
            label: "Apply guardrail setup",
            instructionsPreset: "guardrail",
            modelHint: "mini",
            prompt: "Write a movie review of a superhero film."
          }
        ]
      },
      {
        title: "5b. Confirm in-scope recovery",
        detail: "Run the source-verification prompt without removing the guardrail. Confirm the assistant can still answer in-scope questions.",
        actions: [
          {
            label: "Use source-verification prompt",
            instructionsPreset: "guardrail",
            prompt: "In two sentences, explain why source verification matters for public infrastructure AI tools."
          }
        ]
      }
    ]
  },
  {
    id: "wrap",
    kicker: "Wrap Up",
    title: "Compare And Discuss",
    summary: "Capture what changed when you adjusted instructions, model settings, and document grounding.",
    learn: [
      "How to summarize what changed across the lab exercises",
      "How to draft practical guardrails your organization could adopt",
      "What questions to bring back to your team after this workshop"
    ],
    settings: {
      modelHint: "mini",
      dataSourceId: "none",
      reasoningEffort: "minimal",
      maxTokens: 700,
      instructionsPreset: "default"
    },
    tasks: [
      {
        title: "6a. Compare what changed",
        detail: "Run this reflection prompt after you have a few outputs. Use the answer to start the group discussion, not as the final truth.",
        actions: [
          {
            label: "Use reflection prompt",
            prompt:
              "In two sentences, what changed after adding instructions, changing parameters, or retrieving workshop documents?"
          }
        ]
      },
      {
        title: "6b. Draft operational guardrails",
        detail: "Run the guardrail prompt and edit the result into three rules your organization could actually review and enforce.",
        actions: [
          {
            label: "Use guardrail prompt",
            prompt:
              "Give me three concise guardrails a public agency should use before publishing AI-assisted technical content."
          }
        ]
      }
    ]
  }
];

const stepReflections = {
  "1a. Configure the warmup": {
    title: "First pass, not final answer",
    body:
      "This warmup introduces the activity with a simple answer, but the answer is only a starting point. For a real utility workflow, you might ask for a list of use cases, choose a specific team or task, request examples, compare risks, or move to a different topic.",
    questions: [
      "What follow-up would make this more useful: a list, examples, a different audience, or another topic?",
      "What context about the utility team would change the answer?"
    ]
  },
  "1b. Run a broad technical prompt": {
    title: "What changed",
    body:
      "A broad prompt usually produces a broad answer. It may sound useful, but it often lacks source support, local context, and a clear audience.",
    questions: ["Which claims would need verification?", "What audience or output format would make the answer more useful?"]
  },
  "1c. Apply public education instructions": {
    title: "What changed",
    body:
      "System instructions changed the assistant's role, audience, tone, and reading level before the user prompt was sent.",
    questions: ["Did the answer become easier for the public to read?", "Did simplifying the language remove any important technical nuance?"]
  },
  "1d. Ask for three bullets": {
    title: "What changed",
    body:
      "The user prompt constrained the output format. Format constraints can make responses easier to scan, reuse, or review.",
    questions: ["Did the bullets improve usability?", "Did the constraint hide anything important?"]
  },
  "1e. Draft a social post": {
    title: "What changed",
    body:
      "The prompt changed the communication channel and tone. Public-facing text needs extra review for accuracy, claims, and policy fit.",
    questions: ["Would you publish this as written?", "What claim would a communications or technical reviewer check first?"]
  },
  "1f. Change the audience level": {
    title: "What changed",
    body:
      "The audience changed, so the model changed vocabulary and level of detail. Audience framing can be as important as the technical topic.",
    questions: ["What became clearer?", "What became too simplified for a technical audience?"]
  },
  "2a. Set a response budget": {
    title: "What changed",
    body:
      "Max completion tokens set the response budget. It can limit length and cost, but it does not tell the model what information matters most.",
    questions: ["Was the answer complete enough?", "Would a direct length instruction work better than only changing token budget?"]
  },
  "2b. Add prompt-level brevity": {
    title: "What changed",
    body:
      "The prompt now directly tells the model to answer in two sentences. Prompt-level constraints are often easier to observe than token settings.",
    questions: ["Did the answer follow the sentence limit?", "Was it still useful for the intended reader?"]
  },
  "2c. Compare reasoning settings": {
    title: "What changed",
    body:
      "Both runs used the same model and prompt, but changed only the reasoning setting. Minimal reasoning sometimes skips constraint verification and picks a higher-impact but non-compliant portfolio. Default reasoning tends to check arithmetic and constraints more carefully before selecting.",
    questions: [
      "Did one response violate the budget or complexity cap?",
      "Which response would you trust more before using it to make a real decision?"
    ]
  },
  "3a. Test a not-yet-knowable fact": {
    title: "What happened",
    body:
      "A future or not-yet-knowable fact is a clean test of whether the model will admit uncertainty or fabricate a confident answer.",
    questions: ["Did the model clearly say the event had not happened yet?", "What would make a guessed answer risky?"]
  },
  "3b. Plan verification for a current water rule": {
    title: "What happened",
    body:
      "Regulatory status can change over time. In this step, the better answer is a verification plan that names official sources and specific details to confirm.",
    questions: ["Did the model avoid giving an uncited final status?", "Which EPA, Federal Register, or court source would you check first?"]
  },
  "3c. Check local specificity": {
    title: "What happened",
    body:
      "Local organization questions often produce plausible but generic answers unless the model has current, specific sources.",
    questions: ["Which details sounded local and specific?", "Which ones need confirmation?"]
  },
  "3d. Check an agency-specific claim": {
    title: "What happened",
    body:
      "Agency-specific answers should be treated as leads for research, not final facts, unless they are grounded in reliable sources.",
    questions: ["What claim would be risky to reuse?", "Where would you verify it?"]
  },
  "4a. Attach documents for a focused question": {
    title: "What changed",
    body:
      "This run added retrieved document snippets to the model context. Grounding can improve specificity, but the citations still need inspection.",
    questions: ["Do the retrieved snippets support the answer?", "Is anything missing or inferred beyond the snippets?"]
  },
  "4b. Request a small table": {
    title: "What changed",
    body:
      "The prompt combines document grounding with a strict structure. Tables are useful only if each cell can be traced back to support.",
    questions: ["Are all cells populated and supported?", "Would you paste this into a spreadsheet without editing?"]
  },
  "4c. Try a broader grounded answer": {
    title: "What changed",
    body:
      "Broader grounded prompts ask retrieval and summarization to do more work. They can be slower and may miss parts of a large document.",
    questions: ["Was the answer complete enough?", "Would narrowing the question improve trust and speed?"]
  },
  "5a. Apply a scope guardrail": {
    title: "What changed",
    body:
      "The system instructions now define an allowed scope. The off-topic prompt tests whether the assistant follows that boundary.",
    questions: ["Did the assistant refuse briefly?", "Would this guardrail be strong enough for a public tool?"]
  },
  "5b. Confirm in-scope recovery": {
    title: "What changed",
    body:
      "A useful guardrail should not make the assistant unhelpful. This run checks whether it can still answer an in-scope question.",
    questions: ["Did the assistant recover gracefully?", "What policy should govern acceptable in-scope answers?"]
  },
  "6a. Compare what changed": {
    title: "Discussion prompt",
    body:
      "This summary is a starting point for discussion. Your own observations from the runs are more important than the model's reflection.",
    questions: ["Which change had the biggest effect?", "Which result would need the most human review?"]
  },
  "6b. Draft operational guardrails": {
    title: "Discussion prompt",
    body:
      "Operational guardrails should be concrete enough for people to review, enforce, and improve over time.",
    questions: ["Which guardrail is specific enough to implement?", "What approval or source-checking step is missing?"]
  }
};

activities.forEach((activity) => {
  activity.tasks.forEach((task) => {
    if (stepReflections[task.title]) {
      task.afterRun = stepReflections[task.title];
    }
  });
});

const state = {
  latestSources: [],
  busy: false,
  config: null,
  activeActivityId: activities[0].id,
  pendingTask: null,
  cellPrompts: {},
  cellOutputs: {},
  preparedActions: {},
  completed: loadCompleted(),
  accessRequired: false,
  accessCode: localStorage.getItem("ace26-access-code") || ""
};

const reasoningLabels = {
  "": "Default",
  minimal: "Minimal",
  low: "Low",
  medium: "Medium",
  high: "High",
  xhigh: "Extra high"
};

const instructionPresetLabels = {
  default: "Workshop",
  public: "Public education",
  guardrail: "Guardrail"
};

const elements = {
  accessCode: document.querySelector("#access-code"),
  accessForm: document.querySelector("#access-form"),
  accessGate: document.querySelector("#access-gate"),
  accessHelp: document.querySelector("#access-help"),
  activityKicker: document.querySelector("#activity-kicker"),
  activityNav: document.querySelector("#activity-nav"),
  activityLearn: document.querySelector("#activity-learn"),
  activityProgress: document.querySelector("#activity-progress"),
  activityProgressBar: document.querySelector("#activity-progress-bar"),
  activitySummary: document.querySelector("#activity-summary"),
  activityTasks: document.querySelector("#activity-tasks"),
  activityTitle: document.querySelector("#activity-title"),
  appShell: document.querySelector("#app-shell"),
  appTitle: document.querySelector("#app-title"),
  dataSourceHelp: document.querySelector("#data-source-help"),
  dataSourceSelect: document.querySelector("#data-source-select"),
  instructions: document.querySelector("#instructions"),
  maxTokens: document.querySelector("#max-tokens"),
  modelHelp: document.querySelector("#model-help"),
  modelSelect: document.querySelector("#model-select"),
  newChat: document.querySelector("#new-chat"),
  presetButtons: document.querySelectorAll(".preset-button"),
  reasoningEffort: document.querySelector("#reasoning-effort"),
  resetInstructions: document.querySelector("#reset-instructions"),
  resetLab: document.querySelector("#reset-lab"),
  saveAccessCode: document.querySelector("#save-access-code"),
  settingsSummary: document.querySelector("#settings-summary"),
  sourceCount: document.querySelector("#source-count"),
  sourceTop: document.querySelector("#source-top"),
  sources: document.querySelector("#sources"),
  usageSummary: document.querySelector("#usage-summary"),
  activityProgressWidget: document.querySelector(".activity-progress"),
  introFooter: document.querySelector("#intro-footer")
};

init();

async function init() {
  bindEvents();
  renderActivityNav();
  renderActivity();

  try {
    const config = await apiGet("/api/config");
    state.config = config;
    instructionPresets.default = config.defaultInstructions || instructionPresets.default;
    elements.appTitle.textContent = workshopDisplayName;
    document.title = workshopDisplayName;
    elements.instructions.value = instructionPresets.default;
    syncPresetButtons();
    await configureAccessGate(config.access);

    populateModels(config.models || []);
    populateDataSources(config.dataSources || []);
    updateSettingsSummary();
    applyActivityDefaults(currentActivity());
    renderActivityNav();
    renderActivity();
  } catch (error) {
    elements.activityTitle.textContent = "Configuration failed";
    elements.activitySummary.textContent = error.message;
  } finally {
    document.body.classList.remove("configuring");
  }
}

function bindEvents() {
  elements.activityNav.addEventListener("click", (event) => {
    const button = event.target.closest("[data-activity-id]");
    if (!button) {
      return;
    }
    state.activeActivityId = button.dataset.activityId;
    renderActivityNav();
    renderActivity();
    applyActivityDefaults(currentActivity());
  });

  elements.activityTasks.addEventListener("input", (event) => {
    const promptBox = event.target.closest("[data-cell-prompt]");
    if (!promptBox) {
      return;
    }

    state.cellPrompts[promptBox.dataset.cellPrompt] = promptBox.value;
  });

  elements.activityTasks.addEventListener("click", async (event) => {
    const startWorkshopBtn = event.target.closest("[data-start-workshop]");
    if (startWorkshopBtn) {
      state.activeActivityId = "prompting";
      renderActivityNav();
      renderActivity();
      return;
    }

    const runButton = event.target.closest("[data-run-task]");
    const actionButton = event.target.closest("[data-action-index]");
    const activity = currentActivity();

    if (runButton) {
      const taskIndex = Number(runButton.dataset.runTask);
      const key = taskKey(activity.id, taskIndex);
      const task = activity.tasks[taskIndex];
      const prompt = (state.cellPrompts[key] || "").trim();
      if (!prompt || state.busy) {
        return;
      }
      if (task.comparison) {
        await runComparisonPrompt(activity, task, taskIndex, prompt);
        return;
      }
      if (task.actions?.length && state.preparedActions[key] === undefined) {
        const defaultActionIndex = 0;
        applyAction(stepActionSettings(activity, task, defaultActionIndex), { keepPrompt: true });
        state.preparedActions[key] = defaultActionIndex;
        state.cellPrompts[key] = prompt;
      }
      state.pendingTask = { activityId: activity.id, taskIndex };
      await sendPrompt(prompt, state.pendingTask);
      return;
    }

    if (actionButton) {
      const taskIndex = Number(actionButton.dataset.taskIndex);
      const task = activity.tasks[taskIndex];
      if (task.comparison) {
        return;
      }
      const actionIndex = Number(actionButton.dataset.actionIndex);
      const action = task.actions[actionIndex];
      const key = taskKey(activity.id, taskIndex);
      applyAction(stepActionSettings(activity, task, actionIndex), { keepPrompt: true });
      state.pendingTask = { activityId: activity.id, taskIndex };
      state.preparedActions[key] = actionIndex;
      state.cellPrompts[key] = action.prompt || defaultTaskPrompt(task);
      renderActivityNav();
      renderActivity();
      focusCellPrompt(activity.id, taskIndex);
      return;
    }
  });

  elements.newChat.addEventListener("click", () => {
    state.latestSources = [];
    state.pendingTask = null;
    state.cellOutputs = {};
    state.preparedActions = {};
    renderActivity();
    renderSources();
    if (elements.usageSummary) elements.usageSummary.textContent = "Ready";
    focusFirstStepPrompt();
  });

  elements.resetLab.addEventListener("click", () => {
    state.completed = {};
    state.pendingTask = null;
    state.cellOutputs = {};
    state.cellPrompts = {};
    state.preparedActions = {};
    persistCompleted();
    state.activeActivityId = activities[0].id;
    renderActivityNav();
    renderActivity();
    applyActivityDefaults(currentActivity());
  });

  elements.resetInstructions.addEventListener("click", () => {
    elements.instructions.value = instructionPresets.default;
  });

  elements.accessForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await saveAccessCode();
  });

  elements.presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyInstructionsPreset(button.dataset.preset);
    });
  });

  elements.instructions.addEventListener("input", syncPresetButtons);

  [elements.modelSelect, elements.dataSourceSelect, elements.reasoningEffort, elements.maxTokens, elements.sourceTop].forEach(
    (control) => {
      control.addEventListener("change", () => {
        updateSettingsSummary();
        renderActivity();
      });
      control.addEventListener("input", () => {
        updateSettingsSummary();
        renderActivity();
      });
    }
  );

  elements.modelSelect.addEventListener("change", updateModelHelp);
  elements.dataSourceSelect.addEventListener("change", updateDataSourceHelp);
}

async function sendPrompt(prompt, taskRef = null) {
  setBusy(true);
  try {
    if (taskRef) {
      state.cellOutputs[taskKey(taskRef.activityId, taskRef.taskIndex)] = { pending: true, prompt };
      renderActivity();
    }
    updateSettingsSummary();

    const response = await requestChat(prompt);

    applyEffectiveReasoning(response.reasoningEffort);
    if (taskRef) {
      state.cellOutputs[taskKey(taskRef.activityId, taskRef.taskIndex)] = {
        prompt,
        response: assistantResponseText(response),
        sources: response.sources || [],
        usage: response.usage || null
      };
    }
    state.latestSources = response.sources || [];
    renderSources();
    renderUsage(response);
    completePendingTask();
  } catch (error) {
    if (taskRef) {
      state.cellOutputs[taskKey(taskRef.activityId, taskRef.taskIndex)] = {
        prompt,
        error: error.message || "Request failed."
      };
      renderActivity();
    }
    if (elements.usageSummary) elements.usageSummary.textContent = "Failed";
    if (state.accessRequired && (error.status === 401 || error.status === 403)) {
      state.accessCode = "";
      localStorage.removeItem("ace26-access-code");
      elements.accessCode.value = "";
      elements.accessHelp.textContent = "That code was not accepted. Enter the workshop code to continue.";
      showAccessGate();
    }
  } finally {
    setBusy(false);
  }
}

async function requestChat(prompt, settings = null, options = {}) {
  return apiPost("/api/chat", {
    messages: [{ role: "user", content: prompt }],
    systemPrompt: systemPromptFromSettings(settings),
    modelDeployment: modelIdFromSettings(settings) || elements.modelSelect.value,
    reasoningEffort: settings?.reasoningEffort ?? elements.reasoningEffort.value,
    maxCompletionTokens: Number(settings?.maxTokens || elements.maxTokens.value),
    dataSourceId: dataSourceIdFromSettings(settings) || elements.dataSourceSelect.value,
    top: Number(settings?.sourceTop || elements.sourceTop.value)
  }, options);
}

function systemPromptFromSettings(settings = null) {
  if (settings?.instructionsPreset && instructionPresets[settings.instructionsPreset]) {
    return instructionPresets[settings.instructionsPreset];
  }
  return elements.instructions.value;
}

async function runComparisonPrompt(activity, task, taskIndex, prompt) {
  const key = taskKey(activity.id, taskIndex);
  setBusy(true);
  try {
    state.pendingTask = { activityId: activity.id, taskIndex };
    const actions = Array.isArray(task.actions) ? task.actions : [];
    if (!actions.length) {
      throw new Error("Comparison setup is missing. Reload the page and try again.");
    }

    state.cellOutputs[key] = {
      comparison: true,
      pending: true,
      prompt,
      variants: actions.map((action) => ({
        label: action.label,
        pending: true,
        settings: stepSetupItems({ ...(activity.settings || {}), ...action })
      }))
    };
    renderActivity();

    const results = [];
    for (let index = 0; index < actions.length; index += 1) {
      const action = actions[index];
      // Run variants in sequence to reduce transient fetch failures during long model calls.
      results.push(await runComparisonVariant(activity, action, key, index, prompt));
    }
    const lastSuccessful = [...results].reverse().find((result) => result?.sources);
    state.latestSources = lastSuccessful?.sources || [];
    renderSources();
    if (!lastSuccessful) {
      if (elements.usageSummary) elements.usageSummary.textContent = "Comparison complete";
    }
    state.cellOutputs[key].pending = false;
    state.pendingTask = null;
    markTask(activity.id, taskIndex, true);
  } catch (error) {
    state.cellOutputs[key] = {
      prompt,
      error: error.message || "Comparison failed to start."
    };
    state.pendingTask = null;
  } finally {
    setBusy(false);
    renderActivity();
  }
}

async function runComparisonVariant(activity, action, key, variantIndex, prompt) {
  const settings = { ...(activity.settings || {}), ...action };
  updateComparisonVariant(key, variantIndex, { pending: true });

  try {
    let response;
    try {
      response = await requestChat(prompt, settings, { timeoutMs: 150000 });
    } catch (error) {
      if ((error.message || "").toLowerCase().includes("failed to fetch")) {
        response = await requestChat(prompt, settings, { timeoutMs: 150000 });
      } else {
        throw error;
      }
    }

    updateComparisonVariant(key, variantIndex, {
      pending: false,
      response: assistantResponseText(response),
      sources: response.sources || [],
      usage: response.usage || null
    });
    renderUsage(response);
    return response;
  } catch (error) {
    updateComparisonVariant(key, variantIndex, {
      pending: false,
      error: error.message || "Request failed."
    });
    return null;
  }
}

function updateComparisonVariant(key, variantIndex, patch) {
  const output = state.cellOutputs[key];
  if (!output?.comparison) {
    return;
  }

  output.variants[variantIndex] = {
    ...output.variants[variantIndex],
    ...patch
  };
  renderActivity();
}

function applyEffectiveReasoning(reasoningEffort) {
  if (!reasoningEffort || elements.reasoningEffort.value === reasoningEffort) {
    return;
  }

  elements.reasoningEffort.value = reasoningEffort;
  updateModelHelp();
}

function completePendingTask() {
  if (!state.pendingTask) {
    return;
  }

  const { activityId, taskIndex } = state.pendingTask;
  state.pendingTask = null;
  markTask(activityId, taskIndex, true);
}

function populateModels(models) {
  elements.modelSelect.innerHTML = "";

  if (!models.length) {
    elements.modelSelect.innerHTML = '<option value="">Not configured</option>';
    elements.modelSelect.disabled = true;
    elements.modelHelp.textContent = "No model deployment has been configured for the app.";
    return;
  }

  elements.modelSelect.disabled = false;
  elements.modelSelect.innerHTML = models
    .map((model) => {
      const selected = model.id === state.config.defaultModelId || model.isDefault ? " selected" : "";
      return `<option value="${escapeHtml(model.id)}"${selected}>${escapeHtml(model.label || model.name)}</option>`;
    })
    .join("");
  updateModelHelp();
}

async function configureAccessGate(access) {
  const codeRequired = Boolean(access?.codeRequired);
  state.accessRequired = codeRequired;
  elements.accessCode.value = state.accessCode;

  if (!codeRequired) {
    hideAccessGate();
    return;
  }

  if (state.accessCode) {
    elements.accessHelp.textContent = "Checking saved access code...";
    const isValid = await validateAccessCode(state.accessCode);
    if (isValid) {
      elements.accessHelp.textContent = "Access code accepted.";
      hideAccessGate();
      return;
    }

    state.accessCode = "";
    localStorage.removeItem("ace26-access-code");
    elements.accessCode.value = "";
    elements.accessHelp.textContent = "Saved access code was not accepted. Enter the workshop code to continue.";
  } else {
    elements.accessHelp.textContent = "Enter the workshop code to start the activity.";
  }

  showAccessGate();
}

async function saveAccessCode() {
  const code = elements.accessCode.value.trim();
  if (!code) {
    elements.accessHelp.textContent = "Enter the workshop code to continue.";
    elements.accessCode.focus();
    return;
  }

  elements.saveAccessCode.disabled = true;
  elements.accessHelp.textContent = "Checking access code...";
  const isValid = await validateAccessCode(code);
  elements.saveAccessCode.disabled = false;
  if (!isValid) {
    state.accessCode = "";
    localStorage.removeItem("ace26-access-code");
    elements.accessHelp.textContent = "That code was not accepted. Check the workshop code and try again.";
    elements.accessCode.focus();
    return;
  }

  state.accessCode = code;
  localStorage.setItem("ace26-access-code", state.accessCode);
  elements.accessHelp.textContent = "Access code accepted.";
  hideAccessGate();
  focusFirstStepPrompt();
}

async function validateAccessCode(code) {
  if (!state.accessRequired) {
    return true;
  }

  try {
    await apiPost("/api/access/validate", {}, { accessCode: code, timeoutMs: 20000 });
    return true;
  } catch {
    return false;
  }
}

function showAccessGate() {
  elements.accessGate.hidden = false;
  elements.appShell.setAttribute("aria-hidden", "true");
  document.body.classList.add("access-locked");
  requestAnimationFrame(() => elements.accessCode.focus());
}

function hideAccessGate() {
  elements.accessGate.hidden = true;
  elements.appShell.removeAttribute("aria-hidden");
  document.body.classList.remove("access-locked");
}

function populateDataSources(dataSources) {
  const sources = dataSources.length
    ? dataSources
    : [
        {
          id: "none",
          name: "No grounding",
          type: "none",
          enabled: true,
          description: "General model response without retrieved sources."
        }
      ];

  elements.dataSourceSelect.innerHTML = sources
    .map((source) => {
      const disabled = source.enabled ? "" : " disabled";
      const selected = source.id === "none" ? " selected" : "";
      return `<option value="${escapeHtml(source.id)}"${disabled}${selected}>${escapeHtml(source.name)}</option>`;
    })
    .join("");

  const preferred = sources.find((source) => source.id === state.config.defaultDataSourceId && source.enabled);
  elements.dataSourceSelect.value = preferred?.id || "none";
  updateDataSourceHelp();
}

function renderActivityNav() {
  elements.activityNav.innerHTML = activities
    .map((activity) => {
      const isActive = activity.id === state.activeActivityId;
      const done = activity.tasks.filter((_, index) => isTaskComplete(activity.id, index)).length;
      const isComplete = done === activity.tasks.length;
      return `
        <button class="part-button ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}" type="button" data-activity-id="${activity.id}" aria-current="${isActive ? "step" : "false"}">
          <span class="part-kicker">${escapeHtml(activity.kicker)}</span>
          <strong>${escapeHtml(activity.title)}</strong>
          ${activity.infoOnly ? "" : `<span class="part-count">${done}/${activity.tasks.length}</span>`}
        </button>
      `;
    })
    .join("");
}

function renderActivity() {
  const activity = currentActivity();
  elements.activityKicker.textContent = activity.kicker;
  elements.activityTitle.textContent = activity.title;
  elements.activitySummary.textContent = activity.summary;
  if (elements.activityLearn) {
    if (activity.learn?.length) {
      elements.activityLearn.hidden = false;
      elements.activityLearn.innerHTML = `
        <strong class="activity-learn-heading">What you\'ll learn</strong>
        <ul>${activity.learn.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      `;
    } else {
      elements.activityLearn.hidden = true;
    }
  }
  renderTaskProgress(activity);

  elements.activityTasks.innerHTML = activity.tasks
    .map((task, taskIndex) => {
      if (activity.infoOnly || !task.actions?.length) {
        return renderInfoTask(task, taskIndex);
      }

      const complete = isTaskComplete(activity.id, taskIndex);
      const active = isTaskPending(activity.id, taskIndex);
      const key = taskKey(activity.id, taskIndex);
      const prompt = cellPrompt(activity.id, taskIndex, task);
      const output = state.cellOutputs[key];
      const preparedActionIndex = state.preparedActions[key];
      const prepared = active || preparedActionIndex !== undefined;
      const stateLabel = output?.pending ? "Running" : complete ? "Complete" : prepared ? "Prompt prepared" : "Not run yet";
      const actions = renderTaskActions(task, taskIndex, preparedActionIndex, complete, activity);

      return `
        <article class="task-item ${complete ? "complete" : ""} ${active ? "active" : ""}">
          <div class="task-heading">
            <span class="task-step">${taskIndex + 1}</span>
            <div class="task-copy">
              <div class="task-title-row">
                <h3>${escapeHtml(displayTaskTitle(task.title))}</h3>
                <span class="task-state">${escapeHtml(stateLabel)}</span>
              </div>
              <p>${escapeHtml(task.detail)}</p>
            </div>
          </div>
          <div class="task-actions">
            ${task.actions?.length && !task.comparison ? `<span class="task-actions-hint">Optional: load a suggested setup into global controls</span>` : ""}
            ${actions}
          </div>
          ${renderStepSetup(activity, task, preparedActionIndex)}
          <label class="cell-prompt-label" for="cell-prompt-${escapeHtml(key)}">Your question</label>
          <textarea id="cell-prompt-${escapeHtml(key)}" class="cell-prompt" placeholder="Type your question here, or load one from a suggested setup above&hellip;" data-cell-prompt="${escapeHtml(key)}" rows="3">${escapeHtml(prompt)}</textarea>
          <div class="cell-footer">
            <span>${escapeHtml(task.comparison ? comparisonRunCaption(activity, task) : stepRunCaption(activity, task, preparedActionIndex))}</span>
            <button class="run-step-button" type="button" data-run-task="${taskIndex}"${state.busy ? " disabled" : ""}>${output?.pending ? "Running\u2026" : task.comparison ? "Run comparison" : "Send \u2192"}</button>
          </div>
          ${renderCellOutput(output, task)}
        </article>
      `;
    })
    .join("");

  if (elements.introFooter) {
    if (activity.id === "intro") {
      elements.introFooter.hidden = false;
      elements.introFooter.innerHTML = `
        <p class="intro-footer-hint">Read the orientation above, then use <strong>Step Setup</strong> below to configure your model before starting.</p>
        <button class="primary-button pulse-button" type="button" data-start-workshop>Start Part 1: Playground &rarr;</button>
      `;
      elements.introFooter.querySelector("[data-start-workshop]").addEventListener("click", () => {
        state.activeActivityId = "prompting";
        renderActivityNav();
        renderActivity();
      });
    } else {
      elements.introFooter.hidden = true;
      elements.introFooter.innerHTML = "";
    }
  }
}

function renderInfoTask(task, taskIndex) {
  const reflection = task.afterRun || (task.body || task.questions?.length ? { body: task.body, questions: task.questions } : null);
  return `
    <article class="task-item info-task">
      <div class="task-heading">
        <span class="task-step">${taskIndex + 1}</span>
        <div class="task-copy">
          <h3>${escapeHtml(displayTaskTitle(task.title))}</h3>
          <p>${escapeHtml(task.detail)}</p>
        </div>
      </div>
      ${renderReflection(reflection)}
    </article>
  `;
}

function renderTaskActions(task, taskIndex, preparedActionIndex, complete, activity) {
  if (task.comparison) {
    return task.actions
      .map((action) => `<span class="task-action variation-chip">${escapeHtml(action.label)}</span>`)
      .join("");
  }

  return task.actions
    .map((action, actionIndex) => {
      const selected = preparedActionIndex === actionIndex;
      const settings = { ...(activity?.settings || {}), ...action };
      const model = modelLabelFromSettings(settings);
      const reasoning = reasoningLabel(settings.reasoningEffort ?? elements.reasoningEffort.value);
      const grounding = dataSourceLabelFromSettings(settings);
      const instructions = instructionInfoFromSettings(settings);
      const chips = [model, reasoning, grounding !== "No grounding" ? grounding : null, instructions.label !== "Workshop" ? `Instructions: ${instructions.label}` : null]
        .filter(Boolean);
      return `
        <button class="task-action ${complete && selected ? "complete" : ""} ${selected && !complete ? "active" : ""}" type="button" data-task-index="${taskIndex}" data-action-index="${actionIndex}" aria-pressed="${selected ? "true" : "false"}">
          <span class="task-action-label">${escapeHtml(action.label)}</span>
          <span class="task-action-chips">${chips.map((c) => `<span class="task-action-chip">${escapeHtml(c)}</span>`).join("")}</span>
          ${selected ? '<span class="action-state">Selected</span>' : ""}
        </button>
      `;
    })
    .join("");
}

function displayTaskTitle(title) {
  return String(title || "").replace(/^\d+[a-z]\.\s*/i, "");
}

function renderStepSetup(activity, task, preparedActionIndex) {
  if (task.comparison) {
    return `
      <div class="comparison-settings" aria-label="Comparison setup">
        ${task.actions
          .map((action) => {
            const settings = { ...(activity.settings || {}), ...action };
            return `
              <section>
                <strong>${escapeHtml(action.label)}</strong>
                ${renderStepSettingsList(stepSetupItems(settings))}
                ${renderInstructionPreview(settings)}
              </section>
            `;
          })
          .join("")}
      </div>
    `;
  }

  const settings = currentControlSettings();
  return `
    <p class="step-setup-note">This run uses the current global controls shown in the setup panel.</p>
    ${renderStepSettingsList(stepSetupItems(settings))}
    ${renderInstructionPreview(settings)}
  `;
}

function currentControlSettings() {
  const settings = {
    modelDeployment: elements.modelSelect.value,
    reasoningEffort: elements.reasoningEffort.value,
    maxTokens: Number(elements.maxTokens.value),
    sourceTop: Number(elements.sourceTop.value),
    dataSourceId: elements.dataSourceSelect.value
  };

  const instructions = instructionInfoFromSettings();
  if (instructions.preset && instructions.preset !== "custom") {
    settings.instructionsPreset = instructions.preset;
  }

  return settings;
}

function stepSetupItems(settings) {
  const instructions = instructionInfoFromSettings(settings);
  const items = [
    ["Model", modelLabelFromSettings(settings)],
    ["Reasoning", reasoningLabel(settings.reasoningEffort ?? elements.reasoningEffort.value)],
    ["Max tokens", settings.maxTokens || elements.maxTokens.value],
    ["Grounding", dataSourceLabelFromSettings(settings)],
    ["Instructions", instructions.label]
  ];

  if (settings.sourceTop || settings.dataSourceHint || (settings.dataSourceId && settings.dataSourceId !== "none")) {
    items.push(["Snippets", settings.sourceTop || elements.sourceTop.value]);
  }

  return items;
}

function renderStepSettingsList(items) {
  return `
    <dl class="step-settings" aria-label="Step setup">
      ${items
        .map(
          ([label, value]) => `
            <div>
              <dt>${escapeHtml(label)}</dt>
              <dd>${escapeHtml(value || "Default")}</dd>
            </div>
          `
        )
        .join("")}
    </dl>
  `;
}

function renderInstructionPreview(settings) {
  const instructions = instructionInfoFromSettings(settings);
  const shouldPreview =
    settings.instructionsPreset && settings.instructionsPreset !== "default" ||
    instructions.preset === "guardrail" ||
    instructions.preset === "public" ||
    instructions.preset === "custom";

  if (!shouldPreview) {
    return "";
  }

  return `
    <details class="instruction-preview" open>
      <summary>System instructions applied: ${escapeHtml(instructions.label)}</summary>
      <p>${escapeHtml(instructions.text)}</p>
      <div class="instruction-prompt">${escapeHtml(instructionPreviewPrompt(instructions.preset))}</div>
    </details>
  `;
}

function instructionInfoFromSettings(settings = {}) {
  if (settings.instructionsPreset && instructionPresets[settings.instructionsPreset]) {
    return {
      label: instructionPresetLabels[settings.instructionsPreset] || settings.instructionsPreset,
      preset: settings.instructionsPreset,
      text: instructionPresets[settings.instructionsPreset]
    };
  }

  const currentText = elements.instructions?.value || instructionPresets.default;
  const presetEntry = Object.entries(instructionPresets).find(([, text]) => text === currentText);
  if (presetEntry) {
    return {
      label: instructionPresetLabels[presetEntry[0]] || presetEntry[0],
      preset: presetEntry[0],
      text: presetEntry[1]
    };
  }

  return {
    label: "Custom",
    preset: "custom",
    text: currentText
  };
}

function instructionPreviewPrompt(preset) {
  if (preset === "public") {
    return "Before running, predict how this will change tone, reading level, length, and word choice.";
  }
  if (preset === "guardrail") {
    return "Before running, predict what this should refuse and what it should still answer.";
  }
  return "Before running, predict how this background instruction will change the response.";
}

function renderCellOutput(output, task = null) {
  if (!output) {
    return "";
  }

  if (output.comparison) {
    return renderComparisonOutput(output, task);
  }

  if (output.pending) {
    return `
      <div class="cell-output pending-output">
        <strong>Running...</strong>
      </div>
    `;
  }

  if (output.error) {
    return `
      <div class="cell-output error-output">
        <strong>Request failed</strong>
        <p>${escapeHtml(output.error)}</p>
      </div>
    `;
  }

  const sources = output.sources?.length
    ? `<details class="cell-sources"><summary>${output.sources.length} retrieved source${output.sources.length === 1 ? "" : "s"}</summary>${output.sources
        .map((source, index) => `<p><strong>[source ${index + 1}]</strong> ${escapeHtml(trimSource(source))}</p>`)
        .join("")}</details>`
    : "";

  return `
    <div class="cell-output">
      <strong>Response</strong>
      <div class="message-content">${formatMessage(output.response)}</div>
      ${sources}
    </div>
    ${renderReflection(task?.afterRun)}
  `;
}

function renderComparisonOutput(output, task = null) {
  const variants = output.variants || [];
  const complete = !output.pending && variants.every((variant) => !variant.pending);
  return `
    <div class="comparison-output">
      ${variants
        .map(
          (variant) => `
            <article class="comparison-result ${variant.pending ? "pending" : ""}">
              <div class="comparison-result-head">
                <strong>${escapeHtml(variant.label)}</strong>
                <span>${variant.pending ? "Running" : variant.error ? "Failed" : "Complete"}</span>
              </div>
              ${renderStepSettingsList(variant.settings || [])}
              ${
                variant.pending
                  ? '<p class="pending-copy">Waiting for response...</p>'
                  : variant.error
                    ? `<div class="error-output"><strong>Request failed</strong><p>${escapeHtml(variant.error)}</p></div>`
                    : `<div class="message-content">${formatMessage(variant.response || emptyResponseMessage())}</div>`
              }
            </article>
          `
        )
        .join("")}
    </div>
    ${complete ? renderReflection(task?.afterRun) : ""}
  `;
}

function renderReflection(reflection) {
  if (!reflection) {
    return "";
  }

  const questions = reflection.questions?.length
    ? `<ul>${reflection.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}</ul>`
    : "";

  return `
    <aside class="reflection-card">
      <strong>${escapeHtml(reflection.title || "Consider")}</strong>
      ${reflection.body ? `<p>${escapeHtml(reflection.body)}</p>` : ""}
      ${questions}
    </aside>
  `;
}

function renderTaskProgress(activity) {
  if (elements.activityProgressWidget) {
    elements.activityProgressWidget.hidden = !!activity.infoOnly;
  }
  if (activity.infoOnly) {
    return;
  }

  const done = activity.tasks.filter((_, index) => isTaskComplete(activity.id, index)).length;
  const total = activity.tasks.length || 1;
  elements.activityProgress.textContent = `${done} of ${activity.tasks.length} tasks`;
  elements.activityProgressBar.style.width = `${Math.round((done / total) * 100)}%`;
}

function taskKey(activityId, taskIndex) {
  return `${activityId}-${taskIndex}`;
}

function defaultTaskPrompt(task) {
  return task.actions.find((action) => action.prompt)?.prompt || "";
}

function cellPrompt(activityId, taskIndex, task) {
  const key = taskKey(activityId, taskIndex);
  const defaultPrompt = defaultTaskPrompt(task);
  if (state.cellPrompts[key] === undefined) {
    state.cellPrompts[key] = defaultPrompt;
  }

  if (
    task.comparison &&
    legacyReasoningComparisonPrompts.has(state.cellPrompts[key]) &&
    defaultPrompt &&
    !legacyReasoningComparisonPrompts.has(defaultPrompt)
  ) {
    state.cellPrompts[key] = defaultPrompt;
  }

  return state.cellPrompts[key];
}

function focusCellPrompt(activityId, taskIndex) {
  const key = taskKey(activityId, taskIndex);
  requestAnimationFrame(() => {
    elements.activityTasks.querySelector(`[data-cell-prompt="${CSS.escape(key)}"]`)?.focus();
  });
}

function stepActionSettings(activity, task, actionIndex) {
  return { ...(activity.settings || {}), ...(task.actions?.[actionIndex] || {}) };
}

function focusFirstStepPrompt() {
  requestAnimationFrame(() => {
    elements.activityTasks.querySelector("[data-cell-prompt]")?.focus();
  });
}

function currentRunCaption() {
  const source = selectedDataSource();
  const model = selectedModel();
  return [
    model?.label || elements.modelSelect.value || "No model",
    reasoningLabel(elements.reasoningEffort.value),
    source?.name || "No grounding"
  ].join(" / ");
}

function stepRunCaption(activity, task, preparedActionIndex) {
  return currentRunCaption();
}

function comparisonRunCaption(activity, task) {
  const labels = task.actions.map((action) => reasoningLabel(action.reasoningEffort)).join(" vs ");
  const settings = { ...(activity.settings || {}), ...(task.actions[0] || {}) };
  return [
    modelLabelFromSettings(settings),
    labels,
    dataSourceLabelFromSettings(settings)
  ].join(" / ");
}

function modelLabelFromSettings(settings) {
  if (settings.modelDeployment) {
    return settings.modelDeployment;
  }

  if (settings.modelHint) {
    const model = modelByHint(settings.modelHint);
    return model?.label || `gpt-5.4-${settings.modelHint}`;
  }

  return selectedModel()?.label || elements.modelSelect.value || "Default";
}

function modelIdFromSettings(settings) {
  if (!settings) {
    return "";
  }

  if (settings.modelDeployment) {
    return settings.modelDeployment;
  }

  if (settings.modelHint) {
    return modelByHint(settings.modelHint)?.id || "";
  }

  return "";
}

function dataSourceLabelFromSettings(settings) {
  if (settings.dataSourceId === "none") {
    return "No grounding";
  }

  if (settings.dataSourceHint) {
    const source = dataSourceByHint(settings.dataSourceHint);
    return source?.name || "Workshop documents";
  }

  if (settings.dataSourceId) {
    const source = dataSourceById(settings.dataSourceId);
    return source?.name || settings.dataSourceId;
  }

  return selectedDataSource()?.name || "No grounding";
}

function dataSourceIdFromSettings(settings) {
  if (!settings) {
    return "";
  }

  if (settings.dataSourceId) {
    return settings.dataSourceId;
  }

  if (settings.dataSourceHint) {
    return dataSourceByHint(settings.dataSourceHint)?.id || "none";
  }

  return "";
}

function trimSource(source) {
  const location = [source.sourceFile, source.page ? `page ${source.page}` : ""].filter(Boolean).join(", ");
  const prefix = location ? `${location}: ` : "";
  return `${prefix}${String(source.content || "").slice(0, 240)}`;
}

function renderSources() {
  if (!elements.sourceCount || !elements.sources) return;
  elements.sourceCount.textContent = String(state.latestSources.length);
  if (!state.latestSources.length) {
    elements.sources.className = "sources empty-state";
    elements.sources.textContent = "No retrieved sources yet.";
    return;
  }

  elements.sources.className = "sources";
  elements.sources.innerHTML = state.latestSources
    .map((source, index) => {
      const location = [source.sourceFile, source.page ? `page ${source.page}` : "", source.chunk ? `chunk ${source.chunk}` : ""]
        .filter(Boolean)
        .join(" - ");
      return `
        <article class="source-item">
          <div class="source-heading">
            <strong>[source ${index + 1}] ${escapeHtml(source.title)}</strong>
            <span>${escapeHtml(location)}</span>
          </div>
          <p>${escapeHtml(source.content)}</p>
        </article>
      `;
    })
    .join("");
}

function renderUsage(response) {
  if (!elements.usageSummary) return;
  const usage = response.usage;
  if (!usage) {
    elements.usageSummary.textContent = "Complete";
    return;
  }

  const total = usage.total_tokens || usage.totalTokens || usage.completion_tokens || "";
  elements.usageSummary.textContent = total ? `${total} tokens` : "Complete";
}

function assistantResponseText(response) {
  const content = String(response?.message?.content || "").trim();
  if (content) {
    return content;
  }

  return emptyResponseMessage(response?.usage);
}

function emptyResponseMessage(usage = null) {
  const completionTokens = Number(usage?.completion_tokens || usage?.output_tokens || 0);
  const reasoningTokens = Number(usage?.completion_tokens_details?.reasoning_tokens || 0);

  const diagnostic = reasoningTokens > 0
    ? `The model spent ${reasoningTokens} completion tokens on reasoning before producing visible answer text.`
    : completionTokens > 0
      ? `The model used ${completionTokens} completion tokens but returned an empty answer body.`
      : "The request completed, but the model returned an empty answer body.";

  return [
    "No visible text was returned by the model.",
    "",
    diagnostic,
    "",
    "Try again with:",
    "- Higher Max tokens",
    "- Lower reasoning effort",
    "- A shorter, more specific prompt"
  ].join("\n");
}

function updateSettingsSummary() {
  if (!elements.settingsSummary) return;
  const source = selectedDataSource();
  const model = selectedModel();
  elements.settingsSummary.innerHTML = `
    <div><span>Model</span><strong>${escapeHtml(model?.label || elements.modelSelect.value || "Not configured")}</strong></div>
    <div><span>Reasoning</span><strong>${escapeHtml(reasoningLabel(elements.reasoningEffort.value))}</strong></div>
    <div><span>Max tokens</span><strong>${escapeHtml(elements.maxTokens.value)}</strong></div>
    <div><span>Data source</span><strong>${escapeHtml(source?.name || "No grounding")}</strong></div>
  `;
}

function updateModelHelp() {
  const model = selectedModel();
  syncReasoningOptions(model);
  elements.modelHelp.textContent = model
    ? `${model.recommendedFor}: ${model.description} ${reasoningSupportNote(model)}`
    : "Select a configured model deployment.";
  updateSettingsSummary();
  renderActivity();
}

function syncReasoningOptions(model = selectedModel()) {
  const supported = new Set(supportedReasoningEfforts(model));
  elements.reasoningEffort.querySelectorAll("option").forEach((option) => {
    const isSupported = supported.has(option.value);
    option.disabled = !isSupported;
    option.hidden = !isSupported;
  });

  if (!supported.has(elements.reasoningEffort.value)) {
    elements.reasoningEffort.value = supported.has("minimal") ? "minimal" : supported.has("medium") ? "medium" : "";
  }
}

function supportedReasoningEfforts(model) {
  return isProModel(model) ? ["medium", "high", ""] : ["minimal", ""];
}

function reasoningSupportNote(model) {
  if (isProModel(model)) {
    return "Reasoning options: Medium or High.";
  }
  return "Reasoning options: Minimal or Default.";
}

function isProModel(model) {
  const name = `${model?.id || ""} ${model?.name || ""} ${model?.label || ""}`.toLowerCase();
  return name.includes("pro");
}

function reasoningLabel(value) {
  return reasoningLabels[value] || value || "Default";
}

function updateDataSourceHelp() {
  const source = selectedDataSource();
  elements.dataSourceHelp.textContent = source?.description || "General model response without retrieved workshop snippets.";
  updateSettingsSummary();
  renderActivity();
}

function applyActivityDefaults(activity) {
  applyAction(activity.settings || {}, { keepPrompt: true });
}

function applyAction(action, options = {}) {
  if (action.modelHint) {
    selectModelByHint(action.modelHint);
  }
  if (action.modelDeployment) {
    setSelectValue(elements.modelSelect, action.modelDeployment);
  }
  if (action.dataSourceId) {
    setSelectValue(elements.dataSourceSelect, action.dataSourceId);
  }
  if (action.dataSourceHint) {
    selectDataSourceByHint(action.dataSourceHint);
  }
  if (action.reasoningEffort !== undefined) {
    elements.reasoningEffort.value = action.reasoningEffort;
  }
  if (action.maxTokens) {
    elements.maxTokens.value = action.maxTokens;
  }
  if (action.sourceTop) {
    elements.sourceTop.value = action.sourceTop;
  }
  if (action.instructionsPreset) {
    applyInstructionsPreset(action.instructionsPreset);
  }
  updateModelHelp();
  updateDataSourceHelp();
  updateSettingsSummary();
}

function applyInstructionsPreset(name) {
  if (instructionPresets[name]) {
    elements.instructions.value = instructionPresets[name];
  }
  syncPresetButtons();
}

function syncPresetButtons() {
  const current = elements.instructions?.value || "";
  elements.presetButtons.forEach((btn) => {
    const match = instructionPresets[btn.dataset.preset] === current;
    btn.classList.toggle("active", match);
    btn.setAttribute("aria-pressed", match ? "true" : "false");
  });
}

function selectModelByHint(hint) {
  const model = modelByHint(hint);
  if (model) {
    elements.modelSelect.value = model.id;
  }
}

function selectDataSourceByHint(hint) {
  const source = dataSourceByHint(hint);
  elements.dataSourceSelect.value = source?.id || "none";
}

function setSelectValue(select, value) {
  const option = [...select.options].find((candidate) => candidate.value === value && !candidate.disabled);
  if (option) {
    select.value = value;
  }
}

function setBusy(isBusy) {
  state.busy = isBusy;
}

function selectedModel() {
  return (state.config?.models || []).find((model) => model.id === elements.modelSelect.value);
}

function selectedDataSource() {
  return (state.config?.dataSources || []).find((source) => source.id === elements.dataSourceSelect.value);
}

function modelByHint(hint) {
  const normalized = String(hint || "").toLowerCase();
  return (state.config?.models || []).find((candidate) => candidate.id.toLowerCase().includes(normalized));
}

function dataSourceByHint(hint) {
  const normalized = String(hint || "").toLowerCase();
  return (state.config?.dataSources || []).find(
    (candidate) => candidate.enabled && candidate.id.toLowerCase().includes(normalized)
  );
}

function dataSourceById(id) {
  return (state.config?.dataSources || []).find((source) => source.id === id);
}

function currentActivity() {
  return activities.find((activity) => activity.id === state.activeActivityId) || activities[0];
}

function markTask(activityId, taskIndex, complete, rerender = true) {
  const key = `${activityId}:${taskIndex}`;
  if (complete) {
    state.completed[key] = true;
  } else {
    delete state.completed[key];
  }
  persistCompleted();
  if (rerender) {
    renderActivityNav();
    renderActivity();
  }
}

function isTaskComplete(activityId, taskIndex) {
  return Boolean(state.completed[`${activityId}:${taskIndex}`]);
}

function isTaskPending(activityId, taskIndex) {
  return state.pendingTask?.activityId === activityId && state.pendingTask?.taskIndex === taskIndex;
}

function loadCompleted() {
  try {
    return JSON.parse(localStorage.getItem("ace26-activity-complete") || "{}");
  } catch {
    return {};
  }
}

function persistCompleted() {
  localStorage.setItem("ace26-activity-complete", JSON.stringify(state.completed));
}

async function apiGet(path) {
  const response = await fetch(path);
  return parseApiResponse(response);
}

async function apiPost(path, body, options = {}) {
  const headers = { "Content-Type": "application/json" };
  const accessCode = options.accessCode ?? state.accessCode;
  if (accessCode) {
    headers["X-Workshop-Access-Code"] = accessCode;
  }

  const timeoutMs = options.timeoutMs || 120000;
  const maxAttempts = options.retryOnNetworkError === false ? 1 : 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(path, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });
      return parseApiResponse(response);
    } catch (error) {
      const message = String(error?.message || "").toLowerCase();
      const isNetworkFailure = message.includes("failed to fetch") || message.includes("networkerror") || message.includes("empty_response");
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Try a narrower prompt, fewer snippets, or a faster model.");
      }
      if (!isNetworkFailure || attempt >= maxAttempts) {
        throw error;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

async function parseApiResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || body.detail || "Request failed.");
    error.status = response.status;
    throw error;
  }
  return body;
}

function formatMessage(value) {
  return String(value || "")
    .split(/```([\s\S]*?)```/g)
    .map((part, index) => {
      if (index % 2) {
        return `<pre><code>${escapeHtml(part.trim())}</code></pre>`;
      }
      return renderTextBlocks(part);
    })
    .join("");
}

function renderTextBlocks(text) {
  const lines = text.replace(/\r/g, "").split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    if (!lines[index].trim()) {
      index += 1;
      continue;
    }

    if (isTableStart(lines, index)) {
      const tableLines = [];
      while (index < lines.length && lines[index].includes("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      blocks.push(renderTable(tableLines));
      continue;
    }

    const heading = parseHeading(lines[index]);
    if (heading) {
      blocks.push(`<${heading.tag}>${renderInline(heading.text)}</${heading.tag}>`);
      index += 1;
      continue;
    }

    if (isUnorderedListLine(lines[index])) {
      const items = [];
      while (index < lines.length && isUnorderedListLine(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*]\s+/, ""));
        index += 1;
      }
      blocks.push(renderList("ul", items));
      continue;
    }

    if (isOrderedListLine(lines[index])) {
      const items = [];
      while (index < lines.length && isOrderedListLine(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+[.)]\s+/, ""));
        index += 1;
      }
      blocks.push(renderList("ol", items));
      continue;
    }

    const paragraphLines = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !isTableStart(lines, index) &&
      !parseHeading(lines[index]) &&
      !isUnorderedListLine(lines[index]) &&
      !isOrderedListLine(lines[index])
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    if (paragraphLines.length) {
      blocks.push(`<p>${paragraphLines.map(renderInline).join(" ")}</p>`);
    }
  }

  return blocks.join("");
}

function parseHeading(line) {
  const match = line.match(/^(#{1,4})\s+(.+)$/);
  if (!match) {
    return null;
  }
  return {
    tag: match[1].length >= 3 ? "h4" : "h3",
    text: match[2].trim()
  };
}

function isUnorderedListLine(line) {
  return /^\s*[-*]\s+/.test(line);
}

function isOrderedListLine(line) {
  return /^\s*\d+[.)]\s+/.test(line);
}

function renderList(tag, items) {
  return `<${tag}>${items.map((item) => `<li>${renderInline(item.trim())}</li>`).join("")}</${tag}>`;
}

function isTableStart(lines, index) {
  return (
    index + 1 < lines.length &&
    lines[index].includes("|") &&
    /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(lines[index + 1])
  );
}

function renderTable(lines) {
  const rows = lines.filter((line, index) => index !== 1).map(parseTableRow).filter((row) => row.length);
  if (!rows.length) {
    return "";
  }

  const [head, ...body] = rows;
  return `
    <div class="table-wrap">
      <table>
        <thead><tr>${head.map((cell) => `<th>${renderInline(cell)}</th>`).join("")}</tr></thead>
        <tbody>${body.map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function parseTableRow(row) {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderInline(value) {
  return String(value)
    .split(/(`[^`]*`)/g)
    .map((part) => {
      if (/^`[^`]*`$/.test(part)) {
        return `<code>${escapeHtml(part.slice(1, -1))}</code>`;
      }
      return escapeHtml(part).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    })
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
