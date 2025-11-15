import onHandleSubmitComment from '../../../services/onHandleSubmitComment'
import useComments from '../../hooks/getComments'
import React, { useEffect, useState } from 'react'
import { Comments, Publications, User } from '../../types'
import { socket } from '../../socket'
import { useChatSocket } from '../../hooks/useChatSocket'
interface props {
  styles:Record<string,string>
  publication:Publications,
  users:User[],
  user:User,
}
function CommentList ({ styles, publication, users, user }:props) {
  const { comments:commentsHook } = useComments()
const [comments,setComments]=useState<Comments[]>()
useEffect(()=>{
  if(commentsHook){
    setComments(commentsHook)
  }
},[commentsHook])
useChatSocket()
useEffect(() => {
  if (!publication?.id) return;

  // Unir a la "room"
  socket.emit("publicationRomm", publication.id);

  // Handler
  const handleComment = (comment: Comments) => {
    setComments((prev) => {
      if(!prev)return
      return [...prev, comment]
    });
  };

  socket.on("publication comments", handleComment);

  return () => {
    socket.off("publication comments", handleComment);
  };
}, [publication?.id]);

if (comments==null && !users) {
    return (

      <h1>loading..</h1>

    )
  }

  return (
    <>

      <div className={styles.comments}>

        <div style={{
          maxHeight:'750px',
          overflowY:'auto'
        }} className='messages'>
          {comments?.map((comment) => {
            const user = users?.find((user) => user.id === comment.user_id)
            return (
              comment.post_id === publication.id && (
                <div className={styles.message} key={comment.id}>
                  <img width='30px' src={user?.profileImg ?? 'profile2.svg'} alt='' />

                  <p>{user?.username}</p>
                  <p key={comment.id}>{comment.content}</p>
                </div>

              )
            )
          }

          )}
        </div>
        <div className={styles['submit-comment']}>
          <form className={styles['submit-comment-form']} action='' onSubmit={(e) => { onHandleSubmitComment(e, user.id, publication.id) }}>
            <input className='comment-text' type='text' name='comment' />
            <button type='submit'>Send</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CommentList
