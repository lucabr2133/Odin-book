import { useFollowing } from '../../hooks/useFollowing'
import CreatePublication from '../CreatePublication/CreatePublication'
import styles from './User.module.css'
import MainHeader from '../Header/Header'
import { UserSession } from '../../contex/context'
import React, { useContext, useState } from 'react'
import { SpinnerComponnet } from '../ui/spinner'
import { useSearchUser } from '../../hooks/useSearchUsers'
import { toggleFollow } from '../../../services/onHandleToggleFollow'
import { useFollow } from '../../contex/FollowContext'
import { Link } from 'react-router'

export function Users () {
  const contextUserSession = useContext(UserSession)
  if (!contextUserSession) {
    throw new Error('you must provide the correct value types')
  }
  const { user } = contextUserSession
  const { error, loading: followLoading } = useFollowing()
  const { state, followAction, unfollowAction, isFollowing } = useFollow()
  const [opendialog, setOpenDialog] = useState(false)
  const { input, loading, setInputValue, users } = useSearchUser()

  if (!users || !user || followLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', background: '#07070d' }}>
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: '#00ff87', letterSpacing: '0.2em', textShadow: '0 0 8px #00ff87' }}>LOADING...</span>
      <div style={{ width: '40px', height: '40px', border: '2px solid #1e1e35', borderTop: '2px solid #00ff87', borderRadius: '50%', animation: 'spin 0.8s linear infinite', boxShadow: '0 0 10px #00ff8766' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  return (
    <>
      <div className='lg:grid lg:grid-cols-[15%_85%] w-full' style={{ display: 'grid' }}>
        <MainHeader userActive={user} />

        <div
          className='col-start-1 lg:col-start-2 lg:col-end-3'
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#07070d',
            color: '#e0e0f0',
            fontFamily: "'Rajdhani', monospace",
            padding: '24px 32px',
            boxSizing: 'border-box',
          }}
        >
          {/* ── Search bar ── */}
          <div style={{ marginBottom: '24px', position: 'relative' }}>
            <span style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.8rem',
              color: '#00ff87',
              pointerEvents: 'none',
            }}>
              {'>'}
            </span>
            <input
              value={input}
              onChange={(e) => setInputValue(e.currentTarget.value)}
              type='text'
              placeholder="Search user..."
              style={{
                width: '100%',
                paddingLeft: '30px',
                background: '#0f0f1a',
                border: '1px solid #1e1e35',
                borderRadius: '2px',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.85rem',
                color: '#e0e0f0',
              }}
            />
          </div>

          {/* ── Section header ── */}
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '9px',
              color: '#00ff87',
              textShadow: '0 0 8px #00ff87',
              letterSpacing: '0.08em',
            }}>
              Users
            </span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #00ff8755, transparent)' }} />
          </div>

          {/* ── Loading indicator ── */}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '20px' }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#6a6a8a', letterSpacing: '0.15em' }}>SEARCHING...</span>
              <SpinnerComponnet />
            </div>
          )}

          {/* ── Users grid ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '16px',
              visibility: loading ? 'hidden' : 'visible',
            }}
          >
            {users.length !== 0
              ? users
                .filter((u) => u.username !== user.username)
                .map((userl) => {
                  const following = isFollowing(userl.id, user.id)
                  return (
                    <div
                      key={userl.id}
                      style={{
                        background: '#0f0f1a',
                        border: '1px solid #1e1e35',
                        borderRadius: '2px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#00ff8755'
                        e.currentTarget.style.boxShadow = '0 0 16px #00ff8718'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#1e1e35'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      {/* Avatar */}
                      <Link to={`/profile/${userl.username}`} style={{ background: 'transparent', flexShrink: 0, display: 'block' }}>
                        <img
                          src={userl.profileImg || 'profile2.svg'}
                          alt={`${userl.username} profile`}
                          width={56}
                          height={56}
                          style={{
                            borderRadius: '2px',
                            objectFit: 'cover',
                            border: '1.5px solid #1e1e35',
                            display: 'block',
                            transition: 'border-color 0.2s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = '#00ff87')}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e35')}
                        />
                      </Link>

                      {/* Info */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
                        <Link
                          to={`/profile/${userl.username}`}
                          style={{ background: 'transparent' }}
                        >
                          <h3 style={{
                            margin: 0,
                            fontFamily: "'Rajdhani', monospace",
                            fontWeight: 700,
                            color: '#e0e0f0',
                            fontSize: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            userSelect: 'none',
                          }}>
                            {userl.username}
                          </h3>
                        </Link>

                        <button
                          onClick={async (e) => {
                            e.stopPropagation()
                            toggleFollow(userl, user, state, unfollowAction, followAction)
                          }}
                          style={{
                            alignSelf: 'flex-start',
                            padding: '5px 14px',
                            fontSize: '0.7rem',
                            fontFamily: "'Share Tech Mono', monospace",
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            border: following ? '1px solid #ff009077' : '1px solid #00ff8777',
                            color: following ? '#ff0090' : '#00ff87',
                            background: 'transparent',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            margin: 0,
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = following ? '#ff0090' : '#00ff87'
                            e.currentTarget.style.color = '#07070d'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = following ? '#ff0090' : '#00ff87'
                          }}
                        >
                          {following ? 'Unfollow' : 'Follow'}
                        </button>
                      </div>
                    </div>
                  )
                })
              : (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: '#3a3a5a', letterSpacing: '0.15em' }}>
                  No users found
                </div>
              )}
          </div>
        </div>
      </div>

      <CreatePublication opendialog={opendialog} setOpenDialog={setOpenDialog} />
    </>
  )
}
