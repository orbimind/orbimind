import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from "react-router-dom"
import makeAnimated from 'react-select/animated'
import toast, { Toaster } from 'react-hot-toast'
import AsyncSelect from 'react-select/async'
import Cookies from 'js-cookie'
import axios from 'axios'

import { Markdown } from '../../assets/Misc.jsx'
import './CreatePost.css'

const animated = makeAnimated();

export default function CreatePost() {
    const history = useHistory()
    const { post_id } = useParams()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [categories, setCategories] = useState([])
    
    if(post_id) {
        useEffect(() => {
            const promise = axios.get("https://orbimind.herokuapp.com/api/posts/" + post_id);
            toast.promise(
                promise, 
                {
                    loading: 'Loading...',
                    success: (response) => {
                        setTitle(response.data.title)
                        setContent(response.data.content)
                    },
                    error: (error) => {
                        return error.response.data.message
                    }
                },
                {
                success: {
                    style: {
                        display: 'none'
                    },
                },
                }
            )
            const promise2 = axios.get("https://orbimind.herokuapp.com/api/posts/" + post_id + "/categories");
            toast.promise(
                promise2, 
                {
                    loading: 'Loading...',
                    success: (response) => {
                        setCategories(response.data)
                    },
                    error: (error) => {
                        return error.response.data.message
                    }
                },
                {
                success: {
                    style: {
                        display: 'none'
                    },
                },
                }
            )
        }, [])
    }

    const handleChange = e => {
        switch(e.target.id){
            case 'title':
                setTitle(e.target.value)
                break
            case 'content':
                setContent(e.target.value)
                break
        }
    }

    const handleCategoriesChange = categories => setCategories(categories || [])

    const handleSubmit = () => {
        let category_id = [];
        for(let i = 0; i < categories.length; i++)
            category_id.push(categories[i].value);

        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer '  + Cookies.getJSON('user').token
            },
            data: {
                title: title,
                content: content,
                category_id: category_id
            },
            url: post_id ? `https://orbimind.herokuapp.com/api/posts/${ post_id }` : "https://orbimind.herokuapp.com/api/posts"
        };
        let promise;
        if(post_id)
            promise = axios.patch(api.url, api.data, { headers: api.headers });
        else 
            promise = axios.post(api.url, api.data, { headers: api.headers });

        toast.promise(
            promise, 
            {
                loading: 'Posting...',
                success: (response) => {
                    setTimeout(() => history.push(`/posts/${response.data.id}`), 1500);
                    if(post_id)
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

    const loadOptions = async (data, callback) => {
        const response = await fetch(`https://orbimind.herokuapp.com/api/categories?search=${ data }`);
        const json = await response.json();

        callback(json.map(category=>({
            label: category.title,
            value: category.id
        })));
    }

    return (
        <div className='createPostRoot'>
            <div className='createPostBox'>
                {
                    post_id
                    ? <h1>Edit a post</h1>
                    : <h1>Create a post</h1>
                }
                <form onSubmit={ e => handleSubmit(e.preventDefault()) }>
                    <label htmlFor="title">Post title</label>
                    <input id="title" value={ title } onChange={ e => handleChange(e) } type="text" placeholder="React problem with JSX rendering..." />
                    
                    <label htmlFor="content">Content</label>
                    <textarea id="content" value={ content } onChange={ e => handleChange(e) } placeholder="Hey! I wanted to add this block to my react app..." />
                    <a id='markdown' href='https://guides.github.com/features/mastering-markdown/' target='_black' rel='noopener'>
                        <Markdown /> 
                        <span>Styling with Markdown is supported</span>
                    </a>

                    <label htmlFor="categories">Select categories</label>
                    <AsyncSelect
                        id="categories"
                        isMulti
                        components={animated}
                        value={ categories }
                        onChange={ categories => handleCategoriesChange(categories) }
                        placeholder="Type something.."
                        loadOptions={ (data, callback) => loadOptions(data, callback) }
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
                    post_id
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
