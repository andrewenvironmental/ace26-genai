import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const publicRoot = join(process.cwd(), "public");
const tokenCache = new Map();

const settings = {
  port: Number(process.env.PORT || 5050),
  workshopName: process.env.WORKSHOP_NAME || "ACE26 GenAI Workshop",
  aiEndpoint: trimTrailingSlash(process.env.AZURE_AI_SERVICES_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT || ""),
  chatDeployment: process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || process.env.CHAT_DEPLOYMENT_NAME || "",
  openAiApiVersion: process.env.AZURE_OPENAI_API_VERSION || "v1",
  openAiTokenScope:
    process.env.AZURE_OPENAI_TOKEN_SCOPE ||
    (process.env.AZURE_OPENAI_API_VERSION && process.env.AZURE_OPENAI_API_VERSION !== "v1"
      ? "https://cognitiveservices.azure.com/.default"
      : "https://ai.azure.com/.default"),
  openAiApiKey: process.env.AZURE_OPENAI_API_KEY || "",
  searchEndpoint: trimTrailingSlash(process.env.AZURE_SEARCH_ENDPOINT || ""),
  searchIndex: process.env.AZURE_SEARCH_INDEX || "documents",
  searchApiVersion: process.env.AZURE_SEARCH_API_VERSION || "2024-07-01",
  searchApiKey: process.env.AZURE_SEARCH_API_KEY || "",
  foundryPortalUrl: process.env.AI_FOUNDRY_PORTAL_URL || "https://ai.azure.com",
  storageContainer: process.env.AZURE_STORAGE_CONTAINER || "workshop-docs"
};

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
  "Use the documents. Return only a markdown table with exactly 2 rows and 3 columns: category, description, cost. Rows: WTP Minor Improvements; Major Mains Bucket. Keep descriptions under 10 words."
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

    if (req.method === "POST" && url.pathname === "/api/search") {
      const body = await readJson(req);
      const result = await searchDocuments(body.query, body.top);
      return sendJson(res, 200, result);
    }

    if (req.method === "POST" && url.pathname === "/api/chat") {
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
  requireConfigured(settings.chatDeployment, "AZURE_OPENAI_CHAT_DEPLOYMENT");

  const messages = normalizeMessages(body.messages);
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content || "";
  const useGrounding = Boolean(body.useGrounding);
  const sources = useGrounding ? (await searchDocuments(lastUserMessage, body.top)).documents : [];
  const systemPrompt = buildSystemPrompt(body.systemPrompt, sources);
  const payload = {
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    max_completion_tokens: clampInteger(body.maxCompletionTokens, 100, 4096, 900),
    stream: false
  };

  if (settings.openAiApiVersion === "v1") {
    payload.model = settings.chatDeployment;
  }

  const reasoningEffort = normalizeReasoningEffort(body.reasoningEffort);
  if (reasoningEffort) {
    payload.reasoning_effort = reasoningEffort;
  }

  const response = await fetch(openAiUrl(), {
    method: "POST",
    headers: await openAiHeaders(),
    body: JSON.stringify(payload)
  });

  const responseBody = await parseResponse(response);
  if (!response.ok) {
    throw serviceError(response, responseBody, "Azure AI chat completion failed.");
  }

  const choice = responseBody.choices?.[0]?.message;
  return {
    message: {
      role: "assistant",
      content: choice?.content || ""
    },
    sources,
    usage: responseBody.usage || null,
    model: responseBody.model || settings.chatDeployment
  };
}

async function searchDocuments(query, requestedTop) {
  if (!settings.searchEndpoint || !settings.searchIndex) {
    return {
      enabled: false,
      documents: [],
      warning: "Azure AI Search is not configured for this playground."
    };
  }

  const top = clampInteger(requestedTop, 1, 8, 4);
  const searchUrl = `${settings.searchEndpoint}/indexes/${encodeURIComponent(
    settings.searchIndex
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
    chatDeployment: settings.chatDeployment,
    searchIndex: settings.searchIndex,
    storageContainer: settings.storageContainer,
    foundryPortalUrl: settings.foundryPortalUrl,
    defaultInstructions,
    samplePrompts,
    configured: {
      chat: Boolean(settings.aiEndpoint && settings.chatDeployment),
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
    res.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
      "Cache-Control": extname(filePath) === ".html" ? "no-store" : "public, max-age=300"
    });
    res.end(content);
  } catch {
    sendJson(res, 404, { error: "Not found." });
  }
}

async function openAiHeaders() {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (settings.openAiApiKey) {
    headers["api-key"] = settings.openAiApiKey;
  } else {
    headers.Authorization = `Bearer ${await getAccessToken(settings.openAiTokenScope)}`;
  }
  return headers;
}

async function searchHeaders() {
  const headers = { "Content-Type": "application/json", Accept: "application/json" };
  if (settings.searchApiKey) {
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
    const { stdout } = await execFileAsync("az", [
      "account",
      "get-access-token",
      "--resource",
      resource,
      "--output",
      "json"
    ]);
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

function openAiUrl() {
  if (settings.openAiApiVersion === "v1") {
    return `${settings.aiEndpoint}/openai/v1/chat/completions`;
  }

  return `${settings.aiEndpoint}/openai/deployments/${encodeURIComponent(
    settings.chatDeployment
  )}/chat/completions?api-version=${encodeURIComponent(settings.openAiApiVersion)}`;
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
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  res.end(JSON.stringify(body));
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

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, "");
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
  return ["minimal", "low", "medium", "high"].includes(value) ? value : "";
}
