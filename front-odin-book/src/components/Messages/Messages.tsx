import { useContext, useEffect, useState } from 'react'
import useMessages from '../../hooks/useMessages.js'
import CreatePublication from '../CreatePublication/CreatePublication.jsx'
import onHandleMessageSubmit from '../../../services/onHandleMessageSubmit.js'
import { UserContext, UserSession } from '../../contex/context.js'
import MainHeader from '../Header/Header.jsx'
import React from 'react'
import { Messages as messages, User } from '../../types.js'
import {useChatSocket} from '../../hooks/useChatSocket'
import { socket } from '../../socket.js'
function Messages() {
  const contex = useContext(UserSession)
  if (!contex) throw new Error('you must put a valid provider')
  const { user } = contex

  const users = useContext(UserContext)
  const { messages:hookMessage } = useMessages()
  const [messages,setMessages]=useState<messages[]>()
  useEffect(()=>{
    if(hookMessage){
      setMessages(hookMessage)
    }
  },[hookMessage])
  
  const [receptorUser, setReceptorUser] = useState<User | null>(null)
  const [opendialog, setOpenDialog] = useState(false)
  useChatSocket();
    useEffect(() => {
      if(user?.id){
       socket.emit("joinRoom", user.id);

    const handleMessage = (message: messages) => {
      setMessages((prev) => {
        if(!prev) return
        return [...prev, message]});
    };

    socket.on("chat message", handleMessage);



        return () => {
      socket.off("chat message", handleMessage);
    };
      }
    // Unirse a la room al montar el componente
   


  }, [user?.id]);
  if (!user || !users || !messages) {
    return <p>Loading user...</p>
  }
  


  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns:'20% 70%'
      }}
        
      >
        <MainHeader userActive={user} setOpenDialog2s={setOpenDialog} />
<div style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          backgroundColor: '#121212',
          color: '#ddd',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          gridColumn:'2/3'
        }}>
   <header
          style={{
            backgroundColor: '#1e1e1e',
            padding: '10px 15px',
            display: 'flex',
            overflowX: 'auto',
            gap: 12,
            borderBottom: '1px solid #333',
          }}
          aria-label="Lista de usuarios"
        >
          {users
            .filter((u) => u.id !== user.id)
            .map((user1) => (
              <div
                key={user1.id}
                role="button"
                tabIndex={0}
                onClick={() => setReceptorUser(user1)}
                onKeyDown={(e) => e.key === 'Enter' && setReceptorUser(user1)}
                style={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  minWidth: 70,
                  padding: 5,
                  borderRadius: 12,
                  backgroundColor: receptorUser?.id === user1.id ? '#4a90e2' : 'transparent',
                  color: receptorUser?.id === user1.id ? '#fff' : '#ccc',
                  boxShadow: receptorUser?.id === user1.id ? '0 0 8px #4a90e2' : 'none',
                  transition: 'all 0.25s ease',
                  userSelect: 'none',
                }}
              >
                <img
                  width={50}
                  height={50}
                  src={user1.profileImg || 'profile2.svg'}
                  alt={`${user1.username} profile`}
                  style={{
                    borderRadius: '50%',
                    border: '2px solid #555',
                    marginBottom: 6,
                    objectFit: 'cover',
                  }}
                />
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    margin: 0,
                  }}
                >
                  {user1.username}
                </p>
              </div>
            ))}
        </header>

        {/* Contenedor principal */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            backgroundColor: '#181818',
            padding: 20,
            gap: 20,
            overflow: 'hidden',
          }}
        >
          {/* Mensajes y chat */}
          {receptorUser ? (
            <section
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#222',
                borderRadius: 16,
                boxShadow: '0 0 15px rgba(0,0,0,0.8)',
                overflow: 'hidden',
              }}
              aria-label={`Chat con ${receptorUser.username}`}
            >
              {/* Header receptor */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px 20px',
                  backgroundColor: '#333',
                  borderBottom: '1px solid #444',
                  gap: 15,
                }}
              >
                <img
                  src={receptorUser.profileImg || 'profile2.svg'}
                  width={60}
                  height={60}
                  alt={`${receptorUser.username} profile`}
                  style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid #4a90e2' }}
                />
                <h2 style={{ color: '#4a90e2', margin: 0 }}>{receptorUser.username}</h2>
              </div>

              {/* Mensajes */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  backgroundColor: '#181818',
                }}
              >
                {messages
                  .filter(
                    (message) =>
                      (message.sender_id === user.id && message.receptor_id === receptorUser.id) ||
                      (message.sender_id === receptorUser.id && message.receptor_id === user.id)
                  )
                  .map((message) => (
                    <div
                      key={message.id}
                      style={{
                        alignSelf: message.sender_id === user.id ? 'flex-end' : 'flex-start',
                        backgroundColor: message.sender_id === user.id ? '#4a90e2' : '#444',
                        color: message.sender_id === user.id ? 'white' : '#ddd',
                        padding: '10px 15px',
                        borderRadius: 20,
                        maxWidth: '70%',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.content}
                    </div>
                  ))}
              </div>

              {/* Formulario enviar mensaje */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  onHandleMessageSubmit(e, user, receptorUser)
                  e.currentTarget.reset()
                }}
                method="POST"
                style={{
                  display: 'flex',
                  padding: 15,
                  borderTop: '1px solid #444',
                  backgroundColor: '#333',
                }}
                aria-label="Enviar mensaje"
              >
                <input
                  type="text"
                  name="message"
                  id="message"
                  placeholder="Escribe tu mensaje..."
                  required
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: 25,
                    border: 'none',
                    fontSize: 16,
                    outline: 'none',
                    marginRight: 12,
                    backgroundColor: '#1e1e1e',
                    color: '#eee',
                  }}
                />
                <button
                  type="submit"
                  role='grid'
                  style={{
                    backgroundColor: '#4a90e2',
                    border: 'none',
                    borderRadius: 25,
                    padding: '12px 20px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.25s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#357abd')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4a90e2')}
                >
                  Send
                </button>
              </form>
            </section>
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#777',
                fontSize: 18,
                fontStyle: 'italic',
              }}
            >
              Selecciona un usuario para chatear
            </div>
          )}
        </main>
</div>
        {/* Sidebar Usuarios */}
     
      </div>

      <CreatePublication opendialog={opendialog} setOpenDialog={setOpenDialog} />
    </>
  )
}

export { Messages }
