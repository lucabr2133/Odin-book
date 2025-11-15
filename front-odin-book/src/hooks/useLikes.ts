import { useEffect, useState } from 'react'
import { Likes } from '../types'
const apiUrl = import.meta.env.VITE_API_URL;

export default function useLikesPublication () {
  const [publicationLikes, setPublicationLikes] = useState<Likes[]|null>(null)

  useEffect(() => {
    async function getLikesPublication () {
      const data = await fetch(`${apiUrl}/likes/likes`)
      const response:Likes[] = await data.json()
      setPublicationLikes(response)
    }
    getLikesPublication()
  }, [])
  return { publicationLikes }
}
