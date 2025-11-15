import PublicationOpen from './PublicationOpen'
import { Link } from 'react-router'
import React, { useEffect, useReducer, useState } from 'react'
import { Likes, Publications, User } from '../../types'
import useLikesPublication from '../../hooks/useLikes'
import usePublicationLikes ,{myAction,myState}from '../../hooks/usePublicationLikes'
interface actions {
  onHandleLikePublication:(e:React.MouseEvent<HTMLImageElement>,publicationId:string,userId:string)=>Promise<Likes>
  onHandleDeletedLike:(id:string)=>Promise<Likes>

}
interface data{
  publication:Publications,
  userFind:User[],
  user:User,
  users:User[]
}
type props={
  data:data,
  actions:actions,
  styles:Record<string,string>
}


function PublicationHome({ styles, actions, data }: props) {
  const [open, setOpen] = useState('')
  const { publication, userFind, user, users } = data

  const {addLike,deleteLike,state}=usePublicationLikes()
  const { onHandleLikePublication, onHandleDeletedLike } = actions
   
  const isOpen = open === publication.id
async function onHandleClickLike(e:React.MouseEvent<HTMLImageElement,MouseEvent>){
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
    <div className={styles['publication-container']} key={publication.id}>
      <div >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link style={{ width: '100px', marginRight: '10px' }} to={`/${userFind[0]?.username}`}>
            <img style={{ width: '100px', marginRight: '10px' }} src={userFind[0]?.profileImg} alt="" />
          </Link>
         <h1>{userFind[0]?.username}</h1> 
        </div>

        <img width='450px' src={publication.image_url} alt="" />
        <div className={styles['publication-content']}>
          <div className={styles.icons}>
            <img
              aria-label="likeimg"
              onClick={(e)=>{onHandleClickLike(e)}}
              src={state.likes.some(like => like.post_id === publication.id && like.user_id === user.id) ? '/likeActive.svg' : '/offlike.svg'}
              width="50px"
              alt=""
            />
            <h4 className={styles.numlikes}>{state.likes.filter((n) => n.post_id === publication.id).length}</h4>

            <img
              onClick={() => {
                setOpen(isOpen ? '' : publication.id) // toggle open/close
              }}
              src="/comment1.svg"
              width="50px"
              alt=""
              style={{ cursor: 'pointer' }}
            />

            <div className={styles.description}>{publication.content}</div>
          </div>
        </div>
      </div>

      <div
      className={styles["main-publication"]}
        style={{
          width: isOpen ? '500px' : '0px', // ancho cerrado o abierto
          overflow: 'hidden',
          whiteSpace: 'nowrap', // para que no baje a varias líneas si hay texto
          transition: 'width 0.5s ease',
        }}
      >
        {isOpen && <PublicationOpen publication={publication} setOpen={setOpen} user={user} users={users} styles={styles} />}
      </div>
    </div>
  )
}


export default PublicationHome
