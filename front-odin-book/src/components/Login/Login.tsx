import { Link, useNavigate } from 'react-router'
import onHandleSubmitLogin from '../../../services/onHandleLogin'
import useUserSession from '../../hooks/getUserSession'
import { useState } from 'react'
import styles from './login.module.scss'
import React from 'react'
import { errorMesagges } from '../../types'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Inputs } from '../Signup/Signup'
const apiUrl = import.meta.env.VITE_API_URL;

function Login () {
  const {register,setError,handleSubmit,formState:{errors,isSubmitting}} =useForm<Inputs>()
  const { user, setUser } = useUserSession()
const navigate=useNavigate()

  const onSubmit:SubmitHandler<Inputs>=data=>{
    onHandleSubmitLogin(data,setUser,setError)
  }
  return (
    <>
      <div className={styles.Loginbody}>
        <form
          className={styles.Loginform} onSubmit={handleSubmit(onSubmit) }
        >
          <h2 style={{ fontSize: '50px', textAlign: 'center', fontFamily: 'monospace' }}>Login</h2>
          <label>Username</label>
          <input type='text'    {...register("username", {
            required: "Username is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
            maxLength: { value: 16, message: "Maximum 16 characters" }
          })} aria-label='username' />
        {errors.username && <span>{errors.username.message}</span>}
          <label>Passwoord</label>
          <input type='password'    {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
            maxLength: { value: 16, message: "Maximum 16 characters" }
          })} aria-label='password' />
        {errors.password && <span>{errors.password.message}</span>}
        
             <button aria-label='send' disabled={isSubmitting} type="submit">
          {isSubmitting ? "Sending..." : "Send"}
        </button>
              <button type='button' aria-label='send-guest' onClick={()=>{
                onSubmit({username:"guestUser",password:"12345678"})
              }}>Enter as a guest</button>

          <Link to='/Signup'>Create account</Link>
          <Link to={`${apiUrl}/auth/github`}><img width='40px' src='/github.jpg' alt='' /></Link>
        </form>

      </div>

    </>
  )
}
export default Login
