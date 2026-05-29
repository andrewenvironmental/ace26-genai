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
    id: "prompting",
    kicker: "Part 1",
    title: "Use the Model Playground",
    summary: "Compare general prompts, audience instructions, and output-format constraints.",
    settings: { modelHint: "mini", dataSourceId: "none", reasoningEffort: "medium", maxTokens: 900 },
    tasks: [
      {
        title: "Quick warmup",
        detail: "Confirm the model responds to a simple water utility question.",
        actions: [
          {
            label: "Load warmup",
            modelHint: "nano",
            prompt: "In one sentence, what can generative AI help a water utility team do?"
          }
        ]
      },
      {
        title: "General technical answer",
        detail: "Start broad, then decide what is missing or unsupported.",
        actions: [
          {
            label: "Load prompt",
            modelHint: "mini",
            prompt: "Can you tell me about innovative drinking water treatment technologies?"
          }
        ]
      },
      {
        title: "Public education style",
        detail: "Apply audience instructions and ask the same core question again.",
        actions: [
          {
            label: "Apply setup",
            modelHint: "mini",
            instructionsPreset: "public",
            prompt: "How does drinking water treatment work?"
          }
        ]
      },
      {
        title: "Format control",
        detail: "Ask for a constrained structure and compare how easy it is to reuse.",
        actions: [
          {
            label: "Three bullets",
            prompt: "Explain drinking water treatment in three bullet points."
          },
          {
            label: "Social post",
            prompt: "Write a two-sentence social media post about why drinking water treatment matters."
          },
          {
            label: "First grade",
            prompt: "Explain drinking water treatment for a first-grade audience."
          }
        ]
      }
    ]
  },
  {
    id: "parameters",
    kicker: "Part 2",
    title: "Adjust Model Parameters",
    summary: "Change response budget and reasoning effort, then compare speed, detail, and usefulness.",
    settings: { modelHint: "mini", dataSourceId: "none", reasoningEffort: "medium", maxTokens: 800 },
    tasks: [
      {
        title: "Short response budget",
        detail: "Lower the max completion tokens before asking a process question.",
        actions: [
          {
            label: "Set up",
            modelHint: "mini",
            maxTokens: 800,
            reasoningEffort: "medium",
            prompt: "Explain coagulation and flocculation."
          }
        ]
      },
      {
        title: "Prompt-level brevity",
        detail: "Keep the same token budget but add a direct length constraint.",
        actions: [
          {
            label: "Load prompt",
            prompt: "Answer in two sentences or fewer: explain coagulation and flocculation."
          }
        ]
      },
      {
        title: "Reasoning comparison",
        detail: "Ask the same question at medium, then high reasoning effort.",
        actions: [
          {
            label: "Medium setup",
            reasoningEffort: "medium",
            prompt: "What is the purpose of filtration at a wastewater treatment plant? How does this treatment process work?"
          },
          {
            label: "High setup",
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
        title: "Recent public fact",
        detail: "Check whether the model gives dates, uncertainty, or an unsupported confident answer.",
        actions: [
          {
            label: "Sports fact",
            prompt: "As of April 2026, who won Super Bowl LX and what was the final score?"
          },
          {
            label: "PFAS status",
            prompt: "As of April 2026, what is the current status of EPA's national drinking water rule for PFAS?"
          }
        ]
      },
      {
        title: "Local organization specificity",
        detail: "Look for plausible claims that would need primary-source confirmation.",
        actions: [
          {
            label: "Dallas",
            prompt: "Tell me about water conservation efforts in Dallas."
          },
          {
            label: "Fort Worth",
            prompt: "What are the top three water treatment challenges Fort Worth Water has identified for 2026?"
          },
          {
            label: "TRWA",
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
    settings: { modelHint: "pro", dataSourceHint: "documents", reasoningEffort: "medium", maxTokens: 1100, sourceTop: 4 },
    tasks: [
      {
        title: "Focused document question",
        detail: "Use a narrow question so retrieval and citation quality are easy to inspect.",
        actions: [
          {
            label: "Apply document setup",
            modelHint: "pro",
            dataSourceHint: "documents",
            sourceTop: 4,
            prompt: "Use the documents. Answer in one short sentence: what is WTP Minor Improvements? Cite the file."
          }
        ]
      },
      {
        title: "Structured output",
        detail: "Ask the grounded assistant for a reusable table with strict columns and rows.",
        actions: [
          {
            label: "Load table prompt",
            modelHint: "mini",
            dataSourceHint: "documents",
            prompt:
              "Use the documents. Return only a markdown table with exactly 2 rows and 3 columns: category, description, cost. Rows: WTP Minor Improvements; Major Mains Bucket. Keep descriptions under 10 words."
          }
        ]
      },
      {
        title: "Broader grounded answer",
        detail: "Try a broader request and watch how retrieval affects completeness and speed.",
        actions: [
          {
            label: "Load prompt",
            modelHint: "pro",
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
        title: "Scope restriction",
        detail: "Apply the water/environmental scope guardrail before testing an off-topic prompt.",
        actions: [
          {
            label: "Apply guardrail",
            instructionsPreset: "guardrail",
            modelHint: "mini",
            prompt: "Write a movie review of a superhero film."
          }
        ]
      },
      {
        title: "In-scope recovery",
        detail: "Return to an in-scope question and confirm the assistant remains helpful.",
        actions: [
          {
            label: "Load prompt",
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
        title: "Share-out response",
        detail: "Summarize the observable differences from your own runs.",
        actions: [
          {
            label: "Load prompt",
            prompt:
              "In two sentences, what changed after adding instructions, changing parameters, or retrieving workshop documents?"
          }
        ]
      },
      {
        title: "Operational takeaway",
        detail: "Turn the lab into a rule of thumb for public-facing AI work.",
        actions: [
          {
            label: "Load prompt",
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
  completed: loadCompleted(),
  accessCode: localStorage.getItem("ace26-access-code") || ""
};

const elements = {
  accessCode: document.querySelector("#access-code"),
  accessHelp: document.querySelector("#access-help"),
  accessPanel: document.querySelector("#access-panel"),
  activityKicker: document.querySelector("#activity-kicker"),
  activityNav: document.querySelector("#activity-nav"),
  activityProgress: document.querySelector("#activity-progress"),
  activitySummary: document.querySelector("#activity-summary"),
  activityTasks: document.querySelector("#activity-tasks"),
  activityTitle: document.querySelector("#activity-title"),
  appTitle: document.querySelector("#app-title"),
  chatForm: document.querySelector("#chat-form"),
  chatStatus: document.querySelector("#chat-status"),
  connectionPill: document.querySelector("#connection-pill"),
  dataSourceHelp: document.querySelector("#data-source-help"),
  dataSourceSelect: document.querySelector("#data-source-select"),
  foundryLink: document.querySelector("#foundry-link"),
  instructions: document.querySelector("#instructions"),
  markPartComplete: document.querySelector("#mark-part-complete"),
  maxTokens: document.querySelector("#max-tokens"),
  messages: document.querySelector("#messages"),
  modelHelp: document.querySelector("#model-help"),
  modelSelect: document.querySelector("#model-select"),
  newChat: document.querySelector("#new-chat"),
  observationNotes: document.querySelector("#observation-notes"),
  presetButtons: document.querySelectorAll(".preset-button"),
  promptInput: document.querySelector("#prompt-input"),
  promptStrip: document.querySelector("#prompt-strip"),
  reasoningEffort: document.querySelector("#reasoning-effort"),
  resetInstructions: document.querySelector("#reset-instructions"),
  resetLab: document.querySelector("#reset-lab"),
  saveAccessCode: document.querySelector("#save-access-code"),
  searchIndex: document.querySelector("#search-index"),
  sendButton: document.querySelector("#send-button"),
  settingsSummary: document.querySelector("#settings-summary"),
  sourceCount: document.querySelector("#source-count"),
  sourceTop: document.querySelector("#source-top"),
  sources: document.querySelector("#sources"),
  usageSummary: document.querySelector("#usage-summary"),
  workspaceName: document.querySelector("#workspace-name")
};

init();

async function init() {
  bindEvents();
  renderActivityNav();
  renderActivity();
  renderMessages();
  restoreNotes();

  try {
    const config = await apiGet("/api/config");
    state.config = config;
    instructionPresets.default = config.defaultInstructions || instructionPresets.default;
    elements.appTitle.textContent = config.workshopName || "ACE26 GenAI Workshop";
    elements.workspaceName.textContent = config.workshopName || "ACE26 GenAI Workshop";
    elements.searchIndex.textContent = config.searchIndex || "Not configured";
    elements.instructions.value = instructionPresets.default;
    elements.foundryLink.href = config.foundryPortalUrl || "https://ai.azure.com";
    configureAccessPanel(config.access);

    populateModels(config.models || []);
    populateDataSources(config.dataSources || []);
    renderPromptStrip(config.samplePrompts || []);
    updateConnectionState();
    updateSettingsSummary();
    applyActivityDefaults(currentActivity());
  } catch (error) {
    elements.chatStatus.textContent = "Config error";
    elements.connectionPill.textContent = "Config error";
    addMessage("assistant", `Configuration failed: ${error.message}`);
  }
}

function bindEvents() {
  elements.chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const prompt = elements.promptInput.value.trim();
    if (!prompt || state.busy) {
      return;
    }
    elements.promptInput.value = "";
    await sendPrompt(prompt);
  });

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

  elements.activityTasks.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action-index]");
    const checkbox = event.target.closest("[data-task-check]");

    if (actionButton) {
      const activity = currentActivity();
      const task = activity.tasks[Number(actionButton.dataset.taskIndex)];
      const action = task.actions[Number(actionButton.dataset.actionIndex)];
      applyAction(action);
      markTask(activity.id, Number(actionButton.dataset.taskIndex), true);
      return;
    }

    if (checkbox) {
      markTask(state.activeActivityId, Number(checkbox.dataset.taskCheck), checkbox.checked);
    }
  });

  elements.markPartComplete.addEventListener("click", () => {
    const activity = currentActivity();
    const allComplete = activity.tasks.every((_, index) => isTaskComplete(activity.id, index));
    activity.tasks.forEach((_, index) => markTask(activity.id, index, !allComplete, false));
    persistCompleted();
    renderActivityNav();
    renderActivity();
  });

  elements.newChat.addEventListener("click", () => {
    state.messages = [];
    state.latestSources = [];
    renderMessages();
    renderSources();
    elements.usageSummary.textContent = "Ready";
    elements.promptInput.focus();
  });

  elements.resetLab.addEventListener("click", () => {
    state.completed = {};
    persistCompleted();
    state.activeActivityId = activities[0].id;
    elements.observationNotes.value = "";
    localStorage.removeItem("ace26-observations");
    renderActivityNav();
    renderActivity();
    applyActivityDefaults(currentActivity());
  });

  elements.resetInstructions.addEventListener("click", () => {
    elements.instructions.value = instructionPresets.default;
  });

  elements.saveAccessCode.addEventListener("click", () => {
    state.accessCode = elements.accessCode.value.trim();
    if (state.accessCode) {
      localStorage.setItem("ace26-access-code", state.accessCode);
      elements.accessHelp.textContent = "Access code saved for this browser.";
    } else {
      localStorage.removeItem("ace26-access-code");
      elements.accessHelp.textContent = "Required before chat or source search requests.";
    }
  });

  elements.presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyInstructionsPreset(button.dataset.preset);
    });
  });

  [elements.modelSelect, elements.dataSourceSelect, elements.reasoningEffort, elements.maxTokens, elements.sourceTop].forEach(
    (control) => {
      control.addEventListener("change", updateSettingsSummary);
      control.addEventListener("input", updateSettingsSummary);
    }
  );

  elements.modelSelect.addEventListener("change", updateModelHelp);
  elements.dataSourceSelect.addEventListener("change", updateDataSourceHelp);
  elements.observationNotes.addEventListener("input", () => {
    localStorage.setItem("ace26-observations", elements.observationNotes.value);
  });
}

async function sendPrompt(prompt) {
  setBusy(true);
  addMessage("user", prompt);
  addMessage("assistant", "Thinking...", true);
  updateSettingsSummary();

  try {
    const response = await apiPost("/api/chat", {
      messages: state.messages.filter((message) => !message.pending),
      systemPrompt: elements.instructions.value,
      modelDeployment: elements.modelSelect.value,
      reasoningEffort: elements.reasoningEffort.value,
      maxCompletionTokens: Number(elements.maxTokens.value),
      dataSourceId: elements.dataSourceSelect.value,
      top: Number(elements.sourceTop.value)
    });

    removePending();
    addMessage("assistant", response.message.content || "No response content returned.");
    state.latestSources = response.sources || [];
    renderSources();
    renderUsage(response);
  } catch (error) {
    removePending();
    addMessage("assistant", `Request failed: ${error.message}`);
    elements.usageSummary.textContent = "Failed";
  } finally {
    setBusy(false);
  }
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

function configureAccessPanel(access) {
  const codeRequired = Boolean(access?.codeRequired);
  elements.accessPanel.hidden = !codeRequired;
  elements.accessCode.value = state.accessCode;
  elements.accessHelp.textContent = codeRequired
    ? state.accessCode
      ? "Access code saved for this browser."
      : "Required before chat or source search requests."
    : "";
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
      const isComplete = activity.tasks.every((_, index) => isTaskComplete(activity.id, index));
      return `
        <button class="activity-tab ${isActive ? "active" : ""} ${isComplete ? "complete" : ""}" type="button" data-activity-id="${activity.id}">
          <span>${escapeHtml(activity.kicker)}</span>
          <strong>${escapeHtml(activity.title)}</strong>
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
      const checked = isTaskComplete(activity.id, taskIndex) ? " checked" : "";
      const actions = task.actions
        .map(
          (action, actionIndex) => `
            <button class="task-action" type="button" data-task-index="${taskIndex}" data-action-index="${actionIndex}">
              ${escapeHtml(action.label)}
            </button>
          `
        )
        .join("");

      return `
        <article class="task-item">
          <label class="task-check">
            <input type="checkbox" data-task-check="${taskIndex}"${checked}>
            <span></span>
          </label>
          <div class="task-copy">
            <h3>${escapeHtml(task.title)}</h3>
            <p>${escapeHtml(task.detail)}</p>
            <div class="task-actions">${actions}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTaskProgress(activity) {
  const done = activity.tasks.filter((_, index) => isTaskComplete(activity.id, index)).length;
  elements.activityProgress.textContent = `${done} of ${activity.tasks.length}`;
  elements.markPartComplete.textContent = done === activity.tasks.length ? "Reopen part" : "Mark complete";
}

function renderPromptStrip(prompts) {
  elements.promptStrip.innerHTML = prompts
    .map((prompt) => `<button type="button" class="prompt-chip">${escapeHtml(prompt)}</button>`)
    .join("");

  elements.promptStrip.querySelectorAll(".prompt-chip").forEach((button) => {
    button.addEventListener("click", () => {
      elements.promptInput.value = button.textContent;
      elements.promptInput.focus();
    });
  });
}

function renderMessages() {
  if (!state.messages.length) {
    elements.messages.innerHTML = `
      <div class="empty-chat">
        <h3>Start with an activity prompt</h3>
        <p>Select a part above, load a prompt, and send it to compare the result.</p>
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
    <div><span>Reasoning</span><strong>${escapeHtml(elements.reasoningEffort.value || "Default")}</strong></div>
    <div><span>Max tokens</span><strong>${escapeHtml(elements.maxTokens.value)}</strong></div>
    <div><span>Data source</span><strong>${escapeHtml(source?.name || "No grounding")}</strong></div>
  `;
}

function updateConnectionState() {
  const ready = Boolean(state.config?.configured?.chat);
  const searchReady = Boolean(state.config?.configured?.search);
  elements.chatStatus.textContent = ready ? "Ready" : "Needs config";
  elements.chatStatus.classList.toggle("ready", ready);
  elements.connectionPill.textContent = searchReady ? "Chat + documents" : ready ? "Chat only" : "Needs config";
  elements.connectionPill.classList.toggle("ready", ready);
}

function updateModelHelp() {
  const model = selectedModel();
  elements.modelHelp.textContent = model
    ? `${model.recommendedFor}: ${model.description}`
    : "Select a configured model deployment.";
  updateSettingsSummary();
}

function updateDataSourceHelp() {
  const source = selectedDataSource();
  elements.dataSourceHelp.textContent = source?.description || "General model response without retrieved workshop snippets.";
  updateSettingsSummary();
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
  const normalized = String(hint || "").toLowerCase();
  const models = state.config?.models || [];
  const model = models.find((candidate) => candidate.id.toLowerCase().includes(normalized));
  if (model) {
    elements.modelSelect.value = model.id;
  }
}

function selectDataSourceByHint(hint) {
  const normalized = String(hint || "").toLowerCase();
  const sources = state.config?.dataSources || [];
  const source = sources.find(
    (candidate) => candidate.enabled && candidate.id.toLowerCase().includes(normalized)
  );
  elements.dataSourceSelect.value = source?.id || "none";
}

function setSelectValue(select, value) {
  const option = [...select.options].find((candidate) => candidate.value === value && !candidate.disabled);
  if (option) {
    select.value = value;
  }
}

function addMessage(role, content, pending = false) {
  state.messages.push({ role, content, pending });
  renderMessages();
}

function removePending() {
  state.messages = state.messages.filter((message) => !message.pending);
}

function setBusy(isBusy) {
  state.busy = isBusy;
  elements.sendButton.disabled = isBusy;
  elements.sendButton.textContent = isBusy ? "Sending" : "Send";
}

function selectedModel() {
  return (state.config?.models || []).find((model) => model.id === elements.modelSelect.value);
}

function selectedDataSource() {
  return (state.config?.dataSources || []).find((source) => source.id === elements.dataSourceSelect.value);
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

function restoreNotes() {
  elements.observationNotes.value = localStorage.getItem("ace26-observations") || "";
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
    throw new Error(body.error || body.detail || "Request failed.");
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
