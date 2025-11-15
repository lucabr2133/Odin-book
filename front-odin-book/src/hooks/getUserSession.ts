import { useState, useEffect } from 'react'
import { User } from '../types'
import {data} from '../types'
function useUserSession () {
const apiUrl = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState<User|null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    async function getData () {
      try {
        const res = await fetch(`${apiUrl}/logins/`, {
          credentials: 'include',
        })

        if (res.ok) {
          const data :data = await res.json()
          setUser(data.user) // Asigna el usuario recibido
        } else {
          setUser(null) // Si no hay usuario, establece a null
        }
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error)
        setUser(null) // En caso de error, establece el usuario como null
      } finally {
        setLoading(false) // Marca la carga como completada
      }
    }

    getData() // Llamamos a la función para obtener los datos del usuario
  }, [apiUrl]) // Dependencia vacía para que solo se ejecute una vez cuando el componente se monte

  return { user, loading, setUser }
}

export default useUserSession
