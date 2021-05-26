import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import moment from 'moment';
import axios from 'axios';

import TagsList from '../Tags/TagsList';
import CommentList from '../Comments/CommentList';
import CommentInput from '../Comments/CommentInput';
import './SinglePost.css';
import '../Tags/Tags.css';

function createLike(e) {
    e.preventDefault();
    
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
            type: e.currentTarget.id
        },
        url: `https://orbimind.herokuapp.com/api/posts/${ e.currentTarget.value }/like`
    };
    const promise = axios.post(api.url, api.data, { headers: api.headers });

    toast.promise(
        promise, 
        {
            loading: 'Processing..',
            success: () => {
                location.reload();
            },
            error: (error) => {
                return error.response.data.message;
            }
        }
    );
}

export default function SinglePost() {
    let { post_id } = useParams();
    const user = Cookies.getJSON('user');

    const [likeType, setLikeType] = useState(null);
    const [post, setPost] = useState({});
    const [likes, setLikes] = useState([]);
    const [creator, setCreator] = useState({});
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

            axios.get("https://orbimind.herokuapp.com/api/users/" + post.user_id, {
                cancelToken: new axios.CancelToken(c => cancel = c)
            }).then(result => {
                setCreator(result.data);
            });
    
            return () => cancel(); 
        }
    }, [post]);
    
    useEffect(() => {
        let cancel;
        axios.get("https://orbimind.herokuapp.com/api/posts/" + post_id + "/like", {
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setLikes(result.data.map(p => p));
        });
        
        return () => cancel(); 
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
    
    return (
        <div className='singlePostRoot'>
            <div className='singlePostBlock'>
                <div className='singlePost'>
                    <div>
                        <div>
                            <button value={ post_id } id="like" onClick={ createLike }>
                                {
                                    (likeType === "like")
                                    ?   <svg fill="#7c6aef"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835">
                                            <path d="M129.007,57.819c-4.68-4.68-12.499-4.68-17.191,0L3.555,165.803c-4.74,4.74-4.74,12.427,0,17.155c4.74,4.74,12.439,4.74,17.179,0l99.683-99.406l99.671,99.418c4.752,4.74,12.439,4.74,17.191,0c4.74-4.74,4.74-12.427,0-17.155 L129.007,57.819z"/>
                                        </svg>
                                    :   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835">
                                            <path d="M129.007,57.819c-4.68-4.68-12.499-4.68-17.191,0L3.555,165.803c-4.74,4.74-4.74,12.427,0,17.155c4.74,4.74,12.439,4.74,17.179,0l99.683-99.406l99.671,99.418c4.752,4.74,12.439,4.74,17.191,0c4.74-4.74,4.74-12.427,0-17.155 L129.007,57.819z"/>
                                        </svg>
                                }
                            </button>
                            <span id='rating'>{ post.rating }</span>
                            <button value={ post_id } id="dislike" onClick={ createLike }>
                                {
                                    (likeType === "dislike")
                                    ?   <svg fill="#7c6aef"xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835">
                                            <path d="M129.007,57.819c-4.68-4.68-12.499-4.68-17.191,0L3.555,165.803c-4.74,4.74-4.74,12.427,0,17.155c4.74,4.74,12.439,4.74,17.179,0l99.683-99.406l99.671,99.418c4.752,4.74,12.439,4.74,17.191,0c4.74-4.74,4.74-12.427,0-17.155 L129.007,57.819z"/>
                                        </svg>
                                    :   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835">
                                            <path d="M129.007,57.819c-4.68-4.68-12.499-4.68-17.191,0L3.555,165.803c-4.74,4.74-4.74,12.427,0,17.155c4.74,4.74,12.439,4.74,17.179,0l99.683-99.406l99.671,99.418c4.752,4.74,12.439,4.74,17.191,0c4.74-4.74,4.74-12.427,0-17.155 L129.007,57.819z"/>
                                        </svg>
                                }
                            </button>
                        </div>
                        <div>
                            <button>
                                <svg viewBox="-21 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m448 232.148438c-11.777344 0-21.332031-9.554688-21.332031-21.332032 0-59.839844-23.296875-116.074218-65.601563-158.402344-8.339844-8.339843-8.339844-21.820312 0-30.164062 8.339844-8.339844 21.824219-8.339844 30.164063 0 50.371093 50.367188 78.101562 117.335938 78.101562 188.566406 0 11.777344-9.554687 21.332032-21.332031 21.332032zm0 0"/>
                                    <path d="m21.332031 232.148438c-11.773437 0-21.332031-9.554688-21.332031-21.332032 0-71.230468 27.734375-138.199218 78.101562-188.566406 8.339844-8.339844 21.824219-8.339844 30.164063 0 8.34375 8.34375 8.34375 21.824219 0 30.164062-42.304687 42.304688-65.597656 98.5625-65.597656 158.402344 0 11.777344-9.558594 21.332032-21.335938 21.332032zm0 0"/>
                                    <path d="m434.753906 360.8125c-32.257812-27.265625-50.753906-67.117188-50.753906-109.335938v-59.476562c0-75.070312-55.765625-137.214844-128-147.625v-23.042969c0-11.796875-9.558594-21.332031-21.332031-21.332031-11.777344 0-21.335938 9.535156-21.335938 21.332031v23.042969c-72.253906 10.410156-128 72.554688-128 147.625v59.476562c0 42.21875-18.496093 82.070313-50.941406 109.503907-8.300781 7.105469-13.058594 17.429687-13.058594 28.351562 0 20.589844 16.746094 37.335938 37.335938 37.335938h352c20.585937 0 37.332031-16.746094 37.332031-37.335938 0-10.921875-4.757812-21.246093-13.246094-28.519531zm0 0"/>
                                    <path d="m234.667969 512c38.632812 0 70.953125-27.542969 78.378906-64h-156.757813c7.421876 36.457031 39.742188 64 78.378907 64zm0 0"/>
                                </svg>
                            </button>
                            <button>
                                <svg viewBox="0 -10 511.98685 511" xmlns="http://www.w3.org/2000/svg">
                                    <path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div>
                        <h1>{ post.title }</h1>
                        <span>Asked { moment(post.created_at).fromNow() } by <Link to={`/users/${ creator.id }`} className="linkUser"> { creator.username } </Link><span id="rating">{ creator.rating }</span></span>
                        <p>{ post.content }</p>
                        <TagsList post_id={ post_id }/>
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
