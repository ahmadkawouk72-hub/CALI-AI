import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  try {
    const { data } = await client.getApplicationParameters(user)
    return NextResponse.json(data as object, {
      headers: setSession(sessionId),
    })
  }
  catch (error) {
  console.error('CALI AI parameters error:', error)

  return NextResponse.json(
    { error: 'Failed to load parameters. Check Vercel logs.' },
    { status: 500 }
  )
}
}
