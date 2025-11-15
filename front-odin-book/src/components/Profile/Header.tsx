import { Following, Publications, User } from '../../types'
import DialogUpdateProfile from './DialogUpdateProfile'
import React, { useState } from 'react'

interface Props {
  data: {
    userData: User
    userSession: User
    publications: Publications[]
    following: Following[]
  }
  actions: {
    setUserData: React.Dispatch<React.SetStateAction<User | null>>
  }
  styles: Record<string, string>
  usernameParam: string
}
const apiUrl = import.meta.env.VITE_API_URL;

function Header({ data, actions, usernameParam, styles }: Props) {
  const { userData, userSession, publications, following } = data
  const { setUserData } = actions
  const [openDialog, setOpenDialog] = useState(false)

  function onHandleLogout() {
    localStorage.removeItem('token')
    fetch(`${apiUrl}/logins/logout`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = data.redirectUrl
      })
      .catch((error) => console.error('Error al cerrar sesión:', error))
  }

  const isOwner = userSession.id === userData.id

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          gap: '20px',
          background: '#1e1e20',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        {/* Imagen de perfil */}
        <div
          style={{
            flexShrink: 0,
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #4cafef',
            boxShadow: '0 0 10px rgba(76, 175, 239, 0.6)',
          }}
        >
          <img
            src={userData.profileImg || '/profile2.svg'}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Info de usuario */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '1.8rem', color: '#fff' }}>
            {usernameParam}
          </h2>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '15px',
              color: '#ccc',
            }}
          >
            <span>
              <strong style={{ color: '#fff' }}>{publications.length}</strong>{' '}
              publicaciones
            </span>
            <span>
              <strong style={{ color: '#fff' }}>
                {
                  following.filter(
                    (follower) => follower.follower_id === userData.id
                  ).length
                }
              </strong>{' '}
              followers
            </span>
            <span>
              <strong style={{ color: '#fff' }}>
                {
                  following.filter(
                    (follower) => follower.following_id === userData.id
                  ).length
                }
              </strong>{' '}
              following
            </span>
          </div>

          {/* Botones */}
          {isOwner && (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setOpenDialog(true)}
                style={{
                  background: '#4cafef',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) =>
                  ((e.target as HTMLButtonElement).style.background = '#3a9fd8')
                }
                onMouseOut={(e) =>
                  ((e.target as HTMLButtonElement).style.background = '#4cafef')
                }
              >
                Cambiar perfil
              </button>

              <button
                onClick={onHandleLogout}
                style={{
                  background: '#f05454',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) =>
                  ((e.target as HTMLButtonElement).style.background = '#d94343')
                }
                onMouseOut={(e) =>
                  ((e.target as HTMLButtonElement).style.background = '#f05454')
                }
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      <DialogUpdateProfile
        user={userData}
        userParams={usernameParam}
        setUserData={setUserData}
        openDialgo={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  )
}

export default Header
