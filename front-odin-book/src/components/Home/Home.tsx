import React, { useContext } from 'react'
import usePublication from '../../hooks/getPublications'
import onHandleLikePublication from '../../../services/onHandleLikePublication'
import onHandleDeletedLike from '../../../services/onHandleDeletedLike'
import styles from './Home.module.css'
import { UserContext, UserSession } from '../../contex/context'
import MainHeader from '../Header/Header'
import { ArrowRightCircle } from 'lucide-react'
import { useFollowing } from '../../hooks/useFollowing'
import { ErrorMessage } from '../ui/Error'
import FollowingList from './FollowingList'
import GlobalLoading from '../../GlobalLoading'
import PublicationHome from './PublicationsHome'
import PublicationSkeleton from './PublicationSkeleton'
import { useFollow } from '../../contex/FollowContext'
import { usePublicationContext } from '../../contex/PublicationContext'
import { Link } from 'react-router'
function Home () {
  const contex = useContext(UserSession)
  const users = useContext(UserContext)

  if (!contex) throw new Error('The context must have a valid provider')

  const { user } = contex

  const { error: errorPublication, loading: loadingPublication } = usePublication()
  const { error: errorFollowing, loading: loadingFollowing } = useFollowing()
  // global following state used in the follower suggestions
  const { state } = useFollow()
  const { state: publication } = usePublicationContext()
  if (errorPublication || errorFollowing) {
    return (
      <ErrorMessage
        message={errorPublication || errorFollowing}
      />
    )
  }
  if (!user || !users) {
    return <GlobalLoading />
  }

  return (
    <>
      <div className='lg:grid  lg:grid-cols-[15%_65%_20%] block'>
        <MainHeader userActive={user} />
        <main className='w-full'>
          <div className={styles['publications-home']}>
            {loadingPublication
              ? <PublicationSkeleton />
              : publication.publications?.map((publication) => {
                return (

                  <PublicationHome data={{ user, users, publication }} styles={styles} actions={{ onHandleDeletedLike, onHandleLikePublication }} key={publication.id} />
                )
              })}

          </div>
        </main>
        <aside
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div
            className='hidden lg:flex flex-col gap-2'
            style={{ margin: '16px 12px', padding: '16px', background: '#0a0a12', border: '1px solid #1e1e35', borderRadius: '2px' }}
          >
            <FollowingList state={state} user={user} users={users} />

            <Link
              to={'/users'}
              style={{
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.7rem',
                color: '#6a6a8a',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                border: '1px solid #1e1e35',
                borderRadius: '2px',
                transition: 'all 0.2s ease',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.borderColor = '#00ff8766'
                el.style.color = '#00ff87'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.borderColor = '#1e1e35'
                el.style.color = '#6a6a8a'
              }}
            >
              View all users <ArrowRightCircle size={14} />
            </Link>
          </div>
        </aside>
      </div>

    </>
  )
}
export default Home
