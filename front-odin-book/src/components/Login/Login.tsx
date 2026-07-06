import { Link, useNavigate } from 'react-router'
import onHandleSubmitLogin from '../../../services/onHandleLogin'
import { useContext, useState } from 'react'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Inputs } from '../Signup/Signup'
import { UserSession } from '../../contex/context'

const apiUrl = import.meta.env.VITE_API_URL

function Login () {
  const { register, setError, handleSubmit, formState: { errors, isSubmitting } } = useForm<Inputs>()
  const navigate = useNavigate()
  const contex = useContext(UserSession)

  if (!contex) {
    throw new Error('component outside provider ')
  }
  const [loading, setLoading] = useState(false)
  const { setUser } = contex

  const onSubmit: SubmitHandler<Inputs> = async data => {
    const success = await onHandleSubmitLogin(data, setUser, setError)
    if (success) {
      navigate('/', { replace: true })
    }
  }

  return (
    <>
      {/* ── Full-screen background with grid pattern ── */}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#07070d',
          backgroundImage: `
            linear-gradient(rgba(0, 255, 135, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 135, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          padding: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── Decorative neon orbs ── */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,135,0.06) 0%, transparent 70%)',
          top: '-100px',
          left: '-100px',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,0,144,0.06) 0%, transparent 70%)',
          bottom: '-80px',
          right: '-80px',
          pointerEvents: 'none',
        }} />

        {/* ── Login Card ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            width: '100%',
            maxWidth: '400px',
            background: '#0f0f1a',
            border: '1.5px solid #00ff8766',
            boxShadow: '0 0 30px #00ff8722, 0 0 60px #00ff8711, inset 0 0 30px rgba(0,255,135,0.02)',
            borderRadius: '2px',
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
          }}
        >
          {/* ── Corner decorations ── */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
            const isTop = corner.includes('top')
            const isLeft = corner.includes('left')
            return (
              <div
                key={corner}
                style={{
                  position: 'absolute',
                  width: '12px',
                  height: '12px',
                  [isTop ? 'top' : 'bottom']: '-1px',
                  [isLeft ? 'left' : 'right']: '-1px',
                  borderTop: isTop ? '2px solid #00ff87' : 'none',
                  borderBottom: !isTop ? '2px solid #00ff87' : 'none',
                  borderLeft: isLeft ? '2px solid #00ff87' : 'none',
                  borderRight: !isLeft ? '2px solid #00ff87' : 'none',
                }}
              />
            )
          })}

          {/* ── Brand logo ── */}
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '18px',
                color: '#00ff87',
                textShadow: '0 0 10px #00ff87, 0 0 20px #00ff8799, 0 0 40px #00ff8733',
                letterSpacing: '0.05em',
                lineHeight: 1.8,
                marginBottom: '4px',
              }}
            >
              ODIN
              <span style={{ color: '#ff0090', textShadow: '0 0 10px #ff0090, 0 0 20px #ff009099' }}>
                BOOK
              </span>
            </div>
            <div
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.65rem',
                color: '#6a6a8a',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              Social Media
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{ borderBottom: '1px solid #1e1e35', margin: '4px 0' }} />

          {/* ── Username ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.7rem',
                color: '#00ff87',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Username
            </label>
            <input
              type="text"
              style={{
                background: '#12121f',
                borderRadius: '2px',
              }}
              {...register('username', {
                required: 'Username is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
                maxLength: { value: 16, message: 'Maximum 16 characters' },
              })}
              aria-label="username"
            />
            {errors.username && (
              <span
                style={{
                  color: '#ff0090',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.68rem',
                  textShadow: '0 0 6px #ff009099',
                }}
              >
                ✗ {errors.username.message}
              </span>
            )}
          </div>

          {/* ── Password ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.7rem',
                color: '#00ff87',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Password
            </label>
            <input
              type="password"
              style={{
                background: '#12121f',
                borderRadius: '2px',
              }}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
                maxLength: { value: 16, message: 'Maximum 16 characters' },
              })}
              aria-label="password"
            />
            {errors.password && (
              <span
                style={{
                  color: '#ff0090',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.68rem',
                  textShadow: '0 0 6px #ff009099',
                }}
              >
                ✗ {errors.password.message}
              </span>
            )}
          </div>

          {/* ── Buttons ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            {/* Primary: Login */}
            <button
              type="submit"
              disabled={isSubmitting}
              aria-label="send"
              style={{
                padding: '10px 20px',
                fontSize: '0.85rem',
              }}
            >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Secondary: Guest */}
            <button
              disabled={loading}
              type="button"
              aria-label="send-guest"
              onClick={() => {
                setLoading(true)
                onSubmit({ username: 'guestUser', password: '12345678' })
              }}
              style={{
                border: '1.5px solid #1e1e35',
                color: '#6a6a8a',
                padding: '10px 20px',
                fontSize: '0.85rem',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = '#00d4ff66'
                el.style.color = '#00d4ff'
                el.style.background = 'rgba(0, 212, 255, 0.05)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = '#1e1e35'
                el.style.color = '#6a6a8a'
                el.style.background = 'transparent'
              }}
            >
              {loading ? 'Loading...' : 'Enter as Guest'}
            </button>
          </div>

          {/* ── Footer ── */}
          <footer
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '8px',
              paddingTop: '16px',
              borderTop: '1px solid #1e1e35',
            }}
          >
            <Link
              to="/Signup"
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.68rem',
                color: '#6a6a8a',
                letterSpacing: '0.1em',
                transition: 'color 0.2s',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#00ff87')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6a6a8a')}
            >
              Create account
            </Link>

            <Link
              to={`${apiUrl}/logins/auth/github`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <img
                src="/github.jpg"
                alt="GitHub login"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '2px',
                  border: '1px solid #1e1e35',
                  transition: 'border-color 0.2s',
                }}
              />
            </Link>
          </footer>
        </form>
      </div>
    </>
  )
}

export default Login
