import React, { useState, useContext, useReducer, useEffect ,lazy,Suspense} from 'react'
import usePublication from '../../hooks/getPublications'
import onHandleLikePublication from '../../../services/onHandleLikePublication'
import useLikesPublication from '../../hooks/useLikes'
import onHandleDeletedLike from '../../../services/onHandleDeletedLike'
import CreatePublication from '../CreatePublication/CreatePublication'
import styles from './Home.module.css'
import { PublicationContext, UserContext, UserSession } from '../../contex/context'
import MainHeader from '../Header/Header'
import { Likes } from '../../types'
import VerticalHeader from '../Header/VericalHeader'
import { Link } from 'react-router'

function Home () {
  const PublicationHome = lazy(() => import('./PublicationsHome'));
  const [opendialog, setOpenDialog] = useState(false)
const contex= useContext(UserSession)
const contexPublication=useContext(PublicationContext)

if(!contex|| !contexPublication) throw new Error('The context must have a valid provider')
  const { user } =contex
const{dispatch,state}=contexPublication
 const {publication}=usePublication()
  const users = useContext(UserContext)
  const { publicationLikes } = useLikesPublication()
  useEffect(()=>{
      if(!publication)return
      if(publication.length==0)return
      dispatch({type:'set',publications:publication})
  },[publication])
  const isLoading = ![ users, user, publicationLikes].every(Boolean)

  if (isLoading ||!users ||!user) {
    return (
      <h1>Loading</h1>
    )
  }

  return (
    <>
    <div style={
      {
        display:'grid',
        gridTemplateColumns:'15% 65% 20%'
      }
    }>
<MainHeader userActive={user} setOpenDialog2s={setOpenDialog} />
      <main className={styles.home}>
        <div className={styles['publications-home']}>
          <Suspense fallback={<p>loading...</p>}>
        {state.publications.map((publication) => {
            const userFind = users?.filter(user => publication.user_id === user.id)
            return (
              
              <PublicationHome data={{ userFind, user, users, publication}} styles={styles} actions={{  onHandleDeletedLike, onHandleLikePublication }} key={publication.id} />
            )
          })}
          </Suspense>
        

        </div>
      </main>
      <aside style={{
        display:'flex',
        flexDirection:'column'
      }}>
        <div style={
          {
            textAlign:"center",
             border:'1px solid black',
              borderRadius:'10px',
              margin:'10px'
          }
        }>
          <h1 style={{
            fontSize:'40PX'
          }}>USERS</h1>
          {users.map((user)=>(
            <div style={{
             
            }} className={styles.message}>
          <Link style={{ width: '100px', marginRight: '10px' }} to={`/${user.username}`}>
              <img width={'80px'} src={user.profileImg?user.profileImg:'profile2.svg'} alt="" />
          
          </Link>
              <h2>{user.username}</h2>
            </div>
          ))}
        </div>
      </aside>
    </div>
      
    </>
  )
}
export default Home
