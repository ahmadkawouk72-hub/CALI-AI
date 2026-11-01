'use client'

import { useEffect, useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [activePage, setActivePage] = useState<'home' | 'ai' | 'library'>('home')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [signup, setSignup] = useState(false)
  const [recovering, setRecovering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [noticeKind, setNoticeKind] = useState<'success' | 'error'>('error')

  useEffect(() => {
    let active = true
    supabase.auth.getUser()
      .then(({ data }) => {
        if (active) {
          setUser(data.user)
          setLoading(false)
        }
      })
      .catch(() => { if (active) setLoading(false) })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      setUser(session?.user ?? null)
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      if (recovering) {
        const { error } = await supabase.auth.updateUser({ password })
        if (error) throw error
        setRecovering(false)
        setPassword('')
        return
      }
      if (signup) {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setNoticeKind('success')
        setMessage(data.session
          ? 'Your account was created successfully.'
          : 'Account created! Check your email to confirm it, then log in.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setNoticeKind('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function forgotPassword() {
    if (!email.trim()) {
      setNoticeKind('error')
      setMessage('Please enter your email address first.')
      return
    }
    setBusy(true)
    setMessage('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      })
      if (error) throw error
      setNoticeKind('success')
      setMessage('If this email has an account, a password reset link will be sent.')
    } catch (err) {
      setNoticeKind('error')
      setMessage(err instanceof Error ? err.message : 'Could not send the reset email.')
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', background: '#040b14', color: '#e5efff', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <strong style={{ fontSize: 28 }}>CALI <span style={{ color: '#139df7' }}>AI</span></strong>
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  if (user && !recovering && activePage === 'home') {
  return (
    <main style={{
      minHeight: '100dvh',
      background: '#030d18',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <h1>CALI AI</h1>
      <h2>Choose Your Experience</h2>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        flexWrap: 'wrap',
        marginTop: 40
      }}>
        <button
          onClick={() => setActivePage('ai')}
          style={{
            padding: 30,
            background: '#087ef4',
            color: 'white',
            border: 0,
            borderRadius: 15,
            cursor: 'pointer',
            fontSize: 20
          }}
        >
          AI Coach
        </button>

        <button
          onClick={() => setActivePage('library')}
          style={{
            padding: 30,
            background: '#123453',
            color: 'white',
            border: 0,
            borderRadius: 15,
            cursor: 'pointer',
            fontSize: 20
          }}
        >
          Exercise Library
        </button>
      </div>
    </main>
  )
}
  // The authenticated Dify chat is deliberately the same working iframe.
if (user && !recovering && activePage === 'ai') {
    return (
      <main style={{ margin: 0, height: '100dvh' }}>
        <header style={{ padding: '9px 16px', background: '#080f1e', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <strong>CALI AI 💪</strong>
          <button
  onClick={() => setActivePage('home')}
  style={{ padding: '8px 14px', cursor: 'pointer' }}
>
  ← Back
</button>
          <button onClick={logout} style={{ padding: '8px 14px', cursor: 'pointer' }}>Log Out</button>
        </header>
        <iframe
          src="https://udify.app/chatbot/KayzquSIOehV9P61"
          title="CALI AI"
          style={{ display: 'block', width: '100%', height: 'calc(100dvh - 53px)', border: 0 }}
          allow="microphone"
        />
      </main>
    )
  }
if (user && !recovering && activePage === 'library') {
  return (
    <main style={{
      minHeight: '100dvh',
      background: '#030d18',
      color: 'white',
      padding: 24,
      fontFamily: 'Arial, sans-serif'
    }}>
      <button
        onClick={() => setActivePage('home')}
        style={{ padding: 12, cursor: 'pointer' }}
      >
        ← Back
      </button>

      <h1>Exercise Library</h1>
      <p>Your exercise videos will appear here.</p>
    </main>
  )
}
  return (
    <main className="cali-login-page" lang="en" dir="ltr">
      <div className="cali-login-card">
        <div className="cali-hero" role="img" aria-label="Calisthenics athlete performing a pull-up, seen from behind" />

        <section className="cali-content" aria-label="CALI AI account access">
          <div className="cali-brand">
            <div className="cali-logo" aria-hidden="true">C</div>
            <div className="cali-brand-rule" />
            <div className="cali-wordmark">
              <div>CALI <span>AI</span></div>
              <small>CALISTHENICS COACH</small>
            </div>
          </div>

          <div className="cali-accent" />
          <h1>
            {recovering ? <>Set a New <em>Password.</em></> : signup
              ? <>Join the <em>Team.</em></>
              : <>Welcome Back, <em>Athlete.</em></>}
          </h1>
          <p className="cali-tagline">Your AI Calisthenics Coach.</p>
          <p className="cali-description">Get programs, guidance, and answers — anytime, anywhere.</p>

          {!recovering && (
            <div className="cali-tabs" role="group" aria-label="Account action">
              <button type="button" className={!signup ? 'active' : ''} aria-pressed={!signup}
                onClick={() => { setSignup(false); setMessage('') }}>Log In</button>
              <button type="button" className={signup ? 'active' : ''} aria-pressed={signup}
                onClick={() => { setSignup(true); setMessage('') }}>Sign Up</button>
            </div>
          )}

          <form className="cali-form" onSubmit={handleSubmit}>
            {!recovering && (
              <div className="cali-field">
                <label htmlFor="cali-email">Email address</label>
                <div className="cali-input-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="1.5" />
                    <path d="m3.5 6 8.5 7 8.5-7" />
                  </svg>
                  <input id="cali-email" type="email" inputMode="email" autoComplete="email"
                    placeholder="name@example.com" value={email} required
                    onChange={e => setEmail(e.target.value)} />
                </div>
              </div>
            )}
            <div className="cali-field">
              <label htmlFor="cali-password">{recovering ? 'New password' : 'Password'}</label>
              <div className="cali-input-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="11" rx="1.5" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <input id="cali-password" type={showPassword ? 'text' : 'password'}
                  autoComplete={signup || recovering ? 'new-password' : 'current-password'}
                  minLength={6} placeholder="••••••••" value={password} required
                  onChange={e => setPassword(e.target.value)} />
                <button type="button" className="cali-password-toggle" onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {!signup && !recovering && (
              <button className="cali-forgot" type="button" onClick={forgotPassword} disabled={busy}>
                Forgot your password?
              </button>
            )}
            {message && (
              <div className={`cali-notice ${noticeKind}`} role="status">{message}</div>
            )}
            <button className="cali-submit" type="submit" disabled={busy}>
              <span>{busy ? 'Please wait...' : recovering ? 'Update Password'
                : signup ? 'Create My Account' : 'Log In & Start Training'}</span>
              <span className="cali-arrow" aria-hidden="true">→</span>
            </button>
          </form>
          {!recovering && (
            <p className="cali-switch">
              {signup ? 'Already have an account?' : 'New here?'}{' '}
              <button type="button" onClick={() => { setSignup(!signup); setMessage('') }}>
                {signup ? 'Log in' : 'Create a free account'}
              </button>
            </p>
          )}
        </section>
      </div>
      <style jsx>{`
        * { box-sizing: border-box; }
        .cali-login-page { background: #030a13; min-height: 100dvh; display: flex; justify-content: center; align-items: flex-start; font-family: Arial, Helvetica, sans-serif; color: #fff; padding: 0; }
        .cali-login-card { width: 100%; max-width: 550px; background: linear-gradient(170deg,#050d16,#020c16 65%,#010913); border: 1px solid #16253b; box-shadow: 0 20px 80px #000b; overflow: hidden; }
        .cali-hero { width: 100%; aspect-ratio: 1037 / 485; background: url('/cali-hero.jpg') center center / cover no-repeat, #071522; }
        .cali-content { padding: 8px clamp(22px, 6vw, 48px) 56px; text-align: center; background: radial-gradient(ellipse at 50% 0%,#10213b55,transparent 55%), #030d18; }
        .cali-brand { display: flex; align-items: center; justify-content: center; gap: clamp(10px,3vw,24px); margin: 0 auto; }
        .cali-logo { width: clamp(54px,15vw,78px); height: clamp(54px,15vw,78px); flex: none; border-radius: 22%; display: grid; place-items: center; font-size: clamp(33px,9vw,47px); font-weight: 800; color: white; background: linear-gradient(145deg,#12b9ff,#0750e9); box-shadow: 0 12px 35px #007df439; }
        .cali-brand-rule { height: 52px; width: 2px; background: #70dcff; opacity: .86; }
        .cali-wordmark { text-align: left; font-size: clamp(28px,8vw,48px); font-weight: 900; line-height: 1; letter-spacing: -.8px; white-space: nowrap; }
        .cali-wordmark span { color: #129dff; }
        .cali-wordmark small { display: block; letter-spacing: clamp(2px,.56vw,4px); color: #d6e0ef; font-size: clamp(8px,2.1vw,13px); font-weight: 600; margin-top: 12px; }
        .cali-accent { width: 38px; height: 3px; background: #08aaff; border-radius: 5px; margin: 20px auto 18px; }
        h1 { margin: 0 0 9px; font-size: clamp(27px,6vw,40px); letter-spacing: -1.25px; line-height: 1.18; font-weight: 900; white-space: nowrap; font-style: italic; }
        h1 em { color: #159cff; font-style: italic; }
        .cali-tagline { font-size: clamp(14px,3.6vw,18px); color: #b6c0d1; margin: 8px 0 3px; }
        .cali-description { font-size: clamp(12px,3.2vw,16px); line-height: 1.65; color: #adb8c9; margin: 0 auto 23px; max-width: 450px; }
        .cali-tabs { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid #31445f; border-radius: 15px; overflow: hidden; margin-bottom: 18px; }
        .cali-tabs button { color: #f4f7ff; background: #091928; border: none; cursor: pointer; font-size: 17px; font-weight: 800; min-height: 52px; padding: 12px 6px; }
        .cali-tabs button.active { background: linear-gradient(105deg,#119eff,#0879ef); border-radius: 14px; }
        .cali-form { display: flex; flex-direction: column; text-align: left; }
        .cali-field { margin-bottom: 16px; }
        .cali-field label { display: block; margin: 0 0 9px; color: #f1f4fb; font-weight: 700; font-size: 15px; }
        .cali-input-wrap { border: 1px solid #3a4d67; border-radius: 11px; display: flex; align-items: center; gap: 12px; min-height: 54px; padding: 0 13px; background: #071321; }
        .cali-input-wrap:focus-within { border-color: #25b4ff; box-shadow: 0 0 0 3px #129dff20; }
        .cali-input-wrap svg { width: 22px; height: 22px; color: #a6b9d2; flex-shrink: 0; }
        .cali-input-wrap input { min-width: 0; flex: 1; border: 0; padding: 15px 0; color: white; font-size: 16px; outline: none; background: transparent; font-family: inherit; }
        .cali-input-wrap input::placeholder { color: #7c8ca5; }
        .cali-password-toggle { font-size: 13px; color: #46b8ff; background: none; border: 0; padding: 10px 0 10px 8px; cursor: pointer; }
        .cali-forgot { align-self: flex-end; margin: -5px 0 21px; color: #23b4ff; background: transparent; border: 0; font-size: 14px; cursor: pointer; }
        .cali-notice { font-size: 13px; padding: 11px 12px; border-radius: 10px; margin-bottom: 15px; line-height: 1.5; }
        .cali-notice.error { background: #481921; border: 1px solid #8f3d48; color: #ffcbd0; }
        .cali-notice.success { background: #103a30; border: 1px solid #337b64; color: #aaf6d7; }
        .cali-submit { margin-top: 3px; display: flex; justify-content: center; align-items: center; gap: 12px; width: 100%; min-height: 61px; border: 1px solid #05b0ff; color: #fff; background: linear-gradient(100deg,#0ba4fb,#0655ef); box-shadow: 0 14px 33px #0879ed30; border-radius: 13px; font-size: clamp(15px,4.2vw,20px); font-weight: 800; cursor: pointer; padding: 12px 15px; }
        .cali-submit:disabled { opacity: .6; cursor: wait; }
        .cali-arrow { font-size: 25px; line-height: 1; }
        .cali-switch { color: #acb9cb; font-size: 14px; margin: 23px 0 0; }
        .cali-switch button { color: #2bb6ff; font-weight: 700; background: none; border: 0; font-size: inherit; cursor: pointer; padding: 0; }
        @media (min-width: 650px) { .cali-login-page { padding: 28px 12px; } .cali-login-card { border-radius: 22px; } }
        @media (max-width: 370px) { .cali-content { padding-left: 15px; padding-right: 15px; } h1 { font-size: 23px; } .cali-wordmark { font-size: 25px; } .cali-wordmark small { font-size: 7px; } .cali-tabs button { font-size: 15px; } }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>
    </main>
  )
}
