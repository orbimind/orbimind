import React, { Component } from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import makeAnimated from 'react-select/animated';
import { withRouter } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';

import './CreatePost.css';

const animated = makeAnimated();

class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.post_id = this.props.match.params.post_id;
        this.state = {
            post: {},
            title: '',
            content: '',
            categories: []
        };

        if(this.post_id){
            const promise = axios.get("https://orbimind.herokuapp.com/api/posts/" + this.post_id);
            toast.promise(
                promise, 
                {
                    loading: 'Posting...',
                    success: (response) => {
                        this.setState({
                            title: response.data.title,
                            content: response.data.content,
                            categories: response.data.category_id
                        });
                        return "Loaded"
                    },
                    error: (error) => {
                        return error.response.data.message
                    }
                })
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCategoriesChange = this.handleCategoriesChange.bind(this);
    }

    // async () => {
    //     return await Promise.all(
    //         this.state.categories.map(
    //             id => {
    //                 return axios.get(`https://orbimind.herokuapp.com/api/categories/${id}`)
    //             }
    //         )
    //     )
    // }

    handleChange(event) {
        switch(event.target.id){
            case 'title':
                this.setState({
                    title: event.target.value
                });
                break;
            case 'content':
                this.setState({
                    content: event.target.value
                });
                break;
        }
    }

    handleCategoriesChange = categories_new => {
        this.setState({
            categories: categories_new || []
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        let category_id = [];
        for(let i = 0; i < this.state.categories.length; i++)
            category_id.push(this.state.categories[i].value);

        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '  + Cookies.getJSON('user').token
            },
            data: {
                title: this.state.title,
                content: this.state.content,
                category_id: category_id
            },
            url: this.post_id ? `https://orbimind.herokuapp.com/api/posts/${ this.post_id }` : "https://orbimind.herokuapp.com/api/posts"
        };
        let promise;
        if(this.post_id)
            promise = axios.patch(api.url, api.data, { headers: api.headers });
        else 
            promise = axios.post(api.url, api.data, { headers: api.headers });

        toast.promise(
            promise, 
            {
                loading: 'Posting...',
                success: (response) => {
                    setTimeout(() => {
                        location.href = `/posts/${response.data.id}`;
                    }, 2000);
                    if(this.post_id)
                        return 'Your post was updated!';
                    return 'Your post was created!';
                },
                error: (error) => {
                    if(error.response.data.errors) {
                        if(error.response.data.errors.title)
                            for(let i = 0; i < error.response.data.errors.title.length; i++)
                                toast.error(error.response.data.errors.title[i])

                        if(error.response.data.errors.content)
                            for(let i = 0; i < error.response.data.errors.content.length; i++)
                                toast.error(error.response.data.errors.content[i])

                        if(error.response.data.errors.category_id)
                            for(let i = 0; i < error.response.data.errors.category_id.length; i++)
                                toast.error(error.response.data.errors.category_id[i])
                    }
                    return error.response.data.message;
                }
            }
        );
    }

    loadOptions = async (data, callback) => {
        const response = await fetch(`https://orbimind.herokuapp.com/api/categories?search=${ data }`);
        const json = await response.json();

        callback(json.map(category=>({
            label: category.title,
            value: category.id
        })));
    }

    render() {
        return (
            <div className='createPostRoot'>
                <div className='createPostBox'>
                    {
                        this.post_id
                        ? <h1>Edit a post</h1>
                        : <h1>Create a post</h1>
                    }
                    <form onSubmit={ this.handleSubmit }>
                        <label htmlFor="title">Post title</label>
                        <input id="title" value={ this.state.title } onChange={ this.handleChange } type="text" placeholder="React problem with JSX rendering..." />
                        
                        <label htmlFor="content">Content</label>
                        <textarea id="content" value={ this.state.content } onChange={ this.handleChange } placeholder="Hey! I wanted to add this block to my react app..." />

                        <label htmlFor="categories">Select categories</label>
                        <AsyncSelect
                            id="categories"
                            isMulti
                            components={animated}
                            value={ this.state.categories }
                            onChange={ this.handleCategoriesChange }
                            placeholder="Type something.."
                            loadOptions={ this.loadOptions }
                            theme={theme => ({
                                ...theme,
                                colors: {
                                    primary25: '#988af2',
                                    primary: '#7c6aef',
                                    neutral0: '#f2f0fe',
                                    neutral90: 'white',
                                    neutral80: 'rgba(24, 24, 26, 0.8)',
                                    neutral60: '#7c6aef',
                                    neutral50: 'rgba(24, 24, 26, 0.5)',
                                    neutral40: '#7c6aef',
                                    neutral30: 'rgba(24, 24, 26, 0.6)',
                                    neutral20: 'rgba(24, 24, 26, 0.3)',
                                    danger: '#ea3c53',
                                    dangerLight: 'rgba(234, 60, 83, 0.2)',
                                    neutral10: 'rgba(24, 24, 26, 0.1)'
                                }
                            })}
                        />
                        {
                        this.post_id
                            ? <input type='submit' value='Update post' />
                            : <input type='submit' value='Create post' />
                        }
                    </form>
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

export default withRouter(CreatePost);
