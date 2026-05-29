const state = {
  messages: [],
  latestSources: [],
  busy: false,
  config: null
};

const elements = {
  activityCards: document.querySelectorAll(".activity-card"),
  chatForm: document.querySelector("#chat-form"),
  chatStatus: document.querySelector("#chat-status"),
  deploymentName: document.querySelector("#deployment-name"),
  foundryLink: document.querySelector("#foundry-link"),
  instructions: document.querySelector("#instructions"),
  maxTokens: document.querySelector("#max-tokens"),
  messages: document.querySelector("#messages"),
  newChat: document.querySelector("#new-chat"),
  promptInput: document.querySelector("#prompt-input"),
  promptStrip: document.querySelector("#prompt-strip"),
  reasoningEffort: document.querySelector("#reasoning-effort"),
  searchIndex: document.querySelector("#search-index"),
  sendButton: document.querySelector("#send-button"),
  sourceCount: document.querySelector("#source-count"),
  sources: document.querySelector("#sources"),
  useGrounding: document.querySelector("#use-grounding"),
  workspaceName: document.querySelector("#workspace-name")
};

init();

async function init() {
  bindEvents();
  renderMessages();

  try {
    const config = await apiGet("/api/config");
    state.config = config;
    elements.workspaceName.textContent = config.workshopName;
    elements.deploymentName.textContent = config.chatDeployment || "Not configured";
    elements.searchIndex.textContent = config.searchIndex || "Not configured";
    elements.instructions.value = config.defaultInstructions;
    elements.foundryLink.href = config.foundryPortalUrl;
    elements.chatStatus.classList.toggle("ready", Boolean(config.configured.chat));
    renderPromptStrip(config.samplePrompts || []);
  } catch (error) {
    elements.deploymentName.textContent = "Config error";
    elements.searchIndex.textContent = "Config error";
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

  elements.newChat.addEventListener("click", () => {
    state.messages = [];
    state.latestSources = [];
    renderMessages();
    renderSources();
    elements.promptInput.focus();
  });

  elements.activityCards.forEach((card) => {
    card.addEventListener("click", () => {
      elements.promptInput.value = card.dataset.prompt || "";
      elements.promptInput.focus();
    });
  });
}

async function sendPrompt(prompt) {
  setBusy(true);
  addMessage("user", prompt);
  addMessage("assistant", "Thinking...", true);

  try {
    const response = await apiPost("/api/chat", {
      messages: state.messages.filter((message) => !message.pending),
      systemPrompt: elements.instructions.value,
      reasoningEffort: elements.reasoningEffort.value,
      maxCompletionTokens: Number(elements.maxTokens.value),
      useGrounding: elements.useGrounding.checked,
      top: 4
    });

    removePending();
    addMessage("assistant", response.message.content || "No response content returned.");
    state.latestSources = response.sources || [];
    renderSources();
  } catch (error) {
    removePending();
    addMessage("assistant", `Request failed: ${error.message}`);
  } finally {
    setBusy(false);
  }
}

function addMessage(role, content, pending = false) {
  state.messages.push({ role, content, pending });
  renderMessages();
}

function removePending() {
  state.messages = state.messages.filter((message) => !message.pending);
}

function renderMessages() {
  if (!state.messages.length) {
    elements.messages.innerHTML = `
      <div class="empty-chat">
        <h3>Start with a workshop prompt</h3>
        <p>Responses appear here with document snippets in the Sources panel.</p>
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
        .join(" · ");
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

function setBusy(isBusy) {
  state.busy = isBusy;
  elements.sendButton.disabled = isBusy;
  elements.sendButton.textContent = isBusy ? "Sending" : "Send";
}

async function apiGet(path) {
  const response = await fetch(path);
  return parseApiResponse(response);
}

async function apiPost(path, body) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
  return escapeHtml(value)
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
