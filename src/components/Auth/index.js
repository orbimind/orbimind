import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Cookies from 'js-cookie'
import axios from 'axios'

import { Logo } from '../../assets/Brand.jsx'
import './Auth.css'
import '../Misc/Animations.css'

export function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleChange = e => {
        switch(e.target.name){
            case 'username': setUsername(e.target.value); break
            case 'password': setPassword(e.target.value); break
        }
    }

    const handleSubmit = () => {
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                username: username,
                password: password
            },
            url: "https://orbimind.herokuapp.com/api/auth/login"
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers });

        toast.promise(
            promise, 
            {
                loading: 'Logging in...',
                success: (response) => {
                    Cookies.set('user', { 
                        id: response.data.user.id,
                        username: response.data.user.username,
                        name: response.data.user.name,
                        email: response.data.user.email,
                        image: response.data.user.image,
                        token: response.data.token,
                    }, { 
                        expires: (response.data.expires_in / 86400),
                        sameSite: 'strict'
                    });
                    setTimeout(() => location.replace('/posts'), 1500);
                    return response.data.message;
                },
                error: (error) => {
                    if(error.response.data.errors) {
                        if(error.response.data.errors.username)
                            for(let i = 0; i < error.response.data.errors.username.length; i++)
                                toast.error(error.response.data.errors.username[i])
                        if(error.response.data.errors.password)
                            for(let i = 0; i < error.response.data.errors.password.length; i++)
                                toast.error(error.response.data.errors.password[i])
                    }
                    return error.response.data.message;
                }
            }
        );
    }

    return (
        <div className="authScreen unselectable">
            <Helmet>
                <title>Login &#8739; Orbimind</title>
            </Helmet>
            <Logo className='popTop' />
            <h1 className='fadeIn'>Welcome back!</h1>
            <form onSubmit={ e => handleSubmit(e.preventDefault()) }>
                <input className='widthUpAuth' type="text" placeholder="Enter your username" name="username" value={ username } onChange={ handleChange } required />
                <input className='widthUpAuth' type="password" placeholder="Enter your password" name="password" value={ password } onChange={ handleChange } required />
                <div><Link to="/forgot-password" id="forgot">Forgot password?</Link></div>
                <input className='fadeIn' type="submit" value="Log in" />
                <span>Not a member yet? <Link to="/register">Sing up</Link>!</span>
            </form>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        padding: '10px',
                    },
                    duration: 2000,
                    success: {
                        iconTheme: {
                            primary: '#7c6aef',
                            secondary: '#FFF',
                        },
                    },
                    error: { duration: 4000 }
                }}
            />
        </div>
    )
}

export function Register() {
    const history = useHistory()
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password_confirmation, setPasswordConfirmation] = useState('')

    const handleChange = e => {
        switch(e.target.name){
            case 'username': setUsername(e.target.value); break
            case 'name': setName(e.target.value); break
            case 'email': setEmail(e.target.value); break
            case 'password': setPassword(e.target.value); break
            case 'password_confirmation': setPasswordConfirmation(e.target.value); break
        }
    }

    const handleSubmit = () => {
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                username: username,
                name: name,
                email: email,
                password: password,
                password_confirmation: password_confirmation
            },
            url: "https://orbimind.herokuapp.com/api/auth/register"
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers });

        toast.promise(
            promise, 
            {
                loading: 'Registering...',
                success: (response) => {
                    setTimeout(() => history.push('/login'), 1500)
                    return response.data.message
                },
                error: (error) => {
                    if(error.response.data.errors) {
                        if(error.response.data.errors.username)
                            for(let i = 0; i < error.response.data.errors.username.length; i++)
                                toast.error(error.response.data.errors.username[i])

                        if(error.response.data.errors.name)
                            for(let i = 0; i < error.response.data.errors.name.length; i++)
                                toast.error(error.response.data.errors.name[i])

                        if(error.response.data.errors.email)
                            for(let i = 0; i < error.response.data.errors.email.length; i++)
                                toast.error(error.response.data.errors.email[i])

                        if(error.response.data.errors.password)
                            for(let i = 0; i < error.response.data.errors.password.length; i++)
                                toast.error(error.response.data.errors.password[i])
                    }
                    return error.response.data.message
                }
            }
        );
    }

    return (
        <div className="authScreen">
            <Helmet>
                <title>Register &#8739; Orbimind</title>
            </Helmet>
            <Logo className='popTop' />
            <h1 className='fadeIn'>Become a part!</h1>
            <form className='widthUpAuth' onSubmit={ e => handleSubmit(e.preventDefault()) }>
                <input className='widthUpAuth' type="text" value={ username } onChange={ handleChange } name="username" placeholder="Enter your username" required/>
                <input className='widthUpAuth' type="text" value={ name } onChange={ handleChange } name="name" placeholder="Enter your name" required/>
                <input className='widthUpAuth' type="email" value={ email } onChange={ handleChange } name="email" placeholder="Enter your email" required/>
                <input className='widthUpAuth' type="password" value={ password } onChange={ handleChange } name="password" placeholder="Enter your password" required/>
                <input className='widthUpAuth' type="password" value={ password_confirmation } onChange={ handleChange } name="password_confirmation" placeholder="Repeat your password" required/>
                <input className='fadeIn' type="submit" value="Become a part" />
                <span>Already registered? <Link to="/login">Log in</Link>!</span>
            </form>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        padding: '10px',
                    },
                    duration: 2000,
                    success: {
                        iconTheme: {
                            primary: '#7c6aef',
                            secondary: '#FFF',
                        },
                    },
                    error: { duration: 4000 }
                }}
            />
        </div>
    )
}

export function ForgotPassword() {
    const [email, setEmail] = useState('')

    const handleChange = event => setEmail(event.target.value)

    const handleSubmit = () => {
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                email: email
            },
            url: "https://orbimind.herokuapp.com/api/auth/password-reset"
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers })

        toast.promise(
            promise, 
            {
                loading: 'Sending magic letter..',
                success: (response) => response.data.message,
                error: (error) => {
                    if(error.response.data.errors) {
                        if(error.response.data.errors.email)
                            for(let i = 0; i < error.response.data.errors.email.length; i++)
                                toast.error(error.response.data.errors.email[i])
                    }
                    return error.response.data.message;
                }
            }
        )
    }

    return (
        <div className="authScreen unselectable">
            <Helmet>
                <title>Forgot Password &#8739; Orbimind</title>
            </Helmet>
            <Logo className='popTop' />
            <h1 className='fadeIn'>Let's get your password back!</h1>
            <form onSubmit={ e => handleSubmit(e.preventDefault()) }>
                <input className='widthUpAuth' type="email" value={ email } onChange={ handleChange } placeholder="Enter your email" required />
                <input className='fadeIn' type="submit" value="Send email" />
                <span><Link to="/login">Back</Link></span>
            </form>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        padding: '10px',
                    },
                    duration: 2000,
                    success: {
                        iconTheme: {
                            primary: '#7c6aef',
                            secondary: '#FFF',
                        },
                    },
                    error: { duration: 4000 }
                }}
            />
        </div>
    )
}

export function ResetPassword() {
    const history = useHistory()
    const { token } = useParams()
    const [password, setPassword] = useState('')
    const [password_confirmation, setPasswordConfirmation] = useState('')

    const onChange = (event) => {
        switch(event.target.id) {
            case 'password':
                setPassword(event.target.value)
                break;
            case 'password_c':
                setPasswordConfirmation(event.target.value)
                break;
        }
    };

    const onSubmit = () => {
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                password: password,
                password_confirmation: password_confirmation
            },
            url: "https://orbimind.herokuapp.com/api/auth/password-reset/" + token
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers });

        toast.promise(
            promise, 
            {
                loading: 'Updating..',
                success: (response) => {
                    setTimeout(() => history.push('/login'), 1500)
                    return response.data.message
                },
                error: (error) => {
                    if(error.response.data.errors) {
                        if(error.response.data.errors.password)
                            for(let i = 0; i < error.response.data.errors.password.length; i++)
                                toast.error(error.response.data.errors.password[i])
                        if(error.response.data.errors.password_confirmation)
                            for(let i = 0; i < error.response.data.errors.password_confirmation.length; i++)
                                toast.error(error.response.data.errors.password_confirmation[i])
                    }
                    return error.response.data.message;
                }
            }
        );
    }

    return (
        <div className="authScreen unselectable">
            <Helmet>
                <title>Reset Password &#8739; Orbimind</title>
            </Helmet>
            <Logo className='popTop' />
            <h1 className='fadeIn'>Reset password</h1>
            <form onSubmit={ e => onSubmit(e.preventDefault()) }>
                <input className='widthUpAuth' type="password" id='password' value={ password } onChange={ onChange } placeholder="Enter your new password" required />
                <input className='widthUpAuth' type="password" id='password_c' value={ password_confirmation } onChange={ onChange } placeholder="Repeat your password" required />
                <input className='fadeIn' type="submit" value="Update password" />
                <span><Link to="/login">Back</Link></span>
            </form>
            <Toaster
                position="bottom-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        padding: '10px',
                    },
                    duration: 2000,
                    success: {
                        iconTheme: {
                            primary: '#7c6aef',
                            secondary: '#FFF',
                        },
                    },
                    error: { duration: 4000 }
                }}
            />
        </div>
    )
}
