const DEFAULT_TIMEOUT_MS = 15000;
const MAX_RETRIES = 1;

function classifyError(err) {
  if (err.code === "ECONNABORTED" || err.name === "CanceledError") return "timeout";
  if (!err.response) return "network";
  if (err.response.status === 401) return "auth";
  if (err.response.status === 429) return "rate_limit";
  if (err.response.status >= 500) return "provider_error";
  return "bad_request";
}

export async function withHarness(provider, requestFn) {
  const startedAt = performance.now();
  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const data = await requestFn(controller.signal);
      clearTimeout(timer);
      return data;
    } catch (err) {
      clearTimeout(timer);
      const kind = classifyError(err);
      lastError = Object.assign(new Error(err.message), {
        harness: { provider, kind, attempt, latencyMs: performance.now() - startedAt },
      });
      if (kind === "auth" || kind === "bad_request") break;
    }
  }

  throw lastError;
}
