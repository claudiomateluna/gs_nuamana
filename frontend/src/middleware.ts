import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimit = new Map<string, { count: number; timestamp: number }>()
const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 30

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const now = Date.now()
  const record = rateLimit.get(ip)

  if (record && now - record.timestamp < WINDOW_MS) {
    if (record.count >= MAX_REQUESTS) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }
    record.count++
  } else {
    rateLimit.set(ip, { count: 1, timestamp: now })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
