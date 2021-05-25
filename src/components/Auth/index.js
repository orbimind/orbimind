import React, { Component } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import logo from '../../assets/logo.svg';
import './Auth.css';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        switch(event.target.name){
            case 'username':
                this.setState({
                    username: event.target.value
                });
                break;
            case 'password':
                this.setState({
                    password: event.target.value
                });
                break;
        }
    }
    
    handleSubmit(event) {
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                username: this.state.username,
                password: this.state.password
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
                        // secure: true,
                        sameSite: 'strict'
                    });
                    setTimeout(() => {
                        location.href = '/posts';
                    }, 1000);
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
        
        event.preventDefault();
    }

    render() {

        return (
            <div className="authScreen">
                <img src={logo} alt='logo' />
                <h1>Welcome back!</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Enter your username" name="username" value={this.state.username} onChange={this.handleChange} required />
                    <input type="password" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} required />
                    <div><Link to="/forgot-password" id="forgot">Forgot password?</Link></div>
                    <input type="submit" value="Log in" />
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
}

export class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            name: '',
            email: '',
            password: '',
            confirm_password: ''
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        switch(event.target.name){
            case 'username':
                this.setState({
                    username: event.target.value
                });
                break;
            case 'name':
                this.setState({
                    name: event.target.value
                });
                break;
            case 'email':
                this.setState({
                    email: event.target.value
                });
                break;
            case 'password':
                this.setState({
                    password: event.target.value
                });
                break;
            case 'confirm_password':
                this.setState({
                    confirm_password: event.target.value
                });
                break;
        }
    }
    
    handleSubmit(event) {
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                username: this.state.username,
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                password_confirmation: this.state.confirm_password
            },
            url: "https://orbimind.herokuapp.com/api/auth/register"
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers });

        toast.promise(
            promise, 
            {
                loading: 'Registering...',
                success: (response) => {
                    setTimeout(() => {
                        location.href = '/login';
                    }, 2000);
                    return response.data.message;
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
                    return error.response.data.message;
                }
            }
        );

        event.preventDefault();
    }

    render() {
        return (
            <div className="authScreen">
                <img src={logo} alt='logo' />
                <h1>Become a part!</h1>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.username} onChange={this.handleChange} name="username" placeholder="Enter your username" required/>
                    <input type="text" value={this.state.name} onChange={this.handleChange} name="name" placeholder="Enter your name" required/>
                    <input type="email" value={this.state.email} onChange={this.handleChange} name="email" placeholder="Enter your email" required/>
                    <input type="password" value={this.state.password} onChange={this.handleChange} name="password" placeholder="Enter your password" required/>
                    <input type="password" value={this.state.confirm_password} onChange={this.handleChange} name="confirm_password" placeholder="Repeat your password" required/>
                    <input type="submit" value="Become a part" />
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
}

export class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            email: event.target.value
        });
    }
    
    handleSubmit(event) {
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                email: this.state.email
            },
            url: "https://orbimind.herokuapp.com/api/auth/password-reset"
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers });

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
        );

        event.preventDefault();
    }
    render() {
        return (
            <div className="authScreen">
                <img src={logo} alt='logo' />
                 <h1>Let's get your password back!</h1>
                 <form onSubmit={this.handleSubmit}>
                     <input type="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter your email" required />
                     <input type="submit" value="Send email" />
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
}
