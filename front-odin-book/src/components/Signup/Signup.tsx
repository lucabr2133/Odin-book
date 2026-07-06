import { Link } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import onHandleSubmitSign from '../../../services/onHandleSign';
import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export interface Inputs {
  username: string;
  password: string;
}

function Signup() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const userResponse = await onHandleSubmitSign(data, setError)
    if (userResponse) {
      toast.success('User Created successfully', {
        style: {
          background: '#0a0a12',
          border: '1px solid #00ff87',
          color: '#00ff87',
          fontFamily: "'Share Tech Mono', monospace",
          borderRadius: '2px',
        },
        iconTheme: {
          primary: '#00ff87',
          secondary: '#0a0a12',
        },
      })
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#07070d',
        color: '#e0e0f0',
        fontFamily: "'Rajdhani', monospace",
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Toaster position='bottom-right' />

      {/* Background decoration */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,135,0.015) 2px, rgba(0,255,135,0.015) 4px)', pointerEvents: 'none', zIndex: 0 }} />

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          background: '#0a0a12',
          border: '1.5px solid #1e1e35',
          borderRadius: '2px',
          padding: '40px 32px',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 0 40px rgba(0, 255, 135, 0.05)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h2
            style={{
              margin: '0 0 8px 0',
              fontFamily: "'Rajdhani', monospace",
              fontWeight: 700,
              fontSize: '2rem',
              color: '#e0e0f0',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Sign Up
          </h2>
          <div
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.65rem',
              color: '#6a6a8a',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Create an account
          </div>
        </div>

        {/* Username Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="username"
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
            id="username"
            aria-label="userinput"
            type="text"
            autoComplete="off"
            style={{
              padding: '12px 14px',
              background: '#07070d',
              border: '1px solid #1e1e35',
              borderRadius: '2px',
              color: '#00ff87',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#00ff87'
              e.currentTarget.style.boxShadow = '0 0 10px #00ff8733'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#1e1e35'
              e.currentTarget.style.boxShadow = 'none'
            }}
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
              maxLength: { value: 16, message: 'Maximum 16 characters' },
            })}
          />
          {errors.username && (
            <span style={{ color: '#ff0090', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace" }}>
              {errors.username.message}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="password"
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
            id="password"
            aria-label="passwordinput"
            type="password"
            style={{
              padding: '12px 14px',
              background: '#07070d',
              border: '1px solid #1e1e35',
              borderRadius: '2px',
              color: '#00ff87',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#00ff87'
              e.currentTarget.style.boxShadow = '0 0 10px #00ff8733'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#1e1e35'
              e.currentTarget.style.boxShadow = 'none'
            }}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
              maxLength: { value: 16, message: 'Maximum 16 characters' },
            })}
          />
          {errors.password && (
            <span style={{ color: '#ff0090', fontSize: '0.75rem', fontFamily: "'Share Tech Mono', monospace" }}>
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
          <button
            disabled={isSubmitting}
            type="submit"
            style={{
              padding: '14px',
              background: 'transparent',
              border: '1.5px solid #00ff87',
              color: '#00ff87',
              fontFamily: "'Rajdhani', monospace",
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              opacity: isSubmitting ? 0.6 : 1,
            }}
            onMouseEnter={e => {
              if (!isSubmitting) {
                e.currentTarget.style.background = '#00ff87'
                e.currentTarget.style.color = '#07070d'
                e.currentTarget.style.boxShadow = '0 0 15px #00ff8766'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#00ff87'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {isSubmitting ? 'Sending...' : 'Create account'}
          </button>
        </div>

        {/* Footer */}
        <footer
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '8px',
            paddingTop: '16px',
            borderTop: '1px solid #1e1e35',
          }}
        >
          <Link
            to="/"
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
            Already have an account? Login
          </Link>
        </footer>
      </form>
    </div>
  )
}

export default Signup
