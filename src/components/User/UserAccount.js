import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { Helmet } from 'react-helmet'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import axios from 'axios'

import UserBlock from './UserBlock'
import './UserAccount.css'

export default function UserAccount() {
    const history = useHistory()
    const user = Cookies.getJSON('user')
    const [username, setUsername] = useState(user.username)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [password, setPassword] = useState('')
    const [password_confirmation, setPasswordConfirmation] = useState('')

    const handleChange = e => {
        switch(e.target.id){
            case 'username':
                setUsername(e.target.value)
                break
            case 'name':
                setName(e.target.value)
                break;
            case 'email':
                setEmail(e.target.value)
                break;
            case 'password':
                setPassword(e.target.value)
                break;
            case 'password_confirmation':
                setPasswordConfirmation(e.target.value)
                break;
            case 'image':{
                const formData = new FormData()
                formData.append("image", document.querySelector('#image').files[0])

                const api = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer'  + user.token,
                    },
                    data: formData,
                    url: "https://orbimind.herokuapp.com/api/users/avatar"
                };
                const promise = axios.post(api.url, api.data, { headers: api.headers });

                toast.promise(
                    promise, 
                    {
                        loading: 'Creating new you...',
                        success: (response) => {
                            Cookies.set('user', { 
                                id: user.id,
                                username: user.username,
                                name: user.name,
                                email: user.email,
                                image: response.data.image,
                                token: user.token
                            }, { 
                                expires: (response.data.expires_in / 86400),
                                sameSite: 'strict'
                            });

                            setTimeout(() => history.go(0), 1000)
                            return response.data.message;
                        },
                        error: (error) => {
                            return error.response.data.message
                        }
                    }
                )
                break
            }
        }
    }

    const handleReset = () => {
        setUsername(user.username)
        setName(user.name)
        setEmail(user.email)
        setPassword('')
        setPasswordConfirmation('')
    }

    const handleSubmit = () => {
        const data = {
            username: username,
            name: name,
            email: email,
            password: password,
            password_confirmation: password_confirmation
        }
        username == user.username && delete data.username
        name == user.name && delete data.name
        email == user.email && delete data.email
        if(password === ''){
            delete data.password
            delete data.password_confirmation
        }

        if(Object.keys(data).length === 0 && data.constructor === Object)
            return toast.error('Nothing to update')

        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer'  + user.token
            },
            data: data,
            url: "https://orbimind.herokuapp.com/api/users/me/update"
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers })

        toast.promise(
            promise, 
            {
                loading: 'Updating your data...',
                success: (response) => {
                    Cookies.set('user', { 
                        id: response.data.user.id,
                        username: response.data.user.username,
                        name: response.data.user.name,
                        email: response.data.user.email,
                        image: response.data.user.image,
                        token: user.token
                    }, {
                        expires: (response.data.expires_in / 86400),
                        sameSite: 'strict'
                    });
                    setTimeout(() => history.go(0), 1000)
                    return response.data.message
                },
                error: (error) => {
                    return error.response.data.message
                }
            }
        )
    }

    return (
        <div className='userRoot'>
            <Helmet>
                <title>Account settings &#8739; Orbimind</title> 
            </Helmet>
            <div className='user'>
                <div className='settingsBlock'>
                    <h1>Account settings</h1>
                    <div id='settingsContent'>
                        <form onSubmit={ e => handleSubmit(e.preventDefault()) } onReset={ () => handleReset() }>
                            <label htmlFor="username">Username</label>
                            <input id="username" value={ username } onChange={ e => handleChange(e) } type="text" placeholder="Enter your username" />
                            
                            <label htmlFor="name">Name</label>
                            <input id="name" value={ name } onChange={ e => handleChange(e) } type="text" placeholder="Enter your name" />
                            
                            <label htmlFor="email">Email</label>
                            <input id="email" value={ email } onChange={ e => handleChange(e) } type="email" placeholder="Enter your email" />
                            
                            <label htmlFor="password">New password</label>
                            <input id="password" value={ password } onChange={ e => handleChange(e) } type="password" placeholder="Enter your new password" />
                            
                            <label htmlFor="password_confirmation">New password confirmation</label>
                            <input id="password_confirmation" value={ password_confirmation } onChange={ e => handleChange(e) } type="password" placeholder="Repeat your new password" />
                            <div>
                                <input type="submit" value="Update" />
                                <input type="reset" value="No, set it back!" />
                            </div>
                        </form>
                        <form>
                            <img src={ `https://d3djy7pad2souj.cloudfront.net/avatars/${ user.image }` } alt='avatarPreview'/>
                            <label htmlFor="image">Upload an image</label>
                            <input id="image" onChange={ e => handleChange(e) } type="file" accept="image/png, image/jpg, image/jpeg, image/gif" />
                        </form>
                    </div>
                </div>
                <div>
                    <UserBlock username={ username } logged={ true } toSettings={ false }/>
                </div>
            </div>
        </div>
    )
}
