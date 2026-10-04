import { NextRequest, NextResponse } from "next/server";
import { resolveApiUrl } from "@/lib/api-client";

async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const rawPath = path ? path.join('/') : '';
  const searchParams = request.nextUrl.search;
  
  const targetUrl = `${resolveApiUrl(rawPath)}${searchParams}`;

  console.log(`[Next.js API Proxy] ${request.method} ${request.nextUrl.pathname} -> ${targetUrl}`);

  try {
    const headers = new Headers(request.headers);
    headers.delete('host');

    const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await request.blob();

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });

    const responseHeaders = new Headers(response.headers);

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error(`[Next.js API Proxy Error] Failed to proxy ${targetUrl}:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to communicate with NestJS backend API." },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
