import React, { useEffect, useMemo, useRef } from 'react'
import CommentList from './CommentList'
import { Likes, Publications, User } from '../../types'
import { myAction } from '../../Reducers/PublicationReducer'
import onHandleDeletedLike from '../../../services/onHandleDeletedLike'
import onHandleLikePublication from '../../../services/onHandleLikePublication'
import usePublicationLikes from '../../hooks/usePublicationLikes'
import { user } from '@heroui/react'
interface Props {
  styles: Record<string, string>
  data: {
    users: User[]
    publication: Publications
    userData: User
    userSession: User
    openedId: string | null
  }
  actions: {
    dispatch: React.Dispatch<myAction>
    setUpdateForm: React.Dispatch<React.SetStateAction<string | null>>
    setOpenedId: React.Dispatch<React.SetStateAction<string | null>>
  }
}
const apiUrl = import.meta.env.VITE_API_URL;

function PublicationList({ styles, data, actions }: Props) {
  const { openedId, users, publication, userSession, userData } = data
  const { setOpenedId, setUpdateForm, dispatch } = actions

  const isOwner = userSession?.id === userData?.id
  const isOpen = openedId === publication.id
  const panelRef = useRef<HTMLDivElement>(null)
  const {addLike,deleteLike,state}=usePublicationLikes()
const likePublication = useMemo(() => {
  return state.likes.filter((like:Likes) => like.id === publication.id);
}, [state.likes, publication.id]);

  async function deletePublication(publicationId: string) {
    dispatch({ type: 'delete', publicationId })
    try {
      await fetch(`${apiUrl}publications/publications/${publicationId}`, {
        method: 'delete',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Error eliminando publicación:', error)
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'rgb(36,36,39)',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        color: '#fff',
        overflow: 'visible',
        display:'flex'
      }}
    >
      <div>
 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <img
          style={{ width: '60px', height: '60px', marginRight: '10px', borderRadius: '50%' }}
          src={userData?.profileImg || '/profile2.svg'}
          alt={userData?.username || 'user'}
        />
        <h2>{userData?.username}</h2>
      </div>

      {/* Imagen de publicación */}
      {publication?.image_url && (
        <img
          style={{
            margin: '15px 0',
            borderRadius: '8px',
            maxWidth: '100%',
            display: 'block',
          }}
          src={publication.image_url}
          alt="publication"
        />
      )}

      {/* Controles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
        onClick={async(e)=>{
          const checked= likePublication.filter((like:Likes)=>like.user_id===userSession.id)
          if(checked.length>0){
            deleteLike(checked[0])
            onHandleDeletedLike(checked[0].id)
          }else{
            console.log('a');
            
            const like=await onHandleLikePublication(e,publication.id,userSession.id)
            addLike(like)
          }
        }}
          aria-label="likeimg"
          src={false ? '/likeActive.svg' : '/offlike.svg'}
          width="30px"
          style={{ cursor: 'pointer' }}
          alt="like"
        />
        {likePublication.length}
        <img
          onClick={() => setOpenedId(isOpen ? null : publication.id)}
          src="/comment1.svg"
          width="30px"
          style={{ cursor: 'pointer' }}
          alt="comment"
        />
        <div className={styles.description}>{publication.content}</div>
        {isOwner && (
          <>
     \          
            <button onClick={() => deletePublication(publication.id)}>Delete</button>
            <button onClick={() => setUpdateForm(publication.id)}>Update</button>
          </>
        )}
      </div>
      </div>
      {/* Encabezado usuario */}
     

      {/* Comentarios expandibles */}
      <div
        ref={panelRef}
        style={{
          maxWidth: isOpen ? '800px' : '500px',
          overflow: 'hidden',
        
          transition: 'max-width 1s ease',
        }}
      >
        {isOpen && (
          <div style={{ paddingTop: '15px' }}>
            <h3 style={{ marginBottom: '10px' }}>Comentarios</h3>
            <CommentList 
              publication={publication}
              styles={styles}
              user={userData}
              users={users}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicationList
