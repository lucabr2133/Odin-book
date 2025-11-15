import { useEffect, useState } from 'react'
import { User } from '../types'
const apiUrl = import.meta.env.VITE_API_URL;

function useUsers () {
  const [users, setUsers] = useState<User[]|null>(null)
  useEffect(() => {
    async function getAllUsers () {
      const data = await fetch(`${apiUrl}/logins/users`)
      const res:User[] = await data.json()
      setUsers(res)
    }
    getAllUsers()
  }, [])

  return { users }
}

export default useUsers
