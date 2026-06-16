import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { promisify } from "node:util";

loadLocalEnv();

const execFileAsync = promisify(execFile);
const publicRoot = join(process.cwd(), "public");
const tokenCache = new Map();
const rateLimitBuckets = new Map();

const settings = {
  port: Number(process.env.PORT || 5050),
  nodeEnv: process.env.NODE_ENV || "development",
  workshopName: process.env.WORKSHOP_NAME || "ACE26 AI Pre-conference Workshop",
  aiEndpoint: trimTrailingSlash(process.env.AZURE_AI_SERVICES_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT || ""),
  chatDeployment: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || process.env.CHAT_DEPLOYMENT_NAME || "",
  chatDeployments: parseList(process.env.AZURE_OPENAI_CHAT_DEPLOYMENTS || process.env.CHAT_DEPLOYMENT_NAMES || ""),
  openAiApiVersion: process.env.AZURE_OPENAI_API_VERSION || "v1",
  openAiTokenScope:
    process.env.AZURE_OPENAI_TOKEN_SCOPE ||
    (process.env.AZURE_OPENAI_API_VERSION && process.env.AZURE_OPENAI_API_VERSION !== "v1"
      ? "https://cognitiveservices.azure.com/.default"
      : "https://ai.azure.com/.default"),
  openAiApiKey: process.env.AZURE_OPENAI_API_KEY || "",
  searchEndpoint: trimTrailingSlash(process.env.AZURE_SEARCH_ENDPOINT || ""),
  searchIndex: process.env.AZURE_SEARCH_INDEX || "documents",
  searchIndexes: parseList(process.env.AZURE_SEARCH_INDEXES || ""),
  searchApiVersion: process.env.AZURE_SEARCH_API_VERSION || "2024-07-01",
  searchApiKey: process.env.AZURE_SEARCH_API_KEY || "",
  foundryPortalUrl: process.env.AI_FOUNDRY_PORTAL_URL || "https://ai.azure.com",
  storageContainer: process.env.AZURE_STORAGE_CONTAINER || "workshop-docs",
  apiAccessMode: normalizeApiAccessMode(process.env.PUBLIC_API_ACCESS_MODE),
  workshopAccessCodes: parseList(process.env.WORKSHOP_ACCESS_CODES || process.env.WORKSHOP_ACCESS_CODE || ""),
  apiRateLimitPerMinute: Number(process.env.PUBLIC_API_RATE_LIMIT_PER_MINUTE || process.env.PUBLIC_CHAT_RATE_LIMIT_PER_MINUTE || 120),
  allowProductionApiKeys: process.env.ALLOW_PRODUCTION_API_KEYS === "true"
};

settings.modelOptions = buildModelOptions(settings.chatDeployments, settings.chatDeployment);
settings.defaultChatDeployment = settings.chatDeployment || settings.modelOptions[0]?.id || "";
settings.dataSources = buildDataSources(settings.searchIndexes, settings.searchIndex);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

const samplePrompts = [
  "In one sentence, what can generative AI help a water utility team do?",
  "How does drinking water treatment work?",
  "Explain drinking water treatment in three bullet points.",
  "Use the documents. Answer in one short sentence: what is WTP Minor Improvements? Cite the file.",
  "Only answer questions related to water, wastewater, environmental engineering, public infrastructure, or the provided documents."
];

const defaultInstructions =
  "You are an AI assistant for the ACE26 water and environmental workshop. Help participants learn prompt iteration, model settings, and document-grounded answers. Use clear language, be explicit about uncertainty, and when retrieved source snippets are supplied cite them as [source 1], [source 2], etc.";

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

    if (req.method === "GET" && url.pathname === "/api/health") {
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "GET" && url.pathname === "/api/config") {
      return sendJson(res, 200, getClientConfig());
    }

    if (req.method === "POST" && url.pathname === "/api/access/validate") {
      enforceApiAccess(req);
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "POST" && url.pathname === "/api/search") {
      enforceApiAccess(req);
      enforceApiRateLimit(req, "search");
      const body = await readJson(req);
      const result = await searchDocuments(body.query, body.top, body.dataSourceId || settings.dataSources[0]?.id);
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/chat") {
      enforceApiAccess(req);
      enforceApiRateLimit(req, "chat");
      const body = await readJson(req);
      const result = await chat(body);
      return sendJson(res, 200, result);
    }

    if (req.method === "GET") {
      return serveStatic(url.pathname, res);
    }

    sendJson(res, 405, { error: "Method not allowed." });
  } catch (error) {
    const status = error.statusCode || error.status || 500;
    sendJson(res, status, {
      error: error.publicMessage || "The playground request failed.",
      detail: process.env.NODE_ENV === "production" ? undefined : error.message
    });
  }
}).listen(settings.port, () => {
  console.log(`ACE26 workshop playground listening on ${settings.port}`);
});

async function chat(body) {
  requireConfigured(settings.aiEndpoint, "AZURE_AI_SERVICES_ENDPOINT");
  const deployment = resolveDeployment(body.modelDeployment || body.deployment || body.model);
  requireConfigured(deployment, "AZURE_OPENAI_CHAT_DEPLOYMENT");

  const messages = normalizeMessages(body.messages);
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content || "";
  const dataSource = resolveDataSource(body.dataSourceId || (body.useGrounding ? settings.dataSources[0]?.id : "none"));
  const sources = dataSource ? (await searchDocuments(lastUserMessage, body.top, dataSource.id)).documents : [];
  const systemPrompt = buildSystemPrompt(body.systemPrompt, sources);
  const maxCompletionTokens = clampInteger(body.maxCompletionTokens, 100, 4096, 900);
  const reasoningEffort = normalizeChatReasoningEffort(deployment, body.reasoningEffort);
  const payload = {
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_completion_tokens: maxCompletionTokens,
    stream: false
  };

  if (settings.openAiApiVersion === "v1") {
    payload.model = deployment;
  }

  if (reasoningEffort) {
    payload.reasoning_effort = reasoningEffort;
  }

  const response = await fetch(openAiUrl(deployment), {
    method: "POST",
    headers: await openAiHeaders(),
    body: JSON.stringify(payload)
  });

  const responseBody = await parseResponse(response);
  if (!response.ok && shouldTryResponsesFallback(response, responseBody)) {
    return chatWithResponsesApi({
      deployment,
      messages,
      systemPrompt,
      reasoningEffort,
      maxCompletionTokens,
      sources,
      dataSource
    });
  }

  if (!response.ok) {
    throw serviceError(response, responseBody, "Azure AI chat completion failed.");
  }

  const assistantText = extractChatCompletionText(responseBody);
  return {
    message: {
      role: "assistant",
      content: assistantText
    },
    sources,
    usage: responseBody.usage || null,
    model: responseBody.model || deployment,
    deployment,
    reasoningEffort: reasoningEffort || null,
    dataSource: dataSource || null
  };
}

async function chatWithResponsesApi({ deployment, messages, systemPrompt, reasoningEffort, maxCompletionTokens, sources, dataSource }) {
  const responseReasoningEffort = normalizeResponsesReasoningEffort(deployment, reasoningEffort);
  const payload = {
    model: deployment,
    instructions: systemPrompt,
    input: messages.map(toResponsesInputMessage),
    max_output_tokens: maxCompletionTokens,
    store: false,
    stream: false
  };

  if (responseReasoningEffort) {
    payload.reasoning = { effort: responseReasoningEffort };
  }

  const response = await fetch(openAiResponsesUrl(), {
    method: "POST",
    headers: await openAiHeaders(),
    body: JSON.stringify(payload)
  });

  const responseBody = await parseResponse(response);
  if (!response.ok) {
    throw serviceError(response, responseBody, "Azure AI responses request failed.");
  }

  return {
    message: {
      role: "assistant",
      content: extractResponsesText(responseBody) || ""
    },
    sources,
    usage: normalizeResponsesUsage(responseBody.usage),
    model: responseBody.model || deployment,
    deployment,
    reasoningEffort: responseReasoningEffort || null,
    dataSource: dataSource || null
  };
}

async function searchDocuments(query, requestedTop, dataSourceId) {
  const dataSource = resolveDataSource(dataSourceId);
  if (!dataSource || !settings.searchEndpoint || !dataSource.indexName) {
    return {
      enabled: false,
      documents: [],
      warning: "Azure AI Search is not configured for this playground."
    };
  }

  const top = clampInteger(requestedTop, 1, 8, 4);
  const searchUrl = `${settings.searchEndpoint}/indexes/${encodeURIComponent(
    dataSource.indexName
  )}/docs/search?api-version=${encodeURIComponent(settings.searchApiVersion)}`;
  const response = await fetch(searchUrl, {
    method: "POST",
    headers: await searchHeaders(),
    body: JSON.stringify({
      search: String(query || "*").slice(0, 1000),
      queryType: "simple",
      searchMode: "any",
      top,
      select: "title,sourceFile,page,chunk,content"
    })
  });

  const responseBody = await parseResponse(response);
  if (!response.ok) {
    throw serviceError(response, responseBody, "Azure AI Search query failed.");
  }

  return {
    enabled: true,
    documents: (responseBody.value || []).map((document, index) => ({
      id: document.id || `source-${index + 1}`,
      title: document.title || document.sourceFile || "Workshop document",
      sourceFile: document.sourceFile || "",
      page: document.page || null,
      chunk: document.chunk || null,
      score: document["@search.score"] || null,
      content: trimText(document.content || "", 1400)
    }))
  };
}

function buildSystemPrompt(userPrompt, sources) {
  const instructions = String(userPrompt || defaultInstructions).slice(0, 5000);
  if (!sources.length) {
    return instructions;
  }

  const sourceText = sources
    .map((source, index) => {
      const page = source.page ? ` page ${source.page}` : "";
      return `[source ${index + 1}] ${source.title}${page}\n${source.content}`;
    })
    .join("\n\n");

  return `${instructions}\n\nUse these retrieved workshop snippets when they are relevant. If the snippets do not support the answer, say what is missing instead of guessing.\n\n${sourceText}`;
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) {
    const error = new Error("Messages must be an array.");
    error.statusCode = 400;
    throw error;
  }

  return messages
    .filter((message) => ["user", "assistant"].includes(message?.role) && typeof message.content === "string")
    .slice(-20)
    .map((message) => ({
      role: message.role,
      content: message.content.slice(0, 8000)
    }));
}

function getClientConfig() {
  return {
    workshopName: settings.workshopName,
    chatDeployment: settings.defaultChatDeployment,
    defaultModelId: settings.defaultChatDeployment,
    models: settings.modelOptions,
    searchIndex: settings.searchIndex,
    defaultDataSourceId: settings.dataSources[0]?.id || "none",
    dataSources: [
      {
        id: "none",
        name: "No grounding",
        type: "none",
        enabled: true,
        description: "General model response without retrieved workshop snippets."
      },
      ...settings.dataSources
    ],
    storageContainer: settings.storageContainer,
    foundryPortalUrl: settings.foundryPortalUrl,
    defaultInstructions,
    samplePrompts,
    access: {
      mode: settings.apiAccessMode,
      codeRequired: settings.apiAccessMode === "code"
    },
    configured: {
      chat: Boolean(settings.aiEndpoint && settings.defaultChatDeployment),
      search: Boolean(settings.searchEndpoint && settings.searchIndex)
    }
  };
}

async function serveStatic(pathname, res) {
  const safePath = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  const normalized = normalize(safePath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicRoot, normalized);

  if (!filePath.startsWith(publicRoot)) {
    return sendJson(res, 403, { error: "Forbidden." });
  }

  try {
    const content = await readFile(filePath);
    const extension = extname(filePath);
    const noStoreExtensions = new Set([".html", ".js", ".css"]);
    res.writeHead(200, {
      ...securityHeaders(),
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": noStoreExtensions.has(extension) ? "no-store" : "public, max-age=300"
    });
    res.end(content);
  } catch {
    sendJson(res, 404, { error: "Not found." });
  }
}

async function openAiHeaders() {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (settings.openAiApiKey) {
    ensureApiKeyAllowed("AZURE_OPENAI_API_KEY");
    headers["api-key"] = settings.openAiApiKey;
  } else {
    headers.Authorization = `Bearer ${await getAccessToken(settings.openAiTokenScope)}`;
  }
  return headers;
}

async function searchHeaders() {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (settings.searchApiKey) {
    ensureApiKeyAllowed("AZURE_SEARCH_API_KEY");
    headers["api-key"] = settings.searchApiKey;
  } else {
    headers.Authorization = `Bearer ${await getAccessToken("https://search.azure.com/.default")}`;
  }
  return headers;
}

async function getAccessToken(scope) {
  const resource = scope.replace(/\/\.default$/, "");
  const cached = tokenCache.get(resource);
  if (cached && cached.expiresAt > Date.now() + 120000) {
    return cached.token;
  }

  const token = process.env.IDENTITY_ENDPOINT && process.env.IDENTITY_HEADER
    ? await getManagedIdentityToken(resource)
    : await getAzureCliToken(resource);
  tokenCache.set(resource, token);
  return token.token;
}

async function getManagedIdentityToken(resource) {
  const endpoint = new URL(process.env.IDENTITY_ENDPOINT);
  endpoint.searchParams.set("resource", resource);
  endpoint.searchParams.set("api-version", "2019-08-01");
  const response = await fetch(endpoint, {
    headers: {
      "X-IDENTITY-HEADER": process.env.IDENTITY_HEADER
    }
  });
  const body = await parseResponse(response);
  if (!response.ok) {
    throw serviceError(response, body, "Managed identity token request failed.");
  }
  return {
    token: body.access_token,
    expiresAt: Number(body.expires_on || 0) * 1000 || Date.now() + 300000
  };
}

async function getAzureCliToken(resource) {
  try {
    const azArgs = [
      "account",
      "get-access-token",
      "--resource",
      resource,
      "--output",
      "json"
    ];
    const executable = process.platform === "win32" ? "cmd.exe" : "az";
    const args = process.platform === "win32" ? ["/d", "/s", "/c", "az", ...azArgs] : azArgs;
    const { stdout } = await execFileAsync(executable, args);
    const body = JSON.parse(stdout);
    return {
      token: body.accessToken,
      expiresAt: body.expires_on ? Number(body.expires_on) * 1000 : Date.parse(body.expiresOn || "") || Date.now() + 300000
    };
  } catch (error) {
    const wrapped = new Error("Sign in with Azure CLI locally, or run in Azure App Service with managed identity enabled.");
    wrapped.statusCode = 503;
    wrapped.cause = error;
    throw wrapped;
  }
}

function openAiUrl(deployment) {
  if (settings.openAiApiVersion === "v1") {
    return `${settings.aiEndpoint}/openai/v1/chat/completions`;
  }

  return `${settings.aiEndpoint}/openai/deployments/${encodeURIComponent(
    deployment
  )}/chat/completions?api-version=${encodeURIComponent(settings.openAiApiVersion)}`;
}

function openAiResponsesUrl() {
  if (settings.openAiApiVersion === "v1") {
    return `${settings.aiEndpoint}/openai/v1/responses`;
  }

  return `${settings.aiEndpoint}/openai/responses?api-version=${encodeURIComponent(settings.openAiApiVersion)}`;
}

function shouldTryResponsesFallback(response, body) {
  const message = String(body?.error?.message || body?.message || body?.raw || "").toLowerCase();
  return response.status === 400 && (message.includes("unsupported") || message.includes("chatcompletion"));
}

function toResponsesInputMessage(message) {
  const role = message.role === "assistant" ? "assistant" : "user";
  if (role === "assistant") {
    return {
      type: "message",
      role,
      content: [{ type: "output_text", text: message.content }]
    };
  }

  return {
    type: "message",
    role,
    content: message.content
  };
}

function extractResponsesText(body) {
  if (body?.output_text) {
    if (typeof body.output_text === "string") {
      return body.output_text.trim();
    }
    if (Array.isArray(body.output_text)) {
      return body.output_text.join("\n").trim();
    }
  }

  if (!Array.isArray(body?.output)) {
    return "";
  }

  return body.output
    .flatMap((item) => (Array.isArray(item?.content) ? item.content : []))
    .map((content) => {
      if (typeof content?.text === "string") {
        return content.text;
      }
      if (typeof content?.output_text === "string") {
        return content.output_text;
      }
      if (typeof content?.text?.value === "string") {
        return content.text.value;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

function extractChatCompletionText(body) {
  const message = body?.choices?.[0]?.message;
  if (typeof message?.content === "string") {
    return message.content.trim();
  }

  if (Array.isArray(message?.content)) {
    const text = message.content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }
        if (typeof part?.text === "string") {
          return part.text;
        }
        if (typeof part?.output_text === "string") {
          return part.output_text;
        }
        if (typeof part?.text?.value === "string") {
          return part.text.value;
        }
        return "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
    if (text) {
      return text;
    }
  }

  if (typeof message?.refusal === "string" && message.refusal.trim()) {
    return message.refusal.trim();
  }

  if (typeof body?.output_text === "string" && body.output_text.trim()) {
    return body.output_text.trim();
  }

  return "";
}

function normalizeResponsesUsage(usage) {
  if (!usage) {
    return null;
  }

  return {
    prompt_tokens: usage.input_tokens,
    completion_tokens: usage.output_tokens,
    total_tokens: usage.total_tokens
  };
}

function normalizeResponsesReasoningEffort(deployment, value) {
  const requested = normalizeReasoningEffort(value);
  if (!requested) {
    return "";
  }

  const supported = supportedResponsesReasoningEfforts(deployment);
  return supported.includes(requested) ? requested : supported[0] || "";
}

function normalizeChatReasoningEffort(deployment, value) {
  const requested = normalizeReasoningEffort(value);
  if (!requested) {
    return "";
  }

  const normalized = String(deployment || "").toLowerCase();
  if ((normalized.includes("mini") || normalized.includes("nano")) && requested !== "minimal") {
    return "minimal";
  }

  return requested;
}

function supportedResponsesReasoningEfforts(deployment) {
  const normalized = String(deployment || "").toLowerCase();
  if (normalized.includes("pro")) {
    return ["medium", "high", "xhigh"];
  }
  return ["minimal", "low", "medium", "high"];
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
    if (Buffer.concat(chunks).length > 1024 * 1024) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
  }

  if (!chunks.length) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    const error = new Error("Request body must be valid JSON.");
    error.statusCode = 400;
    throw error;
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    ...securityHeaders(),
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(body));
}

function securityHeaders() {
  return {
    "Content-Security-Policy":
      "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Referrer-Policy": "no-referrer",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff"
  };
}

function serviceError(response, body, fallbackMessage) {
  const error = new Error(body?.error?.message || body?.message || body?.raw || fallbackMessage);
  error.statusCode = response.status;
  error.publicMessage = fallbackMessage;
  return error;
}

function requireConfigured(value, name) {
  if (!value) {
    const error = new Error(`${name} is required.`);
    error.statusCode = 503;
    throw error;
  }
}

function enforceApiAccess(req) {
  if (settings.apiAccessMode === "open") {
    return;
  }

  if (settings.apiAccessMode === "app-service-auth") {
    if (req.headers["x-ms-client-principal"]) {
      return;
    }

    const error = new Error("This workshop app requires App Service Authentication.");
    error.statusCode = 401;
    error.publicMessage = "Sign in to access the workshop app.";
    throw error;
  }

  if (!settings.workshopAccessCodes.length) {
    const error = new Error("WORKSHOP_ACCESS_CODE or WORKSHOP_ACCESS_CODES is required when PUBLIC_API_ACCESS_MODE=code.");
    error.statusCode = 503;
    error.publicMessage = "Workshop access is not configured.";
    throw error;
  }

  const providedCode = String(req.headers["x-workshop-access-code"] || "").trim();
  if (providedCode && settings.workshopAccessCodes.includes(providedCode)) {
    return;
  }

  const error = new Error("A valid workshop access code is required.");
  error.statusCode = 401;
  error.publicMessage = "Enter the workshop access code before sending requests.";
  throw error;
}

function enforceApiRateLimit(req, routeName) {
  if (!settings.apiRateLimitPerMinute || settings.apiRateLimitPerMinute < 1) {
    return;
  }

  const windowMs = 60 * 1000;
  const now = Date.now();
  const key = `${routeName}:${clientAddress(req)}`;
  const bucket = (rateLimitBuckets.get(key) || []).filter((timestamp) => now - timestamp < windowMs);

  if (bucket.length >= settings.apiRateLimitPerMinute) {
    const error = new Error("Too many API requests. Wait a minute and try again.");
    error.statusCode = 429;
    error.publicMessage = "Too many API requests. Wait a minute and try again.";
    throw error;
  }

  bucket.push(now);
  rateLimitBuckets.set(key, bucket);
}

function clientAddress(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket?.remoteAddress || "unknown";
}

function ensureApiKeyAllowed(settingName) {
  if (settings.nodeEnv === "production" && !settings.allowProductionApiKeys) {
    const error = new Error(`${settingName} is not allowed in production unless ALLOW_PRODUCTION_API_KEYS=true.`);
    error.statusCode = 503;
    error.publicMessage = "The app is configured for keyless production auth, but managed identity auth is unavailable.";
    throw error;
  }
}

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

function parseList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeApiAccessMode(value) {
  const requested = String(value || "").trim().toLowerCase();
  if (["open", "code", "app-service-auth"].includes(requested)) {
    return requested;
  }
  return process.env.NODE_ENV === "production" ? "code" : "open";
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function buildModelOptions(configuredDeployments, fallbackDeployment) {
  const names = unique([...configuredDeployments, fallbackDeployment]);
  return names.map((name) => ({
    id: name,
    name,
    label: name,
    description: inferModelDescription(name),
    recommendedFor: inferModelPurpose(name),
    isDefault: name === (fallbackDeployment || names[0])
  }));
}

function inferModelDescription(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("nano")) {
    return "Fast warmup model for simple prompts.";
  }
  if (normalized.includes("mini")) {
    return "Balanced model for prompt iteration and structured outputs.";
  }
  if (normalized.includes("pro")) {
    return "Higher-capacity model for grounded or more demanding answers.";
  }
  return "Configured Azure AI model deployment.";
}

function inferModelPurpose(name) {
  const normalized = name.toLowerCase();
  if (normalized.includes("nano")) {
    return "Warmup";
  }
  if (normalized.includes("mini")) {
    return "Prompt lab";
  }
  if (normalized.includes("pro")) {
    return "Grounded answers";
  }
  return "Workshop";
}

function buildDataSources(configuredIndexes, fallbackIndex) {
  return unique([...configuredIndexes, fallbackIndex]).map((indexName) => ({
    id: `search:${indexName}`,
    name: indexName === "documents" ? "Workshop documents" : indexName,
    type: "azure-search",
    indexName,
    enabled: Boolean(settings.searchEndpoint && indexName),
    description: `Azure AI Search index: ${indexName}`
  }));
}

function resolveDeployment(requestedDeployment) {
  const requested = String(requestedDeployment || settings.defaultChatDeployment || "").trim();
  const allowed = settings.modelOptions.map((model) => model.id);
  if (!requested) {
    return settings.defaultChatDeployment;
  }
  if (!allowed.length || allowed.includes(requested)) {
    return requested;
  }

  const error = new Error(`Model deployment "${requested}" is not configured for this playground.`);
  error.statusCode = 400;
  throw error;
}

function resolveDataSource(dataSourceId) {
  const requested = String(dataSourceId || "none").trim();
  if (!requested || requested === "none") {
    return null;
  }

  const source = settings.dataSources.find((candidate) => candidate.id === requested || candidate.indexName === requested);
  if (source) {
    return source;
  }

  const error = new Error(`Data source "${requested}" is not configured for this playground.`);
  error.statusCode = 400;
  throw error;
}

function trimText(value, maxLength) {
  const clean = String(value).replace(/\s+/g, " ").trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 3)}...` : clean;
}

function clampInteger(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}

function normalizeReasoningEffort(value) {
  return ["minimal", "low", "medium", "high", "xhigh"].includes(value) ? value : "";
}

function loadLocalEnv() {
  const envPath = join(process.cwd(), "..", ".env");
  const appEnvPath = join(process.cwd(), ".env");
  for (const filePath of [envPath, appEnvPath]) {
    if (!existsSync(filePath)) {
      continue;
    }

    const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex < 1) {
        continue;
      }

      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, "");
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}
