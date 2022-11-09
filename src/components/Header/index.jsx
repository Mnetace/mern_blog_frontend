import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { logout, selectIsAuth } from '../../redux/slices/auth'

import Button from '@mui/material/Button'
import Container from '@mui/material/Container'

import styles from './Header.module.scss'

export const Header = () => {
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)

  const onClickLogout = () => {
    if (window.confirm('Are you sure want to log out?')) {
      dispatch(logout())
      window.localStorage.removeItem('token')
    }
  }

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>MERN BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Write an article</Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
