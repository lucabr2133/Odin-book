import PublicationOpen from './PublicationOpen'
import { Link } from 'react-router'
import React, { useState } from 'react'
import { Likes, Publications, User } from '../../types'
import usePublicationLikes from '../../hooks/usePublicationLikes'
import { X, Heart, MessageCircle } from 'lucide-react'
import CommentList from '../Profile/CommentList'

interface actions {
  onHandleLikePublication: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, publicationId: string, userId: string) => Promise<Likes>
  onHandleDeletedLike: (id: string) => Promise<Likes>
}
interface data {
  publication: Publications,
  user: User,
  users: User[]
}
type props = {
  data: data,
  actions: actions,
  styles: Record<string, string>
}

function PublicationHome ({ styles, actions, data }: props) {
  const [open, setOpen] = useState('')
  const { publication, user, users } = data
  const { addLike, deleteLike, state } = usePublicationLikes()
  const { onHandleLikePublication, onHandleDeletedLike } = actions

  const isOpen = open === publication.id
  const isLiked = state.likes.some(like => like.post_id === publication.id && like.user_id === user.id)
  const likeCount = state.likes.filter((n) => n.post_id === publication.id).length

  async function onHandleClickLike (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const checked = state.likes.filter(like => like.post_id === publication.id && like.user_id === user.id)
    if (checked.length > 0) {
      deleteLike(checked[0])
      onHandleDeletedLike(checked[0].id)
    } else {
      const like = await onHandleLikePublication(e, publication.id, user.id)
      addLike(like)
    }
  }

  return (
    <div
      key={publication.id}
      style={{
        width: '100%',
        maxWidth: '520px',
        margin: '0 0 20px 0',
        background: '#0f0f1a',
        border: '1.5px solid #1e1e35',
        borderRadius: '2px',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.borderColor = '#00ff8755'
        el.style.boxShadow = '0 0 20px #00ff8718'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.borderColor = '#1e1e35'
        el.style.boxShadow = 'none'
      }}
    >
      {/* ── Author header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          gap: '12px',
          borderBottom: '1px solid #1e1e35',
          background: 'linear-gradient(90deg, #0a0a12 0%, #0f0f1a 100%)',
        }}
      >
        <Link
          to={`/profile/${publication.author?.username}`}
          style={{
            display: 'block',
            width: '36px',
            height: '36px',
            borderRadius: '2px',
            overflow: 'hidden',
            border: '1.5px solid #1e1e35',
            flexShrink: 0,
            transition: 'border-color 0.2s',
            background: 'transparent',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#00ff87')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e35')}
        >
          <img
            className='w-full h-full object-cover'
            src={publication.author?.profileImg || 'profile2.svg'}
            alt={publication.author?.username}
          />
        </Link>
        <span
          style={{
            fontFamily: "'Rajdhani', monospace",
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#e0e0f0',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {publication.author?.username}
        </span>
      </div>

      {/* ── Image ── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          style={{
            height: '55vh',
            width: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          src={publication.image_url}
          alt=""
        />
        {/* Subtle scanline overlay on image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Actions + Content ── */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Like button */}
          <button
            onClick={(e) => onHandleClickLike(e)}
            aria-label="like"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              padding: '4px',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
              margin: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Heart
              size={22}
              style={{
                fill: isLiked ? '#ff0090' : 'none',
                color: isLiked ? '#ff0090' : '#6a6a8a',
                filter: isLiked ? 'drop-shadow(0 0 4px #ff0090)' : 'none',
                transition: 'all 0.2s ease',
              }}
            />
          </button>
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.8rem',
              color: isLiked ? '#ff0090' : '#6a6a8a',
              minWidth: '20px',
            }}
          >
            {likeCount}
          </span>

          {/* Comment button */}
          <button
            onClick={() => setOpen(isOpen ? '' : publication.id)}
            aria-label="comment"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              padding: '4px',
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
              margin: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <MessageCircle
              size={22}
              style={{
                color: '#6a6a8a',
                transition: 'color 0.2s',
              }}
            />
          </button>
        </div>

        {/* Caption */}
        <p
          style={{
            fontFamily: "'Rajdhani', monospace",
            fontSize: '0.9rem',
            color: '#a0a0c0',
            fontWeight: 400,
            lineHeight: 1.5,
            userSelect: 'text',
          }}
        >
          {publication.content}
        </p>
      </div>

      {/* ── Mobile comments drawer ── */}
      <div
        className={`lg:hidden`}
        style={{
          background: 'rgba(7,7,13,0.97)',
          backdropFilter: 'blur(8px)',
          width: '100%',
          position: 'fixed',
          top: 0,
          right: 0,
          overflow: 'hidden',
          transition: 'height 0.4s cubic-bezier(0.4,0,0.2,1)',
          zIndex: 50,
          height: isOpen ? '100%' : '0',
          border: isOpen ? '1px solid #00ff8766' : 'none',
        }}
      >
        {isOpen && (
          <div className="p-4 h-full" style={{ color: '#e0e0f0' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: '12px',
                borderBottom: '1px solid #1e1e35',
                marginBottom: '16px',
              }}
            >
              <h2
                style={{
                  flex: 1,
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.75rem',
                  color: '#00ff87',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}
              >
                {'>'} Comments
              </h2>
              <button
                onClick={() => setOpen('')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '4px',
                  color: '#6a6a8a',
                  cursor: 'pointer',
                  margin: 0,
                }}
              >
                <X size={20} />
              </button>
            </div>
            {isOpen && <PublicationOpen publication={publication} setOpen={setOpen} user={user} users={users} styles={styles} />}
          </div>
        )}
      </div>

      {/* ── Desktop comments modal ── */}
      {isOpen && (
        <div
          className='fixed hidden lg:flex justify-center items-center left-0 top-0 z-50 w-screen h-screen'
          style={{ background: 'rgba(7,7,13,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={() => setOpen('')}
        >
          <div
            style={{
              display: 'flex',
              background: '#0f0f1a',
              border: '1.5px solid #00ff8766',
              boxShadow: '0 0 40px #00ff8722',
              borderRadius: '2px',
              overflow: 'hidden',
              width: '75%',
              height: 'calc(100vh - 80px)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ flex: 1, background: '#07070d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={publication.image_url}
                alt=""
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid #1e1e35',
                background: '#0f0f1a',
              }}
            >
              <CommentList publication={publication} styles={styles} user={user} users={users} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicationHome
