const instructionPresets = {
  default:
    "You are an AI assistant for the ACE26 water and environmental workshop. Help participants learn prompt iteration, model settings, and document-grounded answers. Use clear language, be explicit about uncertainty, and when retrieved source snippets are supplied cite them as [source 1], [source 2], etc.",
  public:
    "You are an AI assistant tasked with educating the public about drinking water treatment. Respond in a short paragraph using simple language at an 8th-grade reading level. Avoid technical jargon and use straightforward examples to clarify concepts.",
  guardrail:
    "Only answer questions related to water, wastewater, environmental engineering, public infrastructure, or the provided documents. If a question is outside this scope, briefly explain that the workshop assistant is focused on water and environmental topics."
};

const activities = [
  {
    id: "intro",
    kicker: "Start Here",
    title: "How This Lab Works",
    summary: "Before you run prompts, learn what changes from step to step and how to compare results.",
    infoOnly: true,
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
    settings: { modelHint: "mini", dataSourceId: "none", reasoningEffort: "medium", maxTokens: 900 },
    tasks: [
      {
        title: "1a. Configure the warmup",
        detail: "Use the warmup setup to select the fast model and place the one-sentence prompt in this step. Run it to confirm the app can reach the model.",
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
    settings: { modelHint: "mini", dataSourceId: "none", reasoningEffort: "medium", maxTokens: 800 },
    tasks: [
      {
        title: "2a. Set a response budget",
        detail: "Configure an 800-token response budget, then run the process question. Watch whether the response stays complete within the smaller budget.",
        actions: [
          {
            label: "Configure 800-token setup",
            modelHint: "mini",
            maxTokens: 800,
            reasoningEffort: "medium",
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
        title: "2c. Compare reasoning effort",
        detail: "Run the same filtration question with medium and high reasoning effort. Compare the outputs side by side before deciding whether the higher setting helped.",
        comparison: true,
        actions: [
          {
            label: "Medium reasoning",
            reasoningEffort: "medium",
            prompt: "What is the purpose of filtration at a wastewater treatment plant? How does this treatment process work?"
          },
          {
            label: "High reasoning",
            reasoningEffort: "high",
            prompt: "What is the purpose of filtration at a wastewater treatment plant? How does this treatment process work?"
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
    settings: { modelHint: "mini", dataSourceId: "none", reasoningEffort: "medium", maxTokens: 900 },
    tasks: [
      {
        title: "3a. Test a recent public fact",
        detail: "Run the Super Bowl prompt, then verify against a trusted sports source. The point is whether the model dates its answer, admits uncertainty, or guesses.",
        actions: [
          {
            label: "Use sports fact check",
            prompt: "As of April 2026, who won Super Bowl LX and what was the final score?"
          }
        ]
      },
      {
        title: "3b. Test a current water rule",
        detail: "Run the PFAS prompt, then verify with EPA or another official source. Look for confusion between the final rule and later implementation updates.",
        actions: [
          {
            label: "Use PFAS status check",
            prompt: "As of April 2026, what is the current status of EPA's national drinking water rule for PFAS?"
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
    settings: { modelHint: "mini", dataSourceHint: "documents", reasoningEffort: "medium", maxTokens: 1100, sourceTop: 4 },
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
    settings: { modelHint: "mini", dataSourceId: "none", reasoningEffort: "medium", maxTokens: 700 },
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
    settings: { modelHint: "mini", dataSourceId: "none", reasoningEffort: "medium", maxTokens: 700 },
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

const state = {
  messages: [],
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
  activityProgress: document.querySelector("#activity-progress"),
  activityProgressBar: document.querySelector("#activity-progress-bar"),
  activitySummary: document.querySelector("#activity-summary"),
  activityTasks: document.querySelector("#activity-tasks"),
  activityTitle: document.querySelector("#activity-title"),
  appShell: document.querySelector("#app-shell"),
  appTitle: document.querySelector("#app-title"),
  chatForm: document.querySelector("#chat-form"),
  dataSourceHelp: document.querySelector("#data-source-help"),
  dataSourceSelect: document.querySelector("#data-source-select"),
  instructions: document.querySelector("#instructions"),
  maxTokens: document.querySelector("#max-tokens"),
  messages: document.querySelector("#messages"),
  modelHelp: document.querySelector("#model-help"),
  modelSelect: document.querySelector("#model-select"),
  newChat: document.querySelector("#new-chat"),
  presetButtons: document.querySelectorAll(".preset-button"),
  promptInput: document.querySelector("#prompt-input"),
  reasoningEffort: document.querySelector("#reasoning-effort"),
  resetInstructions: document.querySelector("#reset-instructions"),
  resetLab: document.querySelector("#reset-lab"),
  saveAccessCode: document.querySelector("#save-access-code"),
  sendButton: document.querySelector("#send-button"),
  settingsSummary: document.querySelector("#settings-summary"),
  sourceCount: document.querySelector("#source-count"),
  sourceTop: document.querySelector("#source-top"),
  sources: document.querySelector("#sources"),
  usageSummary: document.querySelector("#usage-summary")
};

init();

async function init() {
  bindEvents();
  renderActivityNav();
  renderActivity();
  renderMessages();

  try {
    const config = await apiGet("/api/config");
    state.config = config;
    instructionPresets.default = config.defaultInstructions || instructionPresets.default;
    elements.appTitle.textContent = config.workshopName || "ACE26 GenAI Workshop";
    elements.instructions.value = instructionPresets.default;
    configureAccessGate(config.access);

    populateModels(config.models || []);
    populateDataSources(config.dataSources || []);
    updateSettingsSummary();
    applyActivityDefaults(currentActivity());
    renderActivityNav();
    renderActivity();
  } catch (error) {
    addMessage("assistant", `Configuration failed: ${error.message}`);
  } finally {
    document.body.classList.remove("configuring");
  }
}

function bindEvents() {
  if (elements.chatForm && elements.promptInput) {
    elements.chatForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const prompt = elements.promptInput.value.trim();
      if (!prompt || state.busy) {
        return;
      }
      elements.promptInput.value = "";
      await sendPrompt(prompt);
    });

    elements.promptInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || event.shiftKey || event.isComposing) {
        return;
      }
      event.preventDefault();
      elements.chatForm.requestSubmit();
    });
  }

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
      applyAction(action, { keepPrompt: true });
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
    state.messages = [];
    state.latestSources = [];
    state.pendingTask = null;
    state.cellOutputs = {};
    state.preparedActions = {};
    renderMessages();
    renderActivity();
    renderSources();
    elements.usageSummary.textContent = "Ready";
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

  elements.accessForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveAccessCode();
  });

  elements.presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyInstructionsPreset(button.dataset.preset);
    });
  });

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
  if (taskRef) {
    state.cellOutputs[taskKey(taskRef.activityId, taskRef.taskIndex)] = { pending: true, prompt };
    renderActivity();
  }
  const requestMessages = [{ role: "user", content: prompt }];
  if (elements.messages) {
    addMessage("user", prompt);
    addMessage("assistant", "Thinking...", true);
  }
  updateSettingsSummary();

  try {
    const response = await apiPost("/api/chat", {
      messages: requestMessages,
      systemPrompt: elements.instructions.value,
      modelDeployment: elements.modelSelect.value,
      reasoningEffort: elements.reasoningEffort.value,
      maxCompletionTokens: Number(elements.maxTokens.value),
      dataSourceId: elements.dataSourceSelect.value,
      top: Number(elements.sourceTop.value)
    });

    removePending();
    if (elements.messages) {
      addMessage("assistant", response.message.content || "No response content returned.");
    }
    applyEffectiveReasoning(response.reasoningEffort);
    if (taskRef) {
      state.cellOutputs[taskKey(taskRef.activityId, taskRef.taskIndex)] = {
        prompt,
        response: response.message.content || "No response content returned.",
        sources: response.sources || [],
        usage: response.usage || null
      };
    }
    state.latestSources = response.sources || [];
    renderSources();
    renderUsage(response);
    completePendingTask();
  } catch (error) {
    removePending();
    if (taskRef) {
      state.cellOutputs[taskKey(taskRef.activityId, taskRef.taskIndex)] = {
        prompt,
        error: error.message || "Request failed."
      };
      renderActivity();
    }
    if (elements.messages) {
      addMessage("assistant", `Request failed: ${error.message}`);
    }
    elements.usageSummary.textContent = "Failed";
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

function configureAccessGate(access) {
  const codeRequired = Boolean(access?.codeRequired);
  state.accessRequired = codeRequired;
  elements.accessCode.value = state.accessCode;

  if (!codeRequired || state.accessCode) {
    hideAccessGate();
    return;
  }

  elements.accessHelp.textContent = "Enter the workshop code to start the activity.";
  showAccessGate();
}

function saveAccessCode() {
  const code = elements.accessCode.value.trim();
  if (!code) {
    elements.accessHelp.textContent = "Enter the workshop code to continue.";
    elements.accessCode.focus();
    return;
  }

  state.accessCode = code;
  localStorage.setItem("ace26-access-code", state.accessCode);
  elements.accessHelp.textContent = "Access code saved for this browser.";
  hideAccessGate();
  focusFirstStepPrompt();
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
      const actions = renderTaskActions(task, taskIndex, preparedActionIndex, complete);

      return `
        <article class="task-item ${complete ? "complete" : ""} ${active ? "active" : ""}">
          <div class="task-heading">
            <span class="task-step">${taskIndex + 1}</span>
            <div class="task-copy">
              <div class="task-title-row">
                <h3>${escapeHtml(task.title)}</h3>
                <span class="task-state">${escapeHtml(stateLabel)}</span>
              </div>
              <p>${escapeHtml(task.detail)}</p>
            </div>
          </div>
          <div class="task-actions">${actions}</div>
          ${renderStepSetup(activity, task, preparedActionIndex)}
          <label class="cell-prompt-label" for="cell-prompt-${escapeHtml(key)}">Prompt</label>
          <textarea id="cell-prompt-${escapeHtml(key)}" class="cell-prompt" data-cell-prompt="${escapeHtml(key)}" rows="3">${escapeHtml(prompt)}</textarea>
          <div class="cell-footer">
            <span>${escapeHtml(currentRunCaption())}</span>
            <button class="run-step-button" type="button" data-run-task="${taskIndex}"${state.busy ? " disabled" : ""}>${output?.pending ? "Running" : task.comparison ? "Run comparison" : "Run this step"}</button>
          </div>
          ${renderCellOutput(output, task)}
        </article>
      `;
    })
    .join("");
}

function renderInfoTask(task, taskIndex) {
  return `
    <article class="task-item info-task">
      <div class="task-heading">
        <span class="task-step">${taskIndex + 1}</span>
        <div class="task-copy">
          <h3>${escapeHtml(task.title)}</h3>
          <p>${escapeHtml(task.detail)}</p>
        </div>
      </div>
      ${renderReflection(task.afterRun || task)}
    </article>
  `;
}

function renderStepSetup(activity, task, preparedActionIndex) {
  const action = task.actions[preparedActionIndex ?? 0] || {};
  const settings = { ...(activity.settings || {}), ...action };
  const items = [
    ["Model", modelLabelFromSettings(settings)],
    ["Reasoning", reasoningLabel(settings.reasoningEffort ?? elements.reasoningEffort.value)],
    ["Max tokens", settings.maxTokens || elements.maxTokens.value],
    ["Grounding", dataSourceLabelFromSettings(settings)]
  ];

  if (settings.sourceTop || settings.dataSourceHint || (settings.dataSourceId && settings.dataSourceId !== "none")) {
    items.push(["Snippets", settings.sourceTop || elements.sourceTop.value]);
  }

  if (settings.instructionsPreset) {
    items.push(["Instructions", instructionPresetLabels[settings.instructionsPreset] || settings.instructionsPreset]);
  }

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

function renderCellOutput(output, task = null) {
  if (!output) {
    return "";
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
  if (activity.infoOnly) {
    elements.activityProgress.textContent = "Start here";
    elements.activityProgressBar.style.width = "0%";
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
  if (state.cellPrompts[key] === undefined) {
    state.cellPrompts[key] = defaultTaskPrompt(task);
  }
  return state.cellPrompts[key];
}

function focusCellPrompt(activityId, taskIndex) {
  const key = taskKey(activityId, taskIndex);
  requestAnimationFrame(() => {
    elements.activityTasks.querySelector(`[data-cell-prompt="${CSS.escape(key)}"]`)?.focus();
  });
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

function trimSource(source) {
  const location = [source.sourceFile, source.page ? `page ${source.page}` : ""].filter(Boolean).join(", ");
  const prefix = location ? `${location}: ` : "";
  return `${prefix}${String(source.content || "").slice(0, 240)}`;
}

function renderMessages() {
  if (!elements.messages) {
    return;
  }

  if (!state.messages.length) {
    elements.messages.innerHTML = `
      <div class="empty-chat">
        <h3>No messages yet</h3>
      </div>
    `;
    return;
  }

  elements.messages.innerHTML = state.messages
    .map((message) => {
      const classes = ["message", message.role, message.pending ? "pending" : ""].join(" ");
      return `
        <article class="${classes}">
          <div class="message-label">${message.role === "user" ? "You" : "Assistant"}</div>
          <div class="message-content">${formatMessage(message.content)}</div>
        </article>
      `;
    })
    .join("");
  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function renderSources() {
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
  const usage = response.usage;
  if (!usage) {
    elements.usageSummary.textContent = "Complete";
    return;
  }

  const total = usage.total_tokens || usage.totalTokens || usage.completion_tokens || "";
  elements.usageSummary.textContent = total ? `${total} tokens` : "Complete";
}

function updateSettingsSummary() {
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
    elements.reasoningEffort.value = supported.has("medium") ? "medium" : "";
  }
}

function supportedReasoningEfforts(model) {
  return isProModel(model) ? ["medium", "high", ""] : ["minimal", "low", "medium", "high", ""];
}

function reasoningSupportNote(model) {
  if (isProModel(model)) {
    return "Reasoning options: Medium or High.";
  }
  return "Reasoning options: Minimal, Low, Medium, High.";
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
  if (action.prompt && !options.keepPrompt) {
    elements.promptInput.value = action.prompt;
    elements.promptInput.focus();
  }
  updateModelHelp();
  updateDataSourceHelp();
  updateSettingsSummary();
}

function applyInstructionsPreset(name) {
  if (instructionPresets[name]) {
    elements.instructions.value = instructionPresets[name];
  }
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

function addMessage(role, content, pending = false) {
  if (!elements.messages) {
    return;
  }

  state.messages.push({ role, content, pending });
  renderMessages();
}

function removePending() {
  state.messages = state.messages.filter((message) => !message.pending);
}

function setBusy(isBusy) {
  state.busy = isBusy;
  if (elements.sendButton) {
    elements.sendButton.disabled = isBusy;
    elements.sendButton.textContent = isBusy ? "Sending" : "Send";
  }
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

async function apiPost(path, body) {
  const headers = { "Content-Type": "application/json" };
  if (state.accessCode) {
    headers["X-Workshop-Access-Code"] = state.accessCode;
  }

  const response = await fetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  return parseApiResponse(response);
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
    if (isTableStart(lines, index)) {
      const tableLines = [];
      while (index < lines.length && lines[index].includes("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      blocks.push(renderTable(tableLines));
      continue;
    }

    const textLines = [];
    while (index < lines.length && !isTableStart(lines, index)) {
      textLines.push(lines[index]);
      index += 1;
    }
    const rendered = textLines.map(renderInline).join("<br>").trim();
    if (rendered) {
      blocks.push(`<p>${rendered}</p>`);
    }
  }

  return blocks.join("");
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
  return escapeHtml(value).replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
