import React, { useContext } from 'react'
import onHandleSubmitCreatePublication from '../../../services/onHandelSubmitCreatePublication'
import styles from './CreatePublication.module.css'
import { PublicationContext, UserSession } from '../../contex/context'
import { User } from '../../types'
import { SubmitHandler, useForm } from 'react-hook-form'

interface props {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  opendialog: boolean
  userActive?: User
}
export interface Inputs{
    publicationImg:FileList,
    description:string
  }
function CreatePublication({ setOpenDialog, opendialog }: props) {
  const userContex = useContext(UserSession)
  const contex = useContext(PublicationContext)

  if (!contex || !userContex) {
    throw new Error('The context must be a valid provider')
  }

  const { user } = userContex
  const { dispatch } = contex
if(!user) return
const {register,handleSubmit,setError,formState:{errors,isSubmitting}}=useForm<Inputs>()
const onSubmit:SubmitHandler<Inputs>=async(data)=>{
          try {
    const publicaciones = await onHandleSubmitCreatePublication(data, user, setError);

    // Si publicaciones es null o undefined, cortamos
    if (!publicaciones) return;

    setOpenDialog(false);
    dispatch({ type: 'add', publication: publicaciones.publication });

  } catch (error) {
    console.error("❌ Error al crear publicación:", error);
    // Aquí no se ejecutará lo demás
  }
}
  return (
    <dialog
      className={styles.dialog}
  open={opendialog}
  onClick={() => setOpenDialog(false)} // click en el fondo cierra
    >
      <div
      className={styles['dialog-form']}
  onClick={(e) => e.stopPropagation()} /// clic dentro => no cerrar
      >
        <header className={styles['form-header']}>Create New Publication</header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles['container-form']}
          method="post"
          encType="multipart/form-data"
        >
          <label htmlFor="publicationImg">
            <img width="200px" src="publication.svg" alt="" />
          </label>
          <input hidden type="file" {...register('publicationImg',{required:"An image is required", })} id="publicationImg" />
          {errors.publicationImg&&<span style={{color:'red'}}>{errors.publicationImg.message}</span>}
          <label htmlFor="description">
            <h1>Description</h1>
          </label>
          <input type="text" {...register('description',{
            required:'description is required'
          })} id="description" />
          
          {errors.description&& <span style={{color:'red'}}>{errors.description.message}</span>}
          <button type="submit" disabled={isSubmitting} >{isSubmitting?'Creating':'Create'}</button>
        </form>
      </div>
    </dialog>
  )
}

export default CreatePublication
