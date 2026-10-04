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

  console.log(`[API Client] Executing ${options.method || 'GET'} -> ${url}`);

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: options.cache || 'no-store',
  });

  if (!res.ok) {
    let errorMessage = `API error: ${res.status} ${res.statusText}`;
    try {
      const errorJson = await res.json();
      if (errorJson.message) {
        errorMessage = Array.isArray(errorJson.message) ? errorJson.message.join(', ') : errorJson.message;
      }
    } catch {}
    throw new Error(errorMessage);
  }

  return res.json();
}
