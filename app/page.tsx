'use client'

import { useEffect, useState, type FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../supabase'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [signup, setSignup] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [noticeKind, setNoticeKind] = useState<'success' | 'error'>('error')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    }).catch(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    setMessage('')

    try {
      if (signup) {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error

        setNoticeKind('success')
        setMessage(data.session
          ? 'تم إنشاء الحساب بنجاح!'
          : 'تم إنشاء الحساب! افتح إيميلك وأكّد الحساب، وبعدها سجّل دخول.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setNoticeKind('error')
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
    return (
      <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', background: '#050a17', color: '#e5efff', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 3 }}>CALI <span style={{ color: '#49b6ff' }}>AI</span></div>
          <p>جاري التحميل...</p>
        </div>
      </main>
    )
  }

  // Keep the existing authenticated Dify chat experience unchanged.
  if (user) {
    return (
      <main style={{ margin: 0, height: '100dvh' }}>
        <header style={{
          padding: '9px 16px', background: '#080f1e', color: 'white',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
        }}>
          <strong>CALI AI 💪</strong>
          <button onClick={logout} style={{ padding: '8px 14px', cursor: 'pointer' }}>تسجيل خروج</button>
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

  return (
    <main className="cali-login" dir="rtl">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="cali-shell">
        <section className="cali-form-panel" aria-label="تسجيل الدخول إلى CALI AI">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">C<span>.</span></span>
            <span className="brand-name">CALI <b>AI</b><small>CALISTHENICS COACH</small></span>
          </div>

          <div className="form-intro">
            <span className="eyebrow"><span className="status-dot" /> YOUR NEXT REP STARTS HERE</span>
            <h1>{signup ? 'ابدأ رحلتك' : 'أهلاً برجعتك'}<span className="highlight">{signup ? ' مع CALI AI.' : ' يا بطل.'}</span></h1>
            <p>مدرّب كاليسثانكس ذكي معك بكل تمرين، خطوة بخطوة.</p>
          </div>

          <div className="tabs" role="group" aria-label="نوع الحساب">
            <button type="button" className={!signup ? 'tab selected' : 'tab'} onClick={() => { setSignup(false); setMessage('') }}>تسجيل الدخول</button>
            <button type="button" className={signup ? 'tab selected' : 'tab'} onClick={() => { setSignup(true); setMessage('') }}>إنشاء حساب</button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="cali-email">البريد الإلكتروني</label>
            <input id="cali-email" type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required dir="ltr" />

            <label htmlFor="cali-password">كلمة المرور</label>
            <div className="password-field">
              <input id="cali-password" type={showPassword ? 'text' : 'password'} autoComplete={signup ? 'new-password' : 'current-password'} minLength={6} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required dir="ltr" />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}>
                {showPassword ? 'إخفاء' : 'إظهار'}
              </button>
            </div>

            {message && <div className={noticeKind === 'success' ? 'notice success' : 'notice error'} role="status">{message}</div>}

            <button className="submit-btn" type="submit" disabled={busy}>
              <span>{busy ? 'جاري التنفيذ...' : signup ? 'إنشاء حساب جديد' : 'ادخل وابدأ التمرين'}</span>
              <span className="arrow" aria-hidden="true">←</span>
            </button>
          </form>

          <p className="microcopy">{signup ? 'عندك حساب بالفعل؟' : 'جديد معنا؟'}{' '}
            <button type="button" onClick={() => { setSignup(!signup); setMessage('') }}>
              {signup ? 'سجّل دخولك' : 'أنشئ حساب مجاني'}
            </button>
          </p>
          <footer>COACH AHMAD KAWOUK <span>•</span> BUILT FOR CALISTHENICS</footer>
        </section>

        <section className="cali-hero" aria-label="رسمة رياضي كاليسثانكس يؤدي تمرين Front Lever">
          <div className="hero-grid" />
          <div className="hero-light" />
          <div className="hero-art" aria-hidden="true">
            <svg viewBox="0 0 600 440" xmlns="http://www.w3.org/2000/svg" role="img">
              <defs>
                <linearGradient id="athlete" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#93e8ff" />
                  <stop offset="0.55" stopColor="#3199ed" />
                  <stop offset="1" stopColor="#0f4e9b" />
                </linearGradient>
                <linearGradient id="bar" x1="0" x2="0" y1="0" y2="1">
                  <stop stopColor="#b7d7fa" /><stop offset="1" stopColor="#316199" />
                </linearGradient>
              </defs>
              <circle cx="320" cy="228" r="158" stroke="#4aaeff" strokeOpacity=".12" strokeWidth="1" fill="none" />
              <circle cx="320" cy="228" r="118" stroke="#4aaeff" strokeOpacity=".10" strokeWidth="1" fill="none" />
              <path d="M91 104H513" stroke="url(#bar)" strokeWidth="10" strokeLinecap="round" />
              <path d="M110 104V390M495 104V390" stroke="#4f84c0" strokeOpacity=".22" strokeWidth="9" />
              <path d="M91 104H513" stroke="#b7eeff" strokeOpacity=".8" strokeWidth="2" />
              {/* Straight-body front lever illustration, with an athlete gripping the bar */}
              <g fill="url(#athlete)" stroke="#91dcff" strokeOpacity=".16" strokeWidth="2">
                <circle cx="355" cy="196" r="25" />
                <path d="M337 213Q320 224 295 224L218 224Q190 226 174 234L91 236Q77 237 75 249Q73 260 94 259L210 256Q246 258 292 252Q323 249 338 239L352 218Z" />
                <path d="M315 229Q334 192 339 158L341 112Q341 101 331 101Q322 101 321 113L315 150Q306 185 291 217Z" />
                <path d="M342 224Q360 184 382 155L390 113Q394 103 405 107Q415 112 410 123L399 162Q389 199 372 236Z" />
                <path d="M214 239L94 251Q76 253 76 265Q78 278 97 275L224 261Z" />
              </g>
              <path d="M73 296H527" stroke="#5fa3ee" strokeOpacity=".15" strokeDasharray="3 10" />
            </svg>
          </div>
          <div className="hero-caption">
            <div className="hero-kicker">DISCIPLINE <span>/</span> STRENGTH <span>/</span> PROGRESS</div>
            <h2>DEFY<br /><em>GRAVITY.</em></h2>
            <p>TRAIN SMARTER. GET STRONGER.</p>
            <div className="hero-underline" />
          </div>
          <div className="hero-side-label">FRONT LEVER • CALISTHENICS</div>
        </section>
      </div>
      <style jsx>{`
        * { box-sizing: border-box; }
        .cali-login { min-height: 100dvh; display: grid; place-items: center; padding: 28px; position: relative; overflow: hidden; background: #050914; color: #f4f8ff; font-family: Arial, Tahoma, sans-serif; }
        .ambient { position: absolute; pointer-events: none; border-radius: 50%; filter: blur(75px); }
        .ambient-one { width: 450px; height: 450px; top: -240px; right: -130px; background: #154eaa66; }
        .ambient-two { width: 380px; height: 380px; bottom: -180px; left: -80px; background: #0779b82b; }
        .cali-shell { position: relative; isolation: isolate; display: grid; grid-template-columns: 1fr 1.03fr; max-width: 1080px; width: 100%; min-height: 650px; border: 1px solid #28405e99; border-radius: 28px; box-shadow: 0 38px 100px #0009, 0 0 70px #1676f312; overflow: hidden; background: #0b1526; }
        .cali-form-panel { padding: clamp(28px, 5vw, 58px); background: linear-gradient(145deg, #0d1729, #080f1e 70%); display: flex; flex-direction: column; z-index: 2; }
        .brand { display: flex; align-items: center; gap: 11px; direction: ltr; justify-content: flex-end; }
        .brand-mark { display: grid; place-items: center; width: 47px; height: 47px; background: linear-gradient(150deg, #39c5ff, #1466dd); border-radius: 14px; font-size: 26px; font-weight: 900; color: white; box-shadow: 0 9px 32px #1180ff40; }
        .brand-mark span { color: #9deeff; }
        .brand-name { font-size: 24px; font-weight: 900; letter-spacing: 1px; line-height: 1; }
        .brand-name b { color: #54b9ff; }
        .brand-name small { display: block; color: #8ca7c8; font-size: 8px; font-weight: 600; letter-spacing: 2px; margin-top: 7px; }
        .form-intro { margin: 49px 0 24px; }
        .eyebrow { font-family: Arial, sans-serif; direction: ltr; display: inline-flex; align-items: center; gap: 9px; color: #62b9ff; font-size: 10px; font-weight: 800; letter-spacing: 1.6px; }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #3ad9cb; box-shadow: 0 0 14px #3ad9cb; }
        h1 { color: #fff; font-size: clamp(30px, 3.8vw, 42px); line-height: 1.25; letter-spacing: -.6px; margin: 13px 0 10px; font-weight: 900; }
        .highlight { color: #58b5ff; display: block; }
        .form-intro p { font-size: 14px; line-height: 1.8; margin: 0; color: #a0afc8; }
        .tabs { padding: 4px; background: #111f34; border: 1px solid #233753; display: flex; gap: 4px; border-radius: 11px; margin-bottom: 24px; }
        .tab { flex: 1; background: transparent; border: 0; border-radius: 8px; color: #9aaecb; padding: 11px 4px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .tab.selected { background: #256bd5; color: white; box-shadow: 0 3px 12px #0004; }
        .login-form { display: flex; flex-direction: column; }
        .login-form label { color: #d8e5f7; font-size: 13px; font-weight: 700; margin: 0 0 10px; }
        .login-form input { width: 100%; min-height: 49px; background: #0a1323; color: #fff; padding: 13px 15px; border-radius: 10px; border: 1px solid #2a3b55; outline: none; font-size: 15px; transition: border-color .2s, box-shadow .2s; margin-bottom: 22px; }
        .login-form input:focus { border-color: #52baff; box-shadow: 0 0 0 3px #208ffd24; }
        .login-form input::placeholder { color: #73849e; }
        .password-field { position: relative; }
        .password-field input { padding-right: 65px; }
        .password-toggle { position: absolute; right: 9px; top: 8px; font-size: 12px; color: #77bfff; border: 0; background: none; cursor: pointer; padding: 10px 6px; }
        .notice { font-size: 12px; line-height: 1.7; padding: 11px 13px; border-radius: 9px; margin-bottom: 14px; }
        .notice.success { background: #0d3e38; color: #9cf5d7; border: 1px solid #2c7a68; }
        .notice.error { background: #47222a; color: #ffc0ca; border: 1px solid #93424f; }
        .submit-btn { width: 100%; padding: 15px 18px; display: flex; align-items: center; justify-content: center; gap: 15px; background: linear-gradient(100deg, #1371e9, #2faff7); color: #fff; font-size: 15px; font-weight: 800; border: none; border-radius: 11px; cursor: pointer; box-shadow: 0 10px 30px #177ce83c; transition: transform .2s, filter .2s; }
        .submit-btn:not(:disabled):hover { transform: translateY(-2px); filter: brightness(1.12); }
        .submit-btn:disabled { opacity: .6; cursor: wait; }
        .arrow { font-size: 20px; }
        .microcopy { font-size: 12px; color: #91a6c3; text-align: center; margin: 22px 0 0; }
        .microcopy button { background: none; border: 0; color: #6cc4ff; font-size: inherit; font-weight: 700; cursor: pointer; }
        footer { margin-top: auto; padding-top: 35px; text-align: center; direction: ltr; font-size: 9px; letter-spacing: 1.4px; color: #6e819e; }
        footer span { color: #3d93ef; margin: 0 8px; }
        .cali-hero { position: relative; min-height: 650px; overflow: hidden; background: radial-gradient(ellipse at 50% 42%, #164c85 0, #0a2a50 36%, #08172f 75%); direction: ltr; }
        .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(#7fc6ff0c 1px, transparent 1px), linear-gradient(90deg, #7fc6ff0c 1px, transparent 1px); background-size: 36px 36px; mask-image: linear-gradient(to bottom, black, transparent); }
        .hero-light { position: absolute; width: 360px; height: 360px; top: 30px; left: 25%; background: #198bfa42; border-radius: 100%; filter: blur(80px); }
        .hero-art { position: absolute; width: 110%; left: -5%; top: 70px; filter: drop-shadow(0 14px 20px #28a7ff35); }
        .hero-art svg { width: 100%; height: auto; }
        .hero-caption { position: absolute; bottom: 70px; left: 48px; z-index: 1; }
        .hero-kicker { font-size: 10px; letter-spacing: 2px; color: #8db9db; font-weight: 800; }
        .hero-kicker span { color: #55bfff; padding: 0 8px; }
        h2 { font-size: clamp(54px, 7vw, 92px); line-height: .95; letter-spacing: -3px; font-weight: 900; margin: 15px 0; color: white; }
        h2 em { font-style: normal; color: #55baff; }
        .hero-caption p { font-size: 11px; color: #bfd4ea; font-weight: bold; letter-spacing: 3px; }
        .hero-underline { height: 4px; width: 54px; background: #55baff; border-radius: 9px; margin-top: 25px; }
        .hero-side-label { position: absolute; right: 15px; top: 36%; writing-mode: vertical-rl; color: #8cafda; font-size: 9px; letter-spacing: 2.5px; }
        @media (max-width: 800px) {
          .cali-login { padding: 12px; align-items: start; }
          .cali-shell { display: flex; flex-direction: column; min-height: calc(100dvh - 24px); }
          .cali-hero { order: -1; min-height: 200px; flex-shrink: 0; }
          .hero-art { top: -92px; left: 5%; width: 90%; }
          .hero-caption { left: 22px; bottom: 16px; }
          h2 { font-size: 42px; letter-spacing: -1px; margin: 0; }
          .hero-kicker, .hero-caption p, .hero-underline, .hero-side-label { display: none; }
          .cali-form-panel { flex: 1; padding: 27px 24px 24px; }
          .form-intro { margin-top: 35px; }
          h1 { font-size: clamp(29px, 8vw, 42px); }
          footer { padding-top: 35px; }
        }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; } }
      `}</style>
    </main>
  )
}
