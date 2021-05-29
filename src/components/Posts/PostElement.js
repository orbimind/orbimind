import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import TagsList from "../Tags/TagsList";
import './PostElement.css';

const style = {
    link: {
        color: "black",
        textDecoration: "none"
    }
}

export default function PostElement({ id, title, content, rating, date, user_id }) {
    const cUser = Cookies.getJSON('user');
    const [user, setUser] = useState([]);
    const [likes, setLikes] = useState([]);
    const [likeType, setLikeType] = useState(null);
    const [currentRating, setCurrentRating] = useState(rating);

    useEffect(() => {
        let cancel;

        axios.get("https://orbimind.herokuapp.com/api/users/" + user_id, {
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setUser(result.data);
        });

        return () => cancel(); 
    }, []);
    
    useEffect(() => {
        if(cUser) {
            let cancel;
            
            axios.get("https://orbimind.herokuapp.com/api/posts/" + id + "/like", {
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
                if(cUser.id == likes[i].user_id){
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
            url: `https://orbimind.herokuapp.com/api/posts/${ id }/like`
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

    return (
       <div className='postElement'>
            <div>
                <button id="like" onClick={ e => createLike(e.currentTarget.id) }>
                    {
                        (likeType === "like")
                        ?   <svg fill="#7c6aef" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835"><path d="M129.007 57.819c-4.68-4.68-12.499-4.68-17.191 0L3.555 165.803c-4.74 4.74-4.74 12.427 0 17.155 4.74 4.74 12.439 4.74 17.179 0l99.683-99.406 99.671 99.418c4.752 4.74 12.439 4.74 17.191 0 4.74-4.74 4.74-12.427 0-17.155L129.007 57.819z"/></svg>
                        :   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835"><path d="M129.007 57.819c-4.68-4.68-12.499-4.68-17.191 0L3.555 165.803c-4.74 4.74-4.74 12.427 0 17.155 4.74 4.74 12.439 4.74 17.179 0l99.683-99.406 99.671 99.418c4.752 4.74 12.439 4.74 17.191 0 4.74-4.74 4.74-12.427 0-17.155L129.007 57.819z"/></svg>
                    }
                </button>
                <span id='rating'>{ currentRating }</span>
                <button id="dislike" onClick={ e => createLike(e.currentTarget.id) }>
                    {
                        (likeType === "dislike")
                        ?   <svg fill="#7c6aef" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835"><path d="M129.007 57.819c-4.68-4.68-12.499-4.68-17.191 0L3.555 165.803c-4.74 4.74-4.74 12.427 0 17.155 4.74 4.74 12.439 4.74 17.179 0l99.683-99.406 99.671 99.418c4.752 4.74 12.439 4.74 17.191 0 4.74-4.74 4.74-12.427 0-17.155L129.007 57.819z"/></svg>
                        :   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835"><path d="M129.007 57.819c-4.68-4.68-12.499-4.68-17.191 0L3.555 165.803c-4.74 4.74-4.74 12.427 0 17.155 4.74 4.74 12.439 4.74 17.179 0l99.683-99.406 99.671 99.418c4.752 4.74 12.439 4.74 17.191 0 4.74-4.74 4.74-12.427 0-17.155L129.007 57.819z"/></svg>
                    }
                </button>
            </div>
            <div>
                <h1 id="postTitle"><Link to={`/posts/${ id }`} style={ style.link }>{ title }</Link></h1>
                <h3 id="postCreator">asked { date } by <Link className='linkUser' to={`/user/${ user.username }`}>{ user.username }</Link> { user.rating }</h3>
                <span id="postContent">{ content }</span>
                <TagsList post_id={ id }/>
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
    )
}
