import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useHistory } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

import { Markdown } from '../../assets/Misc.jsx'
import '../Misc/Animations.css'
import './CommentInput.css'

export default function CommentInput({ post_id, status }) {
    const [content, setContent] = useState('')
    const user = Cookies.getJSON('user')
    const history = useHistory()

    const handleChange = value => setContent(value)
    const handleSubmit = () => {
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '  + user.token
            },
            data: {
                content: content
            },
            url: `https://orbimind.herokuapp.com/api/posts/${ post_id }/comments`
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers })

        toast.promise(
            promise, 
            {
                loading: 'Leaving your mark...',
                success: () => {
                    setTimeout(() => history.go(0), 1000)
                    return 'Your comment was created!'
                },
                error: (error) => {
                    if(error.response.data.errors.content)
                        toast.error(error.response.data.errors.content[0])
                    return error.response.data.message
                }
            }
        )
    }

    if(!user)
        return (
            <div className='commentInput notLogged'>
                <span>You must be logged in to comment on this post :c</span>
                <Link to='/login'>Log in</Link>
            </div>
        )
    if(!status)
        return (
            <div className='commentInput notLogged'>
                <span>This post is not active. Go check the best answer!</span>
                <Link to='/posts'>Back to posts</Link>
            </div>
        )
    return (
        <div className='commentInput listPopInUnder'>
            <img src={`https://d3djy7pad2souj.cloudfront.net/avatars/${ user.image }`} alt="avatar" />
            <form onSubmit={ e => handleSubmit(e.preventDefault()) }>
                <textarea value={ content } onChange={ e => handleChange(e.target.value) } name='content' type="text" placeholder="Enter a comment.." />
                <div>
                    <a id='markdown' href='https://guides.github.com/features/mastering-markdown/' target='_black' rel='noopener'>
                        <Markdown /> 
                        <span>Styling with Markdown is supported</span>
                    </a>
                    <input type='submit' value='Comment on this post' />
                </div>
            </form>
        </div>
    )
}
