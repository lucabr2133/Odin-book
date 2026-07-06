import PublicationList from './PublicationList'
import React, { Suspense, useState } from 'react'
import { Publications, User } from '../../types'
interface props{
  styles:Record<string,string>
  extra:{
    users:User[],
    deleteAction:(publicationId:string)=>void
    setUpdateForm:React.Dispatch<React.SetStateAction<string|null>>
    setPublications:React.Dispatch<React.SetStateAction<Publications[]|null>>
    userData:User
    userSession:User
  }
  data:{
    publications:Publications[]
    sortedVideos:Publications[]
  }
}
function PublicationGrid({ styles, data, extra }: props) {
  const { users, deleteAction, setUpdateForm,setPublications, userData, userSession } = extra
  const { publications, sortedVideos } = data
  const [openedId, setOpenedId] = useState<string | null>(null)

  return (
    <div
      style={{
        margin: '10px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#07070d',
        width: '100%',
        maxWidth: '1000px',
        padding: '0 8px',
      }}
    >
      {publications
        ? sortedVideos.map((publication) => (
          <PublicationList
            key={publication.id}
            styles={styles}
            actions={{ setOpenedId, setUpdateForm, deleteAction, setPublications }}
            data={{ openedId, users, publication, userData, publications, userSession }}
          />
        ))
        : (
          <p style={{ color: '#6a6a8a', textAlign: 'center', fontFamily: "'Rajdhani', monospace", fontSize: '0.95rem', letterSpacing: '0.08em', padding: '40px' }}>No posts yet</p>
        )}
    </div>
  )
}


export default PublicationGrid
