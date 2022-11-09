// importing basic hooks from libraries
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

// importing functions for authorization and registration
import { fetchAuth, selectIsAuth } from '../../redux/slices/auth'

// importing files from MUI (design)
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { useForm } from 'react-hook-form'

import styles from './Login.module.scss'

export const Login = () => {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values))
    if (!data.payload) {
      alert('Failed to log in to MERN blog!')
    }
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  // Redirecting to the main page for authorized users
  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper elevation={0} classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Sign in MERN Blog
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register('email', { required: 'Enter your email' })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Enter your password' })}
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Sign in
        </Button>
      </form>
    </Paper>
  )
}
