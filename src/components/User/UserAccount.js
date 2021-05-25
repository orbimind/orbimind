import React, { Component } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';

import UserBlock from './UserBlock';
import './UserAccount.css';

export default class UserAccount extends Component {
    constructor(props) {
        super(props);
        this.user = Cookies.getJSON('user');
        this.state = {
            username: this.user.username,
            name: this.user.name,
            email: this.user.email,
            avatar: `https://d3djy7pad2souj.cloudfront.net/avatars/${ this.user.image }`,
            password: '',
            password_confirmation: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }
    
    handleChange(event) {
        switch(event.target.id){
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
            case 'image':{
                this.setState({ image: event.target.value });
                let formData = new FormData();
                let imagefile = document.querySelector('#image');
                formData.append("image", imagefile.files[0]);

                const api = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer'  + this.user.token,
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
                                id: this.user.id,
                                username: this.user.username,
                                name: this.user.name,
                                email: this.user.email,
                                image: response.data.image,
                                token: this.user.token,
                            }, { 
                                expires: (response.data.expires_in / 86400),
                                // secure: true,
                                sameSite: 'strict'
                            });

                            setTimeout(() => {
                                location.reload();
                            }, 1000);

                            return response.data.message;
                        },
                        error: (error) => {
                            return error.response.data.message;
                        }
                    }
                );
                break;
            }
        }
    }

    handleReset() {
        this.setState({
            username: this.user.username,
            name: this.user.name,
            email: this.user.email,
            password: '',
            password_confirmation: ''
        });
    }

    handleSubmit(event) {
        let data = {
            username: this.state.username,
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password_confirmation: this.state.password_confirmation
        }
        if(this.state.username == this.user.username)
            delete data.username;
        if(this.state.name == this.user.name)
            delete data.name;
        if(this.state.email == this.user.email)
            delete data.email;
        if(this.state.password === ''){
            delete data.password;
            delete data.password_confirmation;
        }

        if(Object.keys(data).length === 0 && data.constructor === Object){
            toast.error('Nothing to update');
            return;
        }

        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer'  + this.user.token,
            },
            data: data,
            url: "https://orbimind.herokuapp.com/api/users/me/update"
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers });

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
                        token: this.user.token
                    }, {
                        expires: (response.data.expires_in / 86400),
                        // secure: true,
                        sameSite: 'strict'
                    });

                    setTimeout(() => {
                        location.reload();
                    }, 1000);

                    return response.data.message;
                },
                error: (error) => {
                    return error.response.data.message;
                }
            }
        );

        event.preventDefault();
    }

    render() {
        return (
            <div className='userRoot'>
                <div className='user'>
                    <div className='settingsBlock'>
                        <h1>Account settings</h1>
                        <div id='settingsContent'>
                            <form onSubmit={ this.handleSubmit } onReset={ this.handleReset }>
                                <label htmlFor="username">Username</label>
                                <input id="username" value={ this.state.username } onChange={ this.handleChange } type="text" placeholder="Enter your username" />
                                
                                <label htmlFor="name">Name</label>
                                <input id="name" value={ this.state.name } onChange={ this.handleChange } type="text" placeholder="Enter your name" />
                                
                                <label htmlFor="email">Email</label>
                                <input id="email" value={ this.state.email } onChange={ this.handleChange } type="email" placeholder="Enter your email" />
                                
                                <label htmlFor="password">Password</label>
                                <input id="password" value={ this.state.password } onChange={ this.handleChange } type="password" placeholder="Enter your password" />
                                
                                <label htmlFor="password_confirmation">Password confirmation</label>
                                <input id="password_confirmation" value={ this.state.password_confirmation } onChange={ this.handleChange } type="password" placeholder="Enter repeat your password" />
                                <div>
                                    <input type="submit" value="Update" />
                                    <input type="reset" value="No, set it back!" />
                                </div>
                            </form>
                            <form>
                                <img src={ this.state.avatar } alt='avatarPreview'/>
                                <label htmlFor="image">Upload an image</label>
                                <input id="image" onChange={ this.handleChange } type="file" accept="image/png, image/jpg, image/jpeg, image/gif" />
                            </form>
                        </div>
                    </div>
                    <div>
                        <UserBlock username={ this.state.username } logged={ true } toSettings={ false }/>
                    </div>
                </div>
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
