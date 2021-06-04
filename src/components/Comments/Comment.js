import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import moment from 'moment'
import axios from 'axios'

import { Upvote, Edit, Trash, Checkmark, CheckmarkFilled } from '../../assets/Misc.jsx'
import CommentEdit from './CommentEdit'
import '../Markdown.css'

export default function Comment({ comment, post }) {
    const [creator, setCreator] = useState([])
    const [likeType, setLikeType] = useState(null)
    const [currentRating, setCurrentRating] = useState(comment.rating)
    const [likes, setLikes] = useState([])
    const [contentEditable, setContentEditable] = useState(<ReactMarkdown>{ comment.content }</ReactMarkdown>)
    const user = Cookies.getJSON('user')
    let isAuthor = false

    useEffect(() => {
        let cancel;
        axios.get("https://orbimind.herokuapp.com/api/users/" + comment.user_id, {
          cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setCreator(result.data)
        });

        return () => cancel()
    }, []);

    useEffect(() => {
        if(user) {
            let cancel;
            axios.get("https://orbimind.herokuapp.com/api/comments/" + comment.id + "/like", {
                cancelToken: new axios.CancelToken(c => cancel = c)
            }).then(result => {
                setLikes(result.data);
            });
            
            return () => cancel(); 
        }
    }, []);

    useEffect(() => {
        if(length in likes > 0){
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

    function createLike(type) {
         const user = Cookies.getJSON('user');
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
            url: `https://orbimind.herokuapp.com/api/comments/${ comment.id }/like`
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
    if(user && user.id == comment.user_id)
            isAuthor = true

    function ownerEvents(type){
        switch(type){
            case 'delete':
                toast((t) => (
                    <span>
                        Are you sure you want to delete your comment? &nbsp;
                        <button style={{ 
                        padding: "6px", 
                        backgroundColor: "#ea3c53", 
                        color: "white",
                        fontWeight: "500",
                        borderRadius: "6px"
                        }} 
                            onClick={() => {
                                const api = {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Authorization': `Bearer ${ user.token }`,
                                    },
                                    url: `https://orbimind.herokuapp.com/api/comments/${ comment.id }`
                                };
                                const promise = axios.delete(api.url, { headers: api.headers });
                            
                                toast.promise(
                                    promise, 
                                    {
                                        loading: 'Processing..',
                                        success: () => {
                                            setTimeout(location.reload(), 1000);
                                            return "Deleted!";
                                        },
                                        error: (error) => {
                                            return error.response.data.message;
                                        }
                                    }
                                );
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
            case 'edit':
                setContentEditable(<CommentEdit content={ comment.content } comment_id={ comment.id } setContentEditable={ setContentEditable } />)
                break;
            case 'checkmark':
                if(post.user_id !== user.id)
                    return
                toast((t) => (
                    <span>
                        Mark this comment as best? &nbsp;
                        <button style={{ 
                        padding: "6px", 
                        backgroundColor: "#7c6aef", 
                        color: "white",
                        fontWeight: "500",
                        borderRadius: "6px"
                        }} 
                            onClick={() => {
                                const api = {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Authorization': `Bearer ${ user.token }`,
                                    },
                                    url: `https://orbimind.herokuapp.com/api/comments/${ comment.id }/best`
                                };
                                const promise = axios.get(api.url, { headers: api.headers });
                            
                                toast.promise(
                                    promise, 
                                    {
                                        loading: 'Processing..',
                                        success: () => {
                                            setTimeout(location.reload(), 1000);
                                            return "Yay, you found an answer!";
                                        },
                                        error: (error) => {
                                            return error.response.data.message;
                                        }
                                    }
                                );
                                toast.dismiss(t.id)
                            }
                        }>
                        Yes!
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

    return (
        <div className="singleComment">
            <div>
                <button id="like" onClick={ e => createLike(e.currentTarget.id) }>
                {
                    (likeType === "like")
                    ?   <Upvote fill="#7c6aef" />
                    :   <Upvote />
                }
                </button>
                <span id='rating'>{ currentRating }</span>
                <button id="dislike" onClick={ e => createLike(e.currentTarget.id) }>
                {
                    (likeType === "dislike")
                    ?   <Upvote fill="#7c6aef" />
                    :   <Upvote />
                }
                </button>
                {
                    (comment.best) 
                    &&
                    <button id="checkmark" onClick={e => ownerEvents(e.currentTarget.id) }>
                        <CheckmarkFilled fill='#7c6aef' />
                    </button>
                }
                {
                    post.status 
                    &&
                    (post.user_id === user.id) &&
                        <button id="checkmark" onClick={e => ownerEvents(e.currentTarget.id) }>
                            <Checkmark fill='rgba(165, 165, 165, 0.5)' id='checkmark'/>
                        </button>
                }
            </div>
            <div>
                <div className='markdownText'>
                    { contentEditable }
                </div>
                <div>
                    <div>
                        <span>Answered { moment(comment.created_at).fromNow() } by <Link className="linkUser" to={`/user/${ creator.username }`}>{ creator.username }</Link> <span id="rating">{ creator.rating }</span></span>
                        {
                            isAuthor &&
                            <button style={{margin: '0 0 0 6px'}} id="edit" onClick={e => ownerEvents(e.currentTarget.id) }>
                                <Edit width={12}/>
                            </button>
                        }
                        {
                            isAuthor &&
                            <button style={{margin: '0 0 0 6px'}} id="delete" onClick={e => ownerEvents(e.currentTarget.id) }>
                                <Trash width={12} fill='rgba(234, 60, 83, 0.5)' />
                            </button>
                        }
                    </div>
                    <span>{ (comment.created_at != comment.updated_at) && 'Last updated ' + moment(comment.updated_at).fromNow() }</span>
                </div>
            </div>
        </div>
    );
}
