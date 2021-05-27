import React, { Component } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import './CommentInput.css';

export default class CommentInput extends Component {
    constructor(props) {
        super(props);
        this.user = Cookies.getJSON('user');
        this.state = {
            content: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        switch(event.target.name){
            case 'content':
                this.setState({
                    content: event.target.value
                });
                break;
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '  + this.user.token
            },
            data: {
                content: this.state.content
            },
            url: `https://orbimind.herokuapp.com/api/posts/${ this.props.post_id }/comments`
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers });

        toast.promise(
            promise, 
            {
                loading: 'Leaving your mark...',
                success: (response) => {
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                    return 'Your comment was created!';
                },
                error: (error) => {
                    if(error.response.data.errors.content)
                        toast.error(error.response.data.errors.content[0])
                    return error.response.data.message;
                }
            }
        );
    }

    render() {
        if(!this.user)
            return (
                <div className='commentInput notLogged'>
                    <span>You must be logged in to comment on this post :c</span>
                    <Link to='/login'>Log in</Link>
                </div>
            )
        return (
            <div className='commentInput'>
                <img src={`https://d3djy7pad2souj.cloudfront.net/avatars/${ this.user.image }`} alt="avatar" />
                <form onSubmit={ this.handleSubmit }>
                    <textarea value={ this.state.content } onChange={ this.handleChange } name='content' type="text" placeholder="Enter a comment.." />
                    <div>
                        <span>Comment as <b>{ this.user.username }</b></span>
                        <input type='submit' value='Comment on this post' />
                    </div>
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
