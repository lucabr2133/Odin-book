import { useEffect, useReducer } from "react"
import {Likes} from '../types'
import useLikesPublication from './useLikes'
interface addAction{
  type:'add',
  like:Likes
}
interface deleteAction{
  type:'delete',
  like:Likes
}
interface setAction{
  type:'set',
  likes:Likes[]
}
export type myAction= addAction|deleteAction|setAction
export type myState={
  likes:Likes[]
}

function ReducerLikes (state:myState, action:myAction) {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        likes: [...state.likes, action.like]
      }
    case 'delete':
      return {
        ...state,
        likes: state.likes.filter((like) => like.id !== action.like.id)
      }
    case 'set':
      return {
        ...state,
        likes: action.likes // ✅ Debe ser plural
      }

    default:
      return state
  }
}
export default function usePublicationLikes(initialState:Likes[]=[]){
  const [state, dispatch] = useReducer(ReducerLikes, {likes:initialState})
    const { publicationLikes } = useLikesPublication()

  useEffect(() => {
    if (publicationLikes) {
      dispatch({ type: 'set', likes: publicationLikes })
    }
  }, [publicationLikes])
  const setLikes = (likes: Likes[]) => dispatch({ type: "set", likes });
  const addLike = (like: Likes) => dispatch({ type: "add", like });
  const deleteLike = (like: Likes) => dispatch({ type: "delete", like });
  
  return { state, setLikes, addLike, deleteLike };
}