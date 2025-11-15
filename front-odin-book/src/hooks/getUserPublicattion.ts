import { useEffect, useState } from 'react'
import {Publications} from '../types'
function usePublication (userid:string|undefined) {
const apiUrl = import.meta.env.VITE_API_URL;
  
  const [publications, setPublication] = useState<Publications[]|null>(null)
  useEffect(() => {
    if(!userid)return
    async function GetPublication () {
      const res = await fetch(`${apiUrl}/publications/${userid}/publication`)
      const data:Publications[] = await res.json()
      
      setPublication(data)
    }
    GetPublication()
  }, [userid,apiUrl])
  
  return { publications }
}
export default usePublication
