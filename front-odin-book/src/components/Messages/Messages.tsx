import { useContext, useEffect, useState } from 'react'
import useMessages from '../../hooks/useMessages.js'
import CreatePublication from '../CreatePublication/CreatePublication.jsx'
import onHandleMessageSubmit from '../../../services/onHandleMessageSubmit.js'
import { UserContext, UserSession } from '../../contex/context.js'
import MainHeader from '../Header/Header.jsx'
import React from 'react'
import { Messages as messages, User } from '../../types.js'
import { socket } from '../../socket.js'

function Messages () {
  const contex = useContext(UserSession)
  if (!contex) throw new Error('you must put a valid provider')
  const { user } = contex

  const users = useContext(UserContext)
  const { messages: hookMessage, setMessages } = useMessages()
  const [receptorUser, setReceptorUser] = useState<User | null>(null)
  const [opendialog, setOpenDialog] = useState(false)

  useEffect(() => {
    if (user?.id) {
      socket.emit('joinRoom', user.id)
      const handleMessage = (message: messages) => {
        setMessages((prev) => {
          if (!prev) return []
          return [...prev, message]
        })
      }
      socket.on('chat message', handleMessage)
      return () => {
        socket.off('chat message', handleMessage)
      }
    }
  }, [user?.id, setMessages])

  if (!user || !users || !hookMessage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', background: '#07070d' }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: '#00ff87', letterSpacing: '0.2em', textShadow: '0 0 8px #00ff87' }}>LOADING...</span>
        <div style={{ width: '40px', height: '40px', border: '2px solid #1e1e35', borderTop: '2px solid #00ff87', borderRadius: '50%', animation: 'spin 0.8s linear infinite', boxShadow: '0 0 10px #00ff8766' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <>
      <div className='lg:grid lg:grid-cols-[15%_80%] flex'>
        <div
          className='w-full'
          style={{
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: '#07070d',
            color: '#e0e0f0',
            fontFamily: "'Rajdhani', monospace",
            gridColumn: '2/3',
          }}
        >
          {/* ── Users strip ── */}
          <header
            style={{
              backgroundColor: '#0a0a12',
              padding: '10px 16px',
              display: 'flex',
              overflowX: 'auto',
              gap: '10px',
              borderBottom: '1px solid #1e1e35',
              alignItems: 'center',
            }}
            aria-label="Lista de usuarios"
          >
            {/* Label */}
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#3a3a5a', textTransform: 'uppercase', letterSpacing: '0.15em', flexShrink: 0 }}>
              Users
            </span>

            {users
              .filter((u) => u.id !== user.id)
              .map((user1) => {
                const isActive = receptorUser?.id === user1.id
                return (
                  <div
                    key={user1.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setReceptorUser(user1)}
                    onKeyDown={(e) => e.key === 'Enter' && setReceptorUser(user1)}
                    style={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      minWidth: '64px',
                      padding: '6px 8px',
                      borderRadius: '2px',
                      border: `1px solid ${isActive ? '#00ff8777' : '#1e1e35'}`,
                      background: isActive ? 'rgba(0,255,135,0.08)' : 'transparent',
                      boxShadow: isActive ? '0 0 10px #00ff8733' : 'none',
                      transition: 'all 0.2s ease',
                      userSelect: 'none',
                    }}
                  >
                    <img
                      width={40}
                      height={40}
                      src={user1.profileImg || 'profile2.svg'}
                      alt={`${user1.username} profile`}
                      style={{
                        borderRadius: '2px',
                        border: `1.5px solid ${isActive ? '#00ff87' : '#1e1e35'}`,
                        marginBottom: '4px',
                        objectFit: 'cover',
                        display: 'block',
                        margin: '0 auto 4px',
                      }}
                    />
                    <p style={{
                      fontSize: '0.65rem',
                      fontFamily: "'Share Tech Mono', monospace",
                      color: isActive ? '#00ff87' : '#6a6a8a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      margin: 0,
                      maxWidth: '56px',
                      textShadow: isActive ? '0 0 6px #00ff8799' : 'none',
                    }}>
                      {user1.username}
                    </p>
                  </div>
                )
              })}
          </header>

          {/* ── Chat area ── */}
          <main
            style={{
              flex: 1,
              display: 'flex',
              backgroundColor: '#07070d',
              padding: '16px',
              gap: '16px',
              overflow: 'hidden',
            }}
          >
            {receptorUser ? (
              <section
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#0f0f1a',
                  border: '1px solid #1e1e35',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  boxShadow: '0 0 20px #00ff8711',
                }}
                aria-label={`Chat con ${receptorUser.username}`}
              >
                {/* Chat header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 18px',
                  backgroundColor: '#0a0a12',
                  borderBottom: '1px solid #1e1e35',
                  gap: '12px',
                }}>
                  <img
                    src={receptorUser.profileImg || 'profile2.svg'}
                    width={44}
                    height={44}
                    alt={`${receptorUser.username} profile`}
                    style={{ borderRadius: '2px', objectFit: 'cover', border: '1.5px solid #00ff8777' }}
                  />
                  <div>
                    <span style={{ fontFamily: "'Rajdhani', monospace", fontWeight: 700, fontSize: '1rem', color: '#e0e0f0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {receptorUser.username}
                  </span>
                  <p style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.6rem', color: '#00ff87', margin: 0, textShadow: '0 0 6px #00ff8799' }}>
                    Active
                  </p>
                  </div>
                </div>

                {/* Messages list */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,135,0.008) 2px, rgba(0,255,135,0.008) 4px)',
                }}>
                  {hookMessage
                    .filter(
                      (message) =>
                        (message.sender_id === user.id && message.receptor_id === receptorUser.id) ||
                        (message.sender_id === receptorUser.id && message.receptor_id === user.id)
                    )
                    .map((message) => {
                      const isMine = message.sender_id === user.id
                      return (
                        <div
                          key={message.id}
                          style={{
                            alignSelf: isMine ? 'flex-end' : 'flex-start',
                            backgroundColor: isMine ? 'rgba(0,255,135,0.12)' : '#12121f',
                            color: isMine ? '#00ff87' : '#c0c0d8',
                            border: `1px solid ${isMine ? '#00ff8744' : '#1e1e35'}`,
                            padding: '10px 14px',
                            borderRadius: '2px',
                            maxWidth: '70%',
                            fontFamily: "'Rajdhani', monospace",
                            fontSize: '0.9rem',
                            wordBreak: 'break-word',
                            boxShadow: isMine ? '0 0 8px #00ff8722' : 'none',
                          }}
                        >
                          {message.content}
                        </div>
                      )
                    })}
                </div>

                {/* Input form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    onHandleMessageSubmit(e, user, receptorUser)
                    e.currentTarget.reset()
                  }}
                  method="POST"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderTop: '1px solid #1e1e35',
                    backgroundColor: '#0a0a12',
                    gap: '10px',
                  }}
                  aria-label="Enviar mensaje"
                >
                  <input
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Write a message..."
                    required
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      background: '#12121f',
                      border: '1px solid #1e1e35',
                      borderRadius: '2px',
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '0.85rem',
                      color: '#e0e0f0',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = '#00ff87'
                      e.currentTarget.style.boxShadow = '0 0 8px #00ff8766'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = '#1e1e35'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="submit"
                    role='grid'
                    style={{ padding: '10px 20px', fontSize: '0.78rem' }}
                  >
                    SEND
                  </button>
                </form>
              </section>
            ) : <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: '#3a3a5a', letterSpacing: '0.1em', textAlign: 'center' }}>
                    Select a user to start chatting
                  </span>
              </div>
}
          </main>
        </div>

        <MainHeader userActive={user} />
      </div>

      <CreatePublication opendialog={opendialog} setOpenDialog={setOpenDialog} />
    </>
  )
}

export { Messages }
