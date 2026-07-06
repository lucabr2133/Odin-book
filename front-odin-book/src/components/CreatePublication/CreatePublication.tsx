import React, { useContext } from 'react';
import onHandleSubmitCreatePublication from '../../../services/onHandelSubmitCreatePublication';
// Importamos el ícono de imagen, podrías usar una librería como react-icons
import { UserSession } from '../../contex/context';
import { User } from '../../types';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Image } from 'lucide-react';
import { usePublicationContext } from '../../contex/PublicationContext';

interface props {
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  opendialog: boolean;
  userActive?: User;
}

export interface Inputs {
  publicationImg: FileList;
  description: string;
}

function CreatePublication({ setOpenDialog, opendialog }: props) {
  const userContex = useContext(UserSession);
  const contex = usePublicationContext()

  if (!contex || !userContex) {
    throw new Error('The context must be a valid provider');
  }

  const { user } = userContex;
  const { addAction } = contex;


  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();
  if (!user) return null;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const publicaciones = await onHandleSubmitCreatePublication(
        data,
        user,
        setError
      );

      if (!publicaciones) return;

      setOpenDialog(false);
      console.log(publicaciones);
      
      addAction(publicaciones.publication);
    } catch (error) {
      console.error('❌ Error al crear publicación:', error);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
        opendialog ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setOpenDialog(false)} 
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-full bg-neutral-700/40 max-w-lg overflow-hidden rounded-xl p-6 shadow-2xl transition-all transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()} 
      >
        <header className="border-b pb-4 text-center">
          <h2 className="text-xl font-semibold text-white!">
            Create New Publication
          </h2>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-6"
          method="post"
          encType="multipart/form-data"
        >
          <div className="flex flex-col items-center hover:text-white!">
            <label
              htmlFor="publicationImg"
              className="group flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-black  text-gray-500 hover:border-blue-500 hover:bg-blue-950/40 hover:text-blue-600 transition duration-150 ease-in-out"
            >
              <Image className="h-10 w-10 mb-2 group-hover:text-blue-600!" />
              <span className="text-sm font-medium ">
                Click to select an image
              </span>
            </label>
            <input
              hidden
              type="file"
              {...register('publicationImg', {
                required: 'An image is required',
              })}
              id="publicationImg"
              accept="image/*"
            />
            {errors.publicationImg && (
              <span className="mt-2 text-sm text-red-500">
                {errors.publicationImg.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700!"
            >
              Description
            </label>
            <input
              type="text"
              {...register('description', {
                required: 'Description is required',
              })}
              id="description"
              placeholder="What's on your mind?"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.description && (
              <span className="mt-2 text-sm text-red-500">
                {errors.description.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {isSubmitting ? 'Creating...' : 'Create Publication'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePublication;