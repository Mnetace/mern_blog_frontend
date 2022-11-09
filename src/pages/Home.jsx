import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts, fetchPostsPopular, fetchTags } from '../redux/slices/posts'

import { Post } from '../components/Post'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Grid from '@mui/material/Grid'

export const Home = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.auth.data)
  const { posts } = useSelector((state) => state.posts)

  const isPostsLoading = posts.status === 'loading'

  const [value, setValue] = useState('new')
  const handleChange = (event, newValue) => {
    setValue(newValue)
    if (newValue === 'new') {
      dispatch(fetchPosts())
    }
    dispatch(fetchPostsPopular())
  }

  useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchTags())
  }, [])

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={value}
        onChange={handleChange}
        aria-label="Sort articles"
      >
        <Tab value="new" label="New" />
        <Tab value="popular" label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={12} item>
          {(isPostsLoading ? [...Array(3)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={
                  // obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''
                  obj.imageUrl
                    ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}`
                    : ''
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
      </Grid>
    </>
  )
}
