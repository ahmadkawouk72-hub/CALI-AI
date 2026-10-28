'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [signup, setSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMessage('')

    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        if (!data.session) {
          setMessage('تم إنشاء الحساب! افتح إيميلك وأكّد الحساب، وبعدها سجّل دخول.')
        } else {
          setMessage('تم إنشاء الحساب بنجاح!')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'صار خطأ. جرّب مجدداً.')
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return <main style={{ padding: 40, textAlign: 'center' }}>
      جاري التحميل...
    </main>
  }

  if (user) {
    return (
      <main style={{ margin: 0, height: '100dvh' }}>
        <header style={{
          padding: '9px 16px',
          background: '#080f1e',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12
        }}>
          <strong>CALI AI 💪</strong>
          <button onClick={logout} style={{
            padding: '8px 14px',
            cursor: 'pointer'
          }}>
            تسجيل خروج
          </button>
        </header>

        <iframe
          src="https://udify.app/chatbot/KayzquSIOehV9P61"
          title="CALI AI"
          style={{
            display: 'block',
            width: '100%',
            height: 'calc(100dvh - 53px)',
            border: 0
          }}
          allow="microphone"
        />
      </main>
    )
  }

  return (
    <main dir="rtl" style={{
      minHeight: '100dvh',
      background: '#080f1e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: 'Arial, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: 30,
        borderRadius: 16,
        width: '100%',
        maxWidth: 380,
        display: 'grid',
        gap: 15
      }}>
        <h1 style={{ textAlign: 'center', margin: 0 }}>
          CALI AI 💪
        </h1>

        <p style={{ textAlign: 'center', margin: 0 }}>
          Coach Ahmad Kawouk
        </p>

        <h2 style={{ textAlign: 'center' }}>
          {signup ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
        </h2>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 13, fontSize: 16 }}
        />

        <input
          type="password"
          placeholder="كلمة السر (6 أحرف على الأقل)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ padding: 13, fontSize: 16 }}
        />

        <button disabled={busy} type="submit" style={{
          background: '#2563eb',
          color: 'white',
          padding: 14,
          border: 0,
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: 16
        }}>
          {busy ? 'جاري التنفيذ...' :
            signup ? 'إنشاء حساب' : 'تسجيل دخول'}
        </button>

        {message && <p style={{ color: '#b91c1c' }}>{message}</p>}

        <button
          type="button"
          onClick={() => {
            setSignup(!signup)
            setMessage('')
          }}
          style={{
            background: 'transparent',
            border: 0,
            color: '#2563eb',
            cursor: 'pointer',
            padding: 10
          }}
        >
          {signup
            ? 'عندك حساب؟ سجّل دخول'
            : 'ما عندك حساب؟ أنشئ حساب جديد'}
        </button>
      </form>
    </main>
  )
}
