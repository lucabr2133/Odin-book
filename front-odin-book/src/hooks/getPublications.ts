import { useEffect, useState } from 'react'
import { Publications } from '../types'
const apiUrl = import.meta.env.VITE_API_URL;

function usePublication () {
  const [publication, setPublication] = useState<Publications[]|null>(null)
  useEffect(() => {
    async function getData () {
      const data = await fetch(`${apiUrl}/publications/publications`)
      const res:Publications[] = await data.json()
      setPublication(res)
    }
    getData()
  }, [])
  return { publication }
}
export default usePublication
