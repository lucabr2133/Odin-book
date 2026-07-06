import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { Params, useParams } from 'react-router'
import CreatePublication from '../CreatePublication/CreatePublication.js'
import updatePublication from '../../../services/onHandleSubmitUpdatePublication.js'
import styles from './Profile.module.css'
import { UserContext, UserSession } from '../../contex/context.js'
import useUser from '../../hooks/useUser'
import usePublication from '../../hooks/getUserPublicattion.js'
import Header from './Header.js'
import UpdatePublicationProfile from './UpdatePublicationProfile.jsx'
import PublicationGrid from './PublicationGrid'
import MainHeader from '../Header/Header.js'
import {  Publications, User } from '../../types.js'
import { useFollow } from '../../contex/FollowContext.js'
import { usePublicationContext } from '../../contex/PublicationContext.js'
function Profile() {
  const [openDialgo2, setOpenDialog2s] = useState(false)
const {username}=useParams<Params>()
  const userContext= useContext(UserSession)

  const users = useContext(UserContext)
  const [updateForm, setUpdateForm] = useState<string|null>(null)
  const { state:followingState } = useFollow()
if(!userContext) throw new Error("you need a valid provider")
  const { user: userSession } = userContext
  const [userData, setUserData] = useState<User|null>(null)
  const { user } = useUser(username)
  useEffect(() => {
    if (user) {
      setUserData(user)
    }
  }, [user])
  const userId=user?.id
  const { publications,setPublication } = usePublication(userId)

  const {state,deleteAction,updateAction}=usePublicationContext()
  const isLoading = ![followingState, state, users, userData, userSession, publications].every(Boolean)

  if (isLoading||!publications||!userData||!followingState||!username||!users||!userSession) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', background: '#07070d' }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.75rem', color: '#00ff87', letterSpacing: '0.2em', textShadow: '0 0 8px #00ff87' }}>LOADING...</span>
        <div style={{ width: '40px', height: '40px', border: '2px solid #1e1e35', borderTop: '2px solid #00ff87', borderRadius: '50%', animation: 'spin 0.8s linear infinite', boxShadow: '0 0 10px #00ff8766' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }
 
  
  function sortByDateDesc(publications:Publications[]) {
    return [...publications].sort((a, b) => new Date(b.create_at).getDate() - new Date(a.create_at).getDate())
  }
  
  const sortedVideos = sortByDateDesc(publications)

  return (
    <>
      <div className='min-h-screen' style={{ backgroundColor: '#07070d' }}>
        <MainHeader userActive={userSession} setOpenDialog2s={setOpenDialog2s} />
        {/* paddingLeft = sidebar width on desktop, paddingBottom = bottom nav on mobile */}
        <div
          className={styles.mainpublication}
          style={{ paddingLeft: 'clamp(0px, 15vw, 15vw)' }}
        >
          <Header
            data={{ userData, userSession, publications, following: followingState.following }}
            actions={{ setUserData }}
            usernameParam={username}
            styles={styles}
          />
          <div className={styles['my-publications']}>
            <PublicationGrid extra={{ deleteAction, userSession, userData, users, setUpdateForm, setPublications: setPublication }} styles={styles} data={{ sortedVideos, publications }} />
          </div>
        </div>
      </div>

      <UpdatePublicationProfile updateForm={updateForm} setUpdateForm={setUpdateForm} setPublication={setPublication} updatePublication={updatePublication} />

      <CreatePublication opendialog={openDialgo2} setOpenDialog={setOpenDialog2s} userActive={userSession} />
    </>
  )
}
export default Profile
