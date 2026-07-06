import { onHandleSubmitProfile } from '../../../services/onHandleSubmitProfile'
import React, { SetStateAction } from 'react'
import { User } from '../../types'
import toast, { Toaster } from 'react-hot-toast'

interface Props {
  setUserData: React.Dispatch<SetStateAction<User | null>>
  openDialgo: boolean | undefined
  setOpenDialog: React.Dispatch<SetStateAction<boolean>>
  user: User
  userParams: string
}

function DialogUpdateProfile({ setUserData, openDialgo, setOpenDialog, user, userParams }: Props) {
  if (!openDialgo) return null

  return (
    <>
      <Toaster containerStyle={{ zIndex: 10000 }} position='bottom-right' />

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: '100vw',
          backgroundColor: 'rgba(7, 7, 13, 0.88)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          padding: 20,
          boxSizing: 'border-box',
        }}
      >
        <dialog
          open={openDialgo}
          style={{
            position: 'relative',
            border: '1.5px solid #00ff87',
            borderRadius: '2px',
            backgroundColor: '#0a0a12',
            color: '#e0e0f0',
            padding: '32px 40px',
            maxWidth: 440,
            width: '100%',
            boxShadow: '0 0 40px rgba(0, 255, 135, 0.1)',
            fontFamily: "'Rajdhani', monospace",
            margin: 'auto',
            overflow: 'hidden',
          }}
        >
          {/* Scanline overlay */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,135,0.015) 2px, rgba(0,255,135,0.015) 4px)', pointerEvents: 'none' }} />

          <h2 style={{
            margin: '0 0 24px 0',
            fontFamily: "'Rajdhani', monospace",
            fontWeight: 700,
            fontSize: '1.6rem',
            color: '#00ff87',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textAlign: 'center',
            position: 'relative',
          }}>
            Update Profile
          </h2>

          <form
            encType="multipart/form-data"
            method="POST"
            onSubmit={async (e) => {
              e.preventDefault()
              const profile = await onHandleSubmitProfile(e, userParams)
              if (profile) {
                setOpenDialog(false)
                setUserData(profile.user)
                toast.success('Profile updated', {
                  style: {
                    background: '#0a0a12',
                    border: '1px solid #00ff87',
                    color: '#00ff87',
                    fontFamily: "'Share Tech Mono', monospace",
                    borderRadius: '2px',
                  },
                  iconTheme: { primary: '#00ff87', secondary: '#0a0a12' },
                })
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <label
                htmlFor="file"
                style={{
                  cursor: 'pointer',
                  width: 120,
                  height: 120,
                  overflow: 'hidden',
                  borderRadius: '2px',
                  border: '1.5px solid #00ff87',
                  boxShadow: '0 0 15px rgba(0, 255, 135, 0.2)',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 255, 135, 0.4)'
                  e.currentTarget.style.borderColor = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 255, 135, 0.2)'
                  e.currentTarget.style.borderColor = '#00ff87'
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.5)',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.7rem',
                  color: '#fff',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  UPLOAD
                </div>
                <img
                  src={user.profileImg ? user.profileImg : '/profile2.svg'}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </label>
              <input hidden type="file" id="file" name="profile" />
            </div>

            {[
              { id: 'name', label: 'Name' },
              { id: 'surname', label: 'Surname' },
              { id: 'description', label: 'Description' }
            ].map(({ id, label }) => (
              <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor={id}
                  style={{
                    fontFamily: "'Share Tech Mono', monospace",
                    fontSize: '0.7rem',
                    color: '#6a6a8a',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </label>
                <input
                  type="text"
                  id={id}
                  name={id}
                  style={{
                    padding: '10px 12px',
                    background: '#07070d',
                    border: '1px solid #1e1e35',
                    borderRadius: '2px',
                    color: '#e0e0f0',
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
                />
              </div>
            ))}

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <button
                type="button"
                onClick={() => setOpenDialog(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  border: '1.5px solid #1e1e35',
                  color: '#6a6a8a',
                  fontFamily: "'Rajdhani', monospace",
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ff009077'
                  e.currentTarget.style.color = '#ff0090'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#1e1e35'
                  e.currentTarget.style.color = '#6a6a8a'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  flex: 2,
                  padding: '12px',
                  background: 'transparent',
                  border: '1.5px solid #00ff87',
                  color: '#00ff87',
                  fontFamily: "'Rajdhani', monospace",
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#00ff87'
                  e.currentTarget.style.color = '#07070d'
                  e.currentTarget.style.boxShadow = '0 0 15px #00ff8766'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = '#00ff87'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </dialog>
      </div>
    </>
  )
}

export default DialogUpdateProfile
