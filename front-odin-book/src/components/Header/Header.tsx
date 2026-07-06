import { Link } from 'react-router'
import React, { useState } from 'react'
import { User } from '../../types'
import CreatePublication from '../CreatePublication/CreatePublication'
import { Bell, User as Useri, Users, X, Home, MessageSquare, PlusCircle } from 'lucide-react'
import { useNotification } from '../../hooks/useNotifications'
import { onHandleReadNotification } from '../../../services/onHandleReadNotification'

interface props {
  userActive: User,
}

function MainHeader ({ userActive }: props) {
  const [opendialog2, setOpenDialog2] = useState(false)
  const [openNotifications, setOpenNotifications] = useState(false)
  const { notifications } = useNotification(userActive.id)

  const unreadCount = notifications?.filter((n) => !n.read).length || 0

  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    ...(userActive
      ? [{ to: `/profile/${userActive.username}`, icon: <Useri size={20} />, label: 'Profile' }]
      : []),
    { to: '/users', icon: <Users size={20} />, label: 'Users' },
  ]

  return (
    <>
      {/* ── Sidebar ── */}
      <header
        className='z-10 fixed'
        style={{ margin: '10px 0' }}
      >
        <ul
          className='
            lg:w-[15%] flex flex-row lg:flex-col
            bottom-0 fixed justify-around
            lg:top-0 lg:justify-start
            w-full
            gap-1
          '
          style={{
            background: '#0a0a12',
            borderRight: '1px solid #1e1e35',
            borderTop: '1px solid #1e1e35',
            padding: '12px 8px',
            height: '100vh',
          }}
        >
          {/* ── Logo / Brand ── */}
          <li className='hidden lg:flex items-center justify-center mb-6' style={{ minHeight: 'auto' }}>
            <span
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '10px',
                color: '#00ff87',
                textShadow: '0 0 7px #00ff87, 0 0 14px #00ff8799',
                letterSpacing: '0.05em',
                lineHeight: '1.6',
                textAlign: 'center',
              }}
            >
              ODIN<br />
              <span style={{ color: '#ff0090', textShadow: '0 0 7px #ff0090, 0 0 14px #ff009099' }}>
                BOOK
              </span>
            </span>
          </li>

          {/* ── Nav Items ── */}
          {navItems.map(({ to, icon, label }) => (
            <li key={to} style={{ minHeight: '48px', display: 'flex', alignItems: 'center', width: '100%', margin: '2px 0' }}>
              <Link
                to={to}
                className='
                  arcade-nav-item
                  flex gap-3 items-center
                  w-full p-3
                  text-sm font-semibold
                '
                style={{
                  color: '#a0a0c0',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem',
                }}
              >
                <span style={{ flexShrink: 0 }}>{icon}</span>
                <h2 className='hidden lg:block'>{label}</h2>
              </Link>
            </li>
          ))}

          {/* ── Notifications ── */}
          <li style={{ minHeight: '48px', display: 'flex', alignItems: 'center', width: '100%', margin: '2px 0' }}>
            <div
              onClick={() => setOpenNotifications(true)}
              className='arcade-nav-item flex gap-3 items-center w-full p-3 cursor-pointer justify-center'
              style={{
                color: '#a0a0c0',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
              }}
            >
              <span style={{ flexShrink: 0 }}>
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      background: '#ff0090',
                      color: '#07070d',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      fontSize: '9px',
                      fontFamily: "'Press Start 2P', monospace",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 6px #ff009099',
                      animation: 'neon-pulse 1.5s ease-in-out infinite',
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </span>
              <h2 className='hidden lg:block'>Notifications</h2>
            </div>
          </li>

          {/* ── Create Post ── */}
          <li
            style={{ minHeight: '48px', display: 'flex', alignItems: 'center', width: '100%', margin: '2px 0', marginTop: 'auto' }}
          >
            <div
              onClick={() => setOpenDialog2(true)}
              className='flex gap-3 items-center w-full p-3 cursor-pointer'
              style={{
                border: '1.5px solid #00ff87',
                borderRadius: '2px',
                color: '#00ff87',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                fontWeight: 700,
                transition: 'all 0.15s ease',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background = '#00ff87'
                el.style.color = '#07070d'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.background = 'transparent'
                el.style.color = '#00ff87'
              }}
            >
              <PlusCircle size={20} style={{ flexShrink: 0 }} />
              <h2 className='hidden lg:block'>Create</h2>
            </div>
          </li>
        </ul>
      </header>

      <CreatePublication opendialog={opendialog2} setOpenDialog={setOpenDialog2} />

      {/* ── Notifications Modal ── */}
      {openNotifications && (
        <div
          onClick={() => {
            setOpenNotifications(false)
            onHandleReadNotification(userActive.id)
          }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            background: 'rgba(7, 7, 13, 0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#0f0f1a',
              border: '1.5px solid #00ff8766',
              boxShadow: '0 0 30px #00ff8722, 0 0 60px #00ff8711',
              borderRadius: '2px',
              width: '100%',
              maxWidth: '420px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                borderBottom: '1px solid #1e1e35',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(90deg, #0a0a12 0%, #0f0f1a 100%)',
              }}
            >
              <span
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '9px',
                  color: '#00ff87',
                  textShadow: '0 0 7px #00ff87',
                  letterSpacing: '0.1em',
                }}
              >
                NOTIFICATIONS
              </span>
              <X
                size={18}
                className='cursor-pointer'
                style={{ color: '#6a6a8a', transition: 'color 0.2s' }}
                onClick={() => {
                  setOpenNotifications(false)
                  onHandleReadNotification(userActive.id)
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ff0090')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6a6a8a')}
              />
            </div>

            {/* List */}
            <div style={{ overflowY: 'auto', padding: '8px' }}>
              {notifications && notifications.length > 0
                ? notifications.map((notification) => {
                    const diffMinutes = Math.floor((Date.now() - new Date(notification.createdAt).getTime()) / 60000)
                    return (
                      <div
                        key={notification.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          margin: '6px 0',
                          background: '#12121f',
                          border: `1px solid ${notification.read ? '#1e1e35' : '#00ff8744'}`,
                          borderRadius: '2px',
                          transition: 'border-color 0.2s',
                        }}
                      >
                        <img
                          src={notification.actor.profileImg || '/profile2.svg'}
                          alt={notification.actor.username}
                          style={{ width: '36px', height: '36px', borderRadius: '2px', objectFit: 'cover', border: '1px solid #1e1e35' }}
                        />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.82rem', color: '#e0e0f0', lineHeight: 1.4 }}>
                            <span style={{ color: '#00ff87', fontWeight: 700 }}>
                              {notification.actor.username}
                            </span>{' '}
                            empezó a seguirte
                          </p>
                          <span style={{ fontSize: '0.7rem', color: '#6a6a8a', fontFamily: "'Share Tech Mono', monospace" }}>
                            {diffMinutes} min ago
                          </span>
                        </div>
                        {!notification.read && (
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#00ff87',
                              boxShadow: '0 0 6px #00ff87',
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </div>
                    )
                  })
                : (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6a6a8a', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem' }}>
                    NO NEW NOTIFICATIONS
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MainHeader
