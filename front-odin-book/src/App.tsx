import './App.css'
import Login from './components/Login/Login.js'
import Home from './components/Home/Home.js'
import { useContext } from 'react'
import { UserSession } from './contex/context.js'
function App () {
  
    const context = useContext(UserSession);

  if (!context) {
    throw new Error('UserProfile debe ser usado dentro de un UserSessionProvider');
  }

  const { user, loading } =context
  if (loading) {
    return (
      <>

        <p >Cargando...</p> 
      </>
    )
  }

  return (
    <>
      {user
        ? <Home />

        : <Login />}  
    </>
  )
}

export default App
