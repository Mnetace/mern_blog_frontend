// importing basic hooks from libraries
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, Navigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

// importing settings for axios and authorization
import axios from '../../axios'
import { selectIsAuth } from '../../redux/slices/auth'

// importing files from MUI (design)
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'

import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'

export const AddPost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAuth = useSelector(selectIsAuth)
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const inputFileRef = useRef(null)

  const isEditing = Boolean(id)

  // Creating and uploading an image
  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('image', file)
      const { data } = await axios.post('/upload', formData)
      setImageUrl(data.url)
    } catch (err) {
      console.warn(err)
      alert('Error when uploading a file!')
    }
  }

  // delete image
  const onClickRemoveImage = () => {
    setImageUrl('')
  }

  const onChange = React.useCallback((value) => {
    setText(value)
  }, [])

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        imageUrl,
        tags,
        text,
      }
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields)

      const _id = isEditing ? id : data._id

      navigate(`/posts/${_id}`)
    } catch (err) {
      console.warn(err)
      alert('Error when creating an article')
    }
  }

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title)
          setText(data.text)
          setImageUrl(data.imageUrl)
          setTags(data.tags.join(','))
        })
        .catch((err) => {
          console.warn(err)
          alert('Error when receiving the article')
        })
    }
  }, [id])

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Enter the text...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  )

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper elevation={0} style={{ padding: 30 }} key="1">
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="contained"
        size="large"
      >
        Download the preview
        <input
          ref={inputFileRef}
          type="file"
          onChange={handleChangeFile}
          hidden
        />
      </Button>
      {imageUrl && (
        <>
          {' '}
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
            size="large"
          >
            Delete
          </Button>
          <div>
            <img
              className={styles.image}
              src={`http://localhost:4444${imageUrl}`}
              alt="Uploaded"
            />
          </div>
        </>
      )}
      <TextField
        classes={{ root: styles.title }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="standard"
        placeholder="Article title..."
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save' : 'To publish'}
        </Button>
        <a href="/">
          <Button size="large" variant="outlined" color="error">
            Cancel
          </Button>
        </a>
      </div>
    </Paper>
  )
}
