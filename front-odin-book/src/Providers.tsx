import App from './App.js'
import Signup from './components/Signup/Signup.js'
import Profile from './components/Profile/Profile.jsx'
import GitHubRedirect from './components/GitHubRedirect.jsx'
import useUsers from './hooks/useUsers.js'
import useUserSession from './hooks/getUserSession.js'
import usePublication from './hooks/getUserPublicattion.js'
import { reducer } from './Reducers/PublicationReducer.js'
import { PublicationContext, UserSession, UserContext } from './contex/context.js'
import { useEffect, useReducer } from 'react'
import { Routes, Route } from 'react-router'
import React from 'react'
import { Messages } from './components/Messages/Messages.jsx'
import { Users } from './components/User/User.js'
function AppWithProviders () {
  const { users } = useUsers()
  
  const { user, loading } = useUserSession()

  const { publications } = usePublication(user?.id ?? undefined)
  const initialState = { publications: [] }
  const [state, dispatch] = useReducer(reducer, initialState)

useEffect(() => {
  if (!publications) return
  if (publications.length === 0) return // no dispatch con array vacío
  dispatch({ type: "set", publications })
}, [publications, dispatch])



  return (
    <UserContext.Provider value={users}>
      <UserSession.Provider value={{ user, loading }}>
        <PublicationContext.Provider value={{ state, dispatch }}>

          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/:username' element={<Profile />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/users' element={<Users />} />
            <Route path='/Signup' element={<Signup />} />
            <Route path='/github-token' element={<GitHubRedirect />} />
          </Routes>
        </PublicationContext.Provider>
      </UserSession.Provider>
    </UserContext.Provider>
  )
}
export default AppWithProviders
