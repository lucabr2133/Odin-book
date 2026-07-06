import React, {   useRef, useState } from 'react'
import CommentList from './CommentList'
import { Publications, User } from '../../types'
import onHandleDeletedLike from '../../../services/onHandleDeletedLike'
import onHandleLikePublication from '../../../services/onHandleLikePublication'
import usePublicationLikes from '../../hooks/usePublicationLikes'
import { X, Heart, MessageCircle } from 'lucide-react'
interface Props {
  styles: Record<string, string>
  data: {
    users: User[]
    publication: Publications,
    publications:Publications[]
    userData: User
    userSession: User
    openedId: string | null
  },
  actions: {
    deleteAction:(publicationId:string)=>void
    setUpdateForm: React.Dispatch<React.SetStateAction<string | null>>
    setOpenedId: React.Dispatch<React.SetStateAction<string | null>>
    setPublications: React.Dispatch<React.SetStateAction<Publications[] | null>>
  }
}
const apiUrl = import.meta.env.VITE_API_URL;

function PublicationList({ styles, data, actions }: Props) {
  const {  users, publication, userSession, userData,publications } = data
  const {  setUpdateForm, deleteAction,setPublications} = actions
const [isOpen,setOpenId]=useState<null|string>(null)
  const isOwner = userSession?.id === userData?.id
  const panelRef = useRef<HTMLDivElement>(null)
  const {addLike,deleteLike,state}=usePublicationLikes()


  async function deletePublication(publicationId: string) {
    try {
      await fetch(`${apiUrl}/publications/publications/${publicationId}`, {
        method: 'delete',
        credentials: 'include',
      })
      const newPublications=publications.filter((publication)=>publication.id!==publicationId)
      setPublications(newPublications)
    } catch (error) {
      console.error('Error eliminando publicación:', error)
    }
  }
async function onHandleClickLike(e:React.MouseEvent<HTMLImageElement,MouseEvent>){
  const checked = state.likes.filter(like => like.post_id === publication.id && like.user_id === userSession.id)
                if (checked.length > 0) {
                  deleteLike(checked[0])
                  onHandleDeletedLike(checked[0].id)
                } else {
                  const like = await onHandleLikePublication(e, publication.id, userSession.id)
                  addLike(like)
                }

}
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        background: '#0f0f1a',
        border: '1.5px solid #1e1e35',
        borderRadius: '2px',
        padding: '20px',
        marginBottom: '16px',
        gap: '24px',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        overflow: 'visible',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#00ff8755'
        e.currentTarget.style.boxShadow = '0 0 20px #00ff8718'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#1e1e35'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ width: '50%', minWidth: '280px' }}>
        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '14px', gap: '10px' }}>
          <img
            style={{ width: '44px', height: '44px', borderRadius: '2px', objectFit: 'cover', border: '1.5px solid #1e1e35', flexShrink: 0 }}
            src={userData?.profileImg || '/profile2.svg'}
            alt={userData?.username || 'user'}
          />
          <span style={{ fontFamily: "'Rajdhani', monospace", fontWeight: 700, fontSize: '0.95rem', color: '#e0e0f0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {userData?.username}
          </span>
        </div>

        {/* Image */}
        {publication?.image_url && (
          <div style={{ position: 'relative', overflow: 'hidden', marginBottom: '14px' }}>
            <img
              style={{ width: '100%', display: 'block', objectFit: 'cover', borderRadius: '2px' }}
              src={publication.image_url}
              alt="publication"
            />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)', pointerEvents: 'none' }} />
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={(e) => onHandleClickLike(e as any)}
              aria-label="like"
              style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', margin: 0, transition: 'transform 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Heart
                size={22}
                style={{
                  fill: state.likes.some(l => l.post_id === publication.id && l.user_id === userSession.id) ? '#ff0090' : 'none',
                  color: state.likes.some(l => l.post_id === publication.id && l.user_id === userSession.id) ? '#ff0090' : '#6a6a8a',
                  filter: state.likes.some(l => l.post_id === publication.id && l.user_id === userSession.id) ? 'drop-shadow(0 0 4px #ff0090)' : 'none',
                  transition: 'all 0.2s',
                }}
              />
            </button>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', color: '#6a6a8a', minWidth: '20px' }}>
              {state.likes.filter((n) => n.post_id === publication.id).length}
            </span>
            <button
              onClick={() => setOpenId(isOpen ? null : publication.id)}
              aria-label="comment"
              style={{ background: 'transparent', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', margin: 0, transition: 'transform 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <MessageCircle size={22} style={{ color: '#6a6a8a', transition: 'color 0.2s' }} />
            </button>
          </div>

          <p style={{ fontFamily: "'Rajdhani', monospace", fontSize: '0.9rem', color: '#a0a0c0', lineHeight: 1.5, userSelect: 'text' }}>
            {publication.content}
          </p>

          {isOwner && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={() => deletePublication(publication.id)}
                style={{ padding: '6px 14px', fontSize: '0.72rem', border: '1.5px solid #ff009077', color: '#ff0090', background: 'transparent', borderRadius: '2px' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ff0090'; e.currentTarget.style.color = '#07070d' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ff0090' }}
              >
                Delete
              </button>
              <button
                onClick={() => setUpdateForm(publication.id)}
                style={{ padding: '6px 14px', fontSize: '0.72rem', border: '1.5px solid #1e1e35', color: '#6a6a8a', background: 'transparent', borderRadius: '2px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#00ff8766'; e.currentTarget.style.color = '#00ff87' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e35'; e.currentTarget.style.color = '#6a6a8a' }}
              >
                Update
              </button>
            </div>
          )}
        </div>
      </div>
     

      {/* Desktop modal */}
      {isOpen && (
        <div
          className='fixed hidden lg:flex justify-center items-center left-0 top-0 z-50 w-screen h-screen'
          style={{ background: 'rgba(7,7,13,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={() => setOpenId(null)}
        >
          <div
            style={{ display: 'flex', background: '#0f0f1a', border: '1.5px solid #00ff8766', boxShadow: '0 0 40px #00ff8722', borderRadius: '2px', overflow: 'hidden', width: '75%', height: 'calc(100vh - 80px)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ flex: 1, background: '#07070d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={publication.image_url} alt="" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #1e1e35', background: '#0f0f1a' }}>
              <CommentList publication={publication} styles={styles} user={userData} users={users} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      <div
        className='md:hidden w-full fixed left-0 top-0 overflow-hidden transition-all duration-500 ease-in-out z-50'
        style={{ background: 'rgba(7,7,13,0.97)', backdropFilter: 'blur(8px)', height: isOpen ? '100%' : '0' }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
          <X onClick={() => setOpenId(null)} style={{ cursor: 'pointer', color: '#6a6a8a' }} />
        </div>
        <CommentList publication={publication} styles={styles} user={userData} users={users} />
      </div>
    </div>
  )
}

export default PublicationList
