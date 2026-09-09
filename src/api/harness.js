const DEFAULT_TIMEOUT_MS = 15000;
const MAX_RETRIES = 1;
const RATE_LIMIT_BACKOFF_MS = 1500;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function classifyError(err) {
  if (err.code === "ECONNABORTED" || err.name === "CanceledError") return "timeout";
  if (!err.response) return "network";
  if (err.response.status === 401) return "auth";
  if (err.response.status === 429) return "rate_limit";
  if (err.response.status >= 500) return "provider_error";
  return "bad_request";
}

function getRetryAfterMs(err) {
  const retryAfter = err.response?.headers?.["retry-after"];
  const seconds = Number(retryAfter);
  return Number.isFinite(seconds) ? seconds * 1000 : null;
}

export async function withHarness(provider, requestFn, { signal: externalSignal } = {}) {
  const startedAt = performance.now();
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (externalSignal?.aborted) {
      throw Object.assign(new Error("cancelled"), {
        harness: { provider, kind: "cancelled", attempt, latencyMs: performance.now() - startedAt },
      });
    }

    const controller = new AbortController();
    const onExternalAbort = () => controller.abort();
    externalSignal?.addEventListener("abort", onExternalAbort);
    const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const data = await requestFn(controller.signal);
      clearTimeout(timer);
      externalSignal?.removeEventListener("abort", onExternalAbort);
      return data;
    } catch (err) {
      clearTimeout(timer);
      externalSignal?.removeEventListener("abort", onExternalAbort);

      const kind = externalSignal?.aborted ? "cancelled" : classifyError(err);
      lastError = Object.assign(new Error(err.message), {
        harness: { provider, kind, attempt, latencyMs: performance.now() - startedAt },
      });

      if (kind === "auth" || kind === "bad_request" || kind === "cancelled") break;

      if (kind === "rate_limit" && attempt < MAX_RETRIES) {
        await sleep(getRetryAfterMs(err) ?? RATE_LIMIT_BACKOFF_MS);
      }
    }
  }

  throw lastError;
}
