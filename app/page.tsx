'use client'

import { useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  text: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  function sendMessage() {
    const text = input.trim()
    if (!text) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
  }

  return (
    <main style={{ maxWidth: 800, margin: 'auto', padding: 24, fontFamily: 'Arial' }}>
      <h1>CALI AI 💪</h1>
      <p>Coach Ahmad Kawouk</p>

      <section style={{ minHeight: '65vh' }}>
        {messages.map((message, index) => (
          <p key={index}>
            <strong>{message.role === 'user' ? 'أنت' : 'CALI AI'}:</strong>{' '}
            {message.text}
          </p>
        ))}
      </section>

      <form onSubmit={e => { e.preventDefault(); sendMessage() }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="اكتب سؤالك هون..."
          style={{ width: '75%', padding: 12 }}
        />
        <button type="submit" style={{ padding: 12 }}>إرسال</button>
      </form>
    </main>
  )
}
