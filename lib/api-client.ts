export function resolveApiUrl(endpointOrPath: string): string {
  const rawBase = process.env.NEST_API_URL || 
                  process.env.NEXT_PUBLIC_NEST_API_URL || 
                  process.env.NEXT_PUBLIC_API_URL || 
                  "https://api.taspu.in/api";

  const baseUrl = rawBase.replace(/\/+$/, '');
  let path = endpointOrPath.startsWith('/') ? endpointOrPath : `/${endpointOrPath}`;

  if (baseUrl.endsWith('/api') && path.startsWith('/api/')) {
    path = path.substring(4);
  } else if (baseUrl.endsWith('/api') && path === '/api') {
    path = '';
  }

  return `${baseUrl}${path}`;
}

export function getApiBaseUrl(): string {
  return resolveApiUrl('');
}

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = resolveApiUrl(endpoint);
  const method = options.method || 'GET';

  console.log(`[API Client] [1/5] Resolved URL: ${url}`);
  console.log(`[API Client] [2/5] Immediately before fetch() -> ${method} ${url}`);

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      ...options.headers,
    },
  };

  if (options.cache && options.cache !== 'no-store') {
    fetchOptions.cache = options.cache;
  }

  let res: Response;
  try {
    res = await fetch(url, fetchOptions);
    console.log(`[API Client] [3/5] Immediately after fetch() -> Status: ${res.status} ${res.statusText} (${url})`);
  } catch (err: any) {
    console.error(`[API Client] [5/5] FETCH EXCEPTION during ${method} ${url}:`, {
      name: err?.name,
      message: err?.message,
      cause: err?.cause,
      stack: err?.stack,
    });
    throw err;
  }

  if (!res.ok) {
    let errorMessage = `API error: ${res.status} ${res.statusText}`;
    try {
      const errorText = await res.text();
      console.error(`[API Client] [4/5] Non-2xx response body for ${url}:`, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          errorMessage = Array.isArray(errorJson.message) ? errorJson.message.join(', ') : errorJson.message;
        }
      } catch {}
    } catch (readErr: any) {
      console.error(`[API Client] Could not read error response body:`, readErr?.message);
    }
    throw new Error(errorMessage);
  }

  return res.json();
}
