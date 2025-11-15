import PublicationList from './PublicationList'
import React, { useState } from 'react'
import { Publications, User } from '../../types'
import { myAction } from '../../Reducers/PublicationReducer'
interface props{
  styles:Record<string,string>
  extra:{
    users:User[],
    dispatch:React.Dispatch<myAction>,
    setUpdateForm:React.Dispatch<React.SetStateAction<string|null>>

    userData:User
    userSession:User
  }
  data:{
    publications:Publications[]
    sortedVideos:Publications[]
  }
}
function PublicationGrid({ styles, data, extra }: props) {
  const { users, dispatch, setUpdateForm, userData, userSession } = extra
  const { publications, sortedVideos } = data
  const [openedId, setOpenedId] = useState<string | null>(null)

  return (
    <div
      style={{
        borderBottom: '2px solid rgb(226, 226, 226)',
        margin: '10px auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        backgroundColor: 'rgb(36, 36, 39)',
        width: '100%',
        maxWidth: '1000px',
      }}
    >
      {publications && publications.length > 0 ? (
        sortedVideos.map((publication) => (
          <PublicationList
            key={publication.id}
            styles={styles}
            actions={{ setOpenedId, setUpdateForm, dispatch }}
            data={{
              openedId,
              users,
              publication,
              userData,
              userSession,
            }}
          />
        ))
      ) : (
        <p style={{ color: '#ccc', textAlign: 'center' }}>No hay publicaciones</p>
      )}
    </div>
  )
}


export default PublicationGrid
