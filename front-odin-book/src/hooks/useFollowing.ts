import { useEffect, useState } from 'react'
import { Following } from '../types'
const apiUrl = import.meta.env.VITE_API_URL;

function useFollowing () {
  const [following, setFollowing] = useState<Following[]|null>(null)
  useEffect(() => {
    async function getFollowing () {
      const data = await fetch(`${apiUrl}/followings/following`)
      const res:Following[] = await data.json()
      setFollowing(res)
    }
    getFollowing()
  }, [])
  return { following }
}
export default useFollowing
