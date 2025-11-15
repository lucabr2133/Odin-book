import { useContext, useEffect, useState } from 'react'
import { Params, useParams } from 'react-router'
import CreatePublication from '../CreatePublication/CreatePublication.js'
import updatePublication from '../../../services/onHandleSubmitUpdatePublication.js'
import styles from './Profile.module.css'
import useFollowing from '../../hooks/useFollowing.js'
import { PublicationContext, UserContext, UserSession } from '../../contex/context.js'
import useUser from '../../hooks/useUser'
import usePublication from '../../hooks/getUserPublicattion.js'
import Header from './Header.js'
import UpdatePublicationProfile from './UpdatePublicationProfile.jsx'
import PubliationTabs from './PublicationTabs'
import PublicationGrid from './PublicationGrid'
import MainHeader from '../Header/Header.js'
import React from 'react'
import {  Publications, User } from '../../types.js'
function Profile() {
  const [openDialgo2, setOpenDialog2s] = useState(false)
const {username}=useParams<Params>()
  const context = useContext(PublicationContext)
  const userContext= useContext(UserSession)

  if(!context ||!userContext )throw new Error('you have to put the correctly provider')
  const users = useContext(UserContext)
  const [updateForm, setUpdateForm] = useState<string|null>(null)
  const { following } = useFollowing()

  const { user: userSession } = userContext
  const [userData, setUserData] = useState<User|null>(null)
  const { user } = useUser(username)
  useEffect(() => {
    if (user) {
      setUserData(user)
    }
  }, [user])
  const userId=user?.id
  const { publications } = usePublication(userId)
  const { state, dispatch } = context;

useEffect(() => {
  if (!publications) return
  if (publications.length === 0) return // no dispatch con array vacío
  dispatch({ type: "set", publications })
}, [publications, dispatch])
  const isLoading = ![following, state, users, userData, userSession, publications].every(Boolean)

  if (isLoading||!publications||!userData||!following||!username||!users||!userSession) {
    return (
      <h1>Loading</h1>
    )
  }
 
  
  function sortByDateDesc(publications:Publications[]) {
    return [...publications].sort((a, b) => new Date(b.create_at).getDate() - new Date(a.create_at).getDate())
  }
  
  const sortedVideos = sortByDateDesc(state.publications)

  return (
    <>
      <div className={styles.container}>
        <MainHeader userActive={userSession} setOpenDialog2s={setOpenDialog2s} />
        <main className={styles.main}>
          <Header
            data={{ userData, userSession, publications, following }}
            actions={{ setUserData }}
            usernameParam={username}
            styles={styles}
          />
          <div className={styles['my-publications']}>
            <PublicationGrid extra={{ userSession, userData, dispatch, users, setUpdateForm }} styles={styles} data={{ sortedVideos, publications }} />
          </div>

        </main>

      </div>

      <UpdatePublicationProfile updateForm={updateForm} setUpdateForm={setUpdateForm} dispatch={dispatch} styles={styles} updatePublication={updatePublication} />

      <CreatePublication opendialog={openDialgo2} setOpenDialog={setOpenDialog2s} userActive={userSession} />
    </>
  )
}
export default Profile
