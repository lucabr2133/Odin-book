import { Following, Publications, User } from '../../types'
import DialogUpdateProfile from './DialogUpdateProfile'
import React, { useState } from 'react'

interface Props {
  data: {
    userData: User
    userSession: User
    publications: Publications[]
    following: Following[]
  }
  actions: {
    setUserData: React.Dispatch<React.SetStateAction<User | null>>
  }
  styles: Record<string, string>
  usernameParam: string
}
const apiUrl = import.meta.env.VITE_API_URL

function Header ({ data, actions, usernameParam, styles }: Props) {
  const { userData, userSession, publications, following } = data
  const { setUserData } = actions
  const [openDialog, setOpenDialog] = useState(false)

  function onHandleLogout () {
    localStorage.removeItem('token')
    fetch(`${apiUrl}/logins/logout`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => { window.location.href = data.redirectUrl })
      .catch((error) => console.error('Error al cerrar sesión:', error))
  }

  const isOwner = userSession.id === userData.id
  const followersCount = following.filter((f) => f.follower_id === userData.id).length
  const followingCount = following.filter((f) => f.following_id === userData.id).length

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '24px 28px',
          gap: '28px',
          background: 'linear-gradient(135deg, #0a0a12 0%, #0f0f1a 100%)',
          border: '1px solid #1e1e35',
          borderRadius: '2px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          position: 'relative',
          overflow: 'hidden',
        }}
        className='flex-col md:flex-row'
      >
        {/* ── Corner brackets ── */}
        {['tl','tr','bl','br'].map(c => (
          <div key={c} style={{
            position: 'absolute',
            width: '14px', height: '14px',
            ...(c.includes('t') ? { top: 0 } : { bottom: 0 }),
            ...(c.includes('l') ? { left: 0 } : { right: 0 }),
            borderTop: c.includes('t') ? '2px solid #00ff87' : 'none',
            borderBottom: c.includes('b') ? '2px solid #00ff87' : 'none',
            borderLeft: c.includes('l') ? '2px solid #00ff87' : 'none',
            borderRight: c.includes('r') ? '2px solid #00ff87' : 'none',
          }} />
        ))}

        {/* ── Avatar ── */}
        <div style={{
          flexShrink: 0,
          width: '120px',
          height: '120px',
          overflow: 'hidden',
          border: '2px solid #00ff8777',
          boxShadow: '0 0 16px #00ff8733',
          borderRadius: '2px',
        }}>
          <img
            src={userData.profileImg || '/profile2.svg'}
            alt="Profile"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          {/* ── Username ── */}
          <h2 style={{
            margin: '0 0 12px',
            fontFamily: "'Rajdhani', monospace",
            fontWeight: 700,
            fontSize: '1.6rem',
            color: '#e0e0f0',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {usernameParam}
          </h2>

          {/* ── Stats ── */}
          <div style={{ display: 'flex', gap: '24px', marginBottom: '18px' }}>
            {[
              { value: publications.length, label: 'Posts' },
              { value: followersCount, label: 'Followers' },
              { value: followingCount, label: 'Following' },
            ].map(({ value, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '1.2rem',
                  color: '#00ff87',
                  textShadow: '0 0 8px #00ff8799',
                  fontWeight: 700,
                }}>
                  {value}
                </div>
                <div style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.6rem',
                  color: '#6a6a8a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Owner buttons ── */}
          {isOwner && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setOpenDialog(true)}
                style={{ padding: '8px 18px', fontSize: '0.78rem' }}
              >
                Edit Profile
              </button>
              <button
                onClick={onHandleLogout}
                style={{
                  padding: '8px 18px',
                  fontSize: '0.78rem',
                  border: '1.5px solid #ff009077',
                  color: '#ff0090',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ff0090'
                  e.currentTarget.style.color = '#07070d'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#ff0090'
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <DialogUpdateProfile
        user={userData}
        userParams={usernameParam}
        setUserData={setUserData}
        openDialgo={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  )
}

export default Header
