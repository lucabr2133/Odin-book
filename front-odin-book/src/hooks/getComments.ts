import { useEffect, useState } from 'react'
import { Comments } from '../types'

function useComments () {
  const [comments, setComments] = useState<Comments[]|null>(null)
const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    async function getData () {
      const res = await fetch(`${apiUrl}/comments/comments`)
      const data:Comments[] = await res.json()
      setComments(data)
    }
    getData()
  }, [apiUrl])

  return { comments }
}
export default useComments
