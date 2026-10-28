 import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const apiKey = process.env.DIFY_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      )
    }

    const response = await fetch(
      "https://api.dify.ai/v1/chat-messages",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: body.inputs || {},
          query: body.query,
          response_mode: body.response_mode || "streaming",
          conversation_id: body.conversation_id || "",
          user: body.user || "cali-ai-demo",
          files: body.files || [],
        }),
      }
    )

    return new Response(response.body, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("Content-Type") ||
          "application/json",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
