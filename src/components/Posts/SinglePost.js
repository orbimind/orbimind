import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import Cookies from 'js-cookie'
import moment from 'moment'
import axios from 'axios'

import TagsList from '../Tags/TagsList'
import CommentList from '../Comments/CommentList'
import CommentInput from '../Comments/CommentInput'
import './SinglePost.css'
import '../Tags/Tags.css'

import { Bell, Star, Edit, Trash, Upvote } from '../../assets/Misc.jsx'

function deletePost(token, id){
    const api = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${ token }`,
        },
        url: `https://orbimind.herokuapp.com/api/posts/${ id }`
    };
    const promise = axios.delete(api.url, { headers: api.headers });

    toast.promise(
        promise, 
        {
            loading: 'Processing..',
            success: () => {
                setTimeout(location.href = '/posts', 1000);
                return "Deleted!";
            },
            error: (error) => {
                return error.response.data.message;
            }
        }
    );
}

function ownerEvents(e){
    e.preventDefault();

    const user = Cookies.getJSON('user');
    const post_id = e.currentTarget.value;
    switch(e.currentTarget.id){
        case 'delete':
            toast((t) => (
                <span>
                  Are you sure you want to delete this post? &nbsp;
                  <button style={{ 
                    padding: "6px", 
                    backgroundColor: "#ea3c53", 
                    color: "white",
                    fontWeight: "500",
                    borderRadius: "6px"
                    }} 
                        onClick={() => {
                            deletePost(user.token, post_id)
                            toast.dismiss(t.id)
                        }
                    }>
                    Totally, delete it
                  </button>
                </span>
            ),
            {
                duration: 8000,
                style: {
                    minWidth: '440px'
                },
            });
        break;
    }
    
}

export default function SinglePost() {
    const { post_id } = useParams();
    const user = Cookies.getJSON('user');
    let isAuthor = false;

    const [post, setPost] = useState({});
    const [currentRating, setCurrentRating] = useState(0);
    const [likes, setLikes] = useState([]);
    const [creator, setCreator] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [likeType, setLikeType] = useState(null);
    const [favorite, setFavorite] = useState(false);
    const [subscription, setSubscription] = useState(false);

    ///
    ///
    ///

    useEffect(() => {
        let cancel;
        axios.get("https://orbimind.herokuapp.com/api/posts/" + post_id, {
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setPost(result.data);
        });
        
        return () => cancel(); 
    }, []);
    useEffect(() => {
        if ('user_id' in post) {
            let cancel;

            setCurrentRating(post.rating)

            axios.get("https://orbimind.herokuapp.com/api/users/" + post.user_id, {
                cancelToken: new axios.CancelToken(c => cancel = c)
            }).then(result => {
                setCreator(result.data);
            });
    
            return () => cancel(); 
        }
    }, [post]);
    
    ///
    ///
    ///

    useEffect(() => {
        if(user) {
            let cancel;
            
            axios.get("https://orbimind.herokuapp.com/api/posts/" + post_id + "/like", {
                cancelToken: new axios.CancelToken(c => cancel = c)
            }).then(result => {
                setLikes(result.data);
            });
            
            return () => cancel(); 
        }
    }, []);
    useEffect(() => {
        if(length in likes > 0) {
            for(let i = 0; i < likes.length; i++) {
                if(user.id == likes[i].user_id){
                    if(likes[i].type === "like")
                        setLikeType("like");
                    else 
                        setLikeType("dislike");
                }
            }
        }
    }, [likes]);

    ///
    ///
    ///

    useEffect(() => {
        if(user){
            let cancel;

            axios.get("https://orbimind.herokuapp.com/api/users/" + user.username, {
                cancelToken: new axios.CancelToken(c => cancel = c)
            }).then(result => {
                setCurrentUser(result.data);
            });
            
            return () => cancel(); 
        }
    }, []);
    useEffect(() => {
        if(currentUser.faves)
            for(let i = 0; i < currentUser.faves.length; i++)
                if(currentUser.faves[i] == post_id)
                    setFavorite(true);
        if(currentUser.subs)
            for(let i = 0; i < currentUser.subs.length; i++)
                if(currentUser.subs[i] == post_id)
                    setSubscription(true);
    }, [currentUser]);
    if(user && user.id == post.user_id)
            isAuthor = true

    function createLike(type) {
        if(!user){
            toast.error("You must be logged in to leave a like or dislike");
            return;
        }
    
        const api = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer'  + user.token,
            },
            data: {
                type: type
            },
            url: `https://orbimind.herokuapp.com/api/posts/${ post_id }/like`
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers });
    
        toast.promise(
            promise, 
            {
                loading: 'Processing..',
                success: (response) => {
                    if(response.data.message.includes('deleted')){
                        setLikeType(null)
                        setCurrentRating(prev => prev += type === 'like' ? -1 : 1);
                    } else if(response.data.message.includes('switched')){
                        setLikeType(type)
                        setCurrentRating(prev => prev += type === 'like' ? 2 : -2);
                    } else {
                        setLikeType(type)
                        setCurrentRating(prev => prev += type === 'like' ? 1 : -1);
                    }
                    return response.data.message
                },
                error: (error) => {
                    return error.response.data.message;
                }
            },
            {
              success: {
                style: {
                    display: 'none'
                },
              },
            }
        );
    }

    function handleEvents(id) {
        const user = Cookies.getJSON('user');
        if(!user){
            toast.error("You must be logged in to subscribe or add to favorites");
            return;
        }
    
        const api = {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer'  + user.token,
            },
            data: {},
            url: `https://orbimind.herokuapp.com/api/posts/${ post_id }/${ id }`
        };
        const promise = axios.post(api.url, api.data, { headers: api.headers })
    
        toast.promise(
            promise, 
            {
                loading: 'Processing..',
                success: (response) => {
                    if(id == 'favorite'){
                        if(response.data.message.includes('deleted'))
                            setFavorite(false)
                        else 
                            setFavorite(true)
                    }
                    else 
                        if(response.data.message.includes('deleted'))
                            setSubscription(false)
                        else 
                            setSubscription(true)
                    return response.data.message
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
        );
    }

    return (
        <div className='singlePostRoot'>
            <div className='singlePostBlock'>
                <div className='singlePost'>
                    <div>
                        <div>
                            <button id="like" onClick={e => createLike(e.currentTarget.id)}>
                                {
                                    (likeType === "like")
                                    ?   <Upvote fill='#7c6aef' />
                                    :   <Upvote />
                                }
                            </button>
                            <span id='rating'>{ currentRating }</span>
                            <button id="dislike" onClick={e => createLike(e.currentTarget.id)}>
                                {
                                    (likeType === "dislike")
                                    ?   <Upvote fill='#7c6aef' />
                                    :   <Upvote />
                                }
                            </button>
                        </div>
                        <div>
                            <button id="subscribe" onClick={e => handleEvents(e.currentTarget.id)}>
                                {
                                    subscription
                                    ?   <Bell fill='#7c6aef'/>
                                    :   <Bell />

                                }
                            </button>
                            <button id="favorite" onClick={e => handleEvents(e.currentTarget.id)}>
                                {
                                    favorite
                                    ?   <Star fill='#ffd338'/>
                                    :   <Star />
                                }
                            </button>
                            {
                                isAuthor &&
                                <Link to={`create/${ post_id }`} id="edit">
                                    <Edit />
                                </Link>
                            }
                            {
                                isAuthor &&
                                <button value={ post_id } id="delete" onClick={ ownerEvents }>
                                    <Trash fill='rgba(234, 60, 83, 0.5)' />
                                </button>
                            }
                        </div>
                    </div>
                    <div>
                        <div>
                            <h1>{ post.title }</h1>
                            <div className='markdownText'><ReactMarkdown>{ post.content }</ReactMarkdown></div>
                            <TagsList post_id={ post_id }/>
                        </div>
                        <div>
                            <span>Asked { moment(post.created_at).fromNow() } by <Link to={`/user/${ creator.username }`} className="linkUser"> { creator.username } </Link><span id="rating">{ creator.rating }</span></span>
                            <span>{ (post.created_at != post.updated_at) && 'Last updated ' + moment(post.updated_at).fromNow() }</span>
                        </div>
                    </div>
                </div>
                <CommentList post_id={ post_id } />
                <CommentInput post_id={ post_id }/>
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
        </div>
    );
}
