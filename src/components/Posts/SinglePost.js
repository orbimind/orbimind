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

function handleEvents(e) {
    e.preventDefault();

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
        url: `https://orbimind.herokuapp.com/api/posts/${ e.currentTarget.value }/${ e.currentTarget.id }`
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

function ownerEvents(e){
    e.preventDefault();
}

export default function SinglePost() {
    let { post_id } = useParams();
    const user = Cookies.getJSON('user');

    const [post, setPost] = useState({});
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
                setLikes(result.data.map(p => p));
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
    
    return (
        <div className='singlePostRoot'>
            <div className='singlePostBlock'>
                <div className='singlePost'>
                    <div>
                        <div>
                            <button value={ post_id } id="like" onClick={ createLike }>
                                {
                                    (likeType === "like")
                                    ?   <svg fill="#7c6aef" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835">
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
                                    ?   <svg fill="#7c6aef" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835">
                                            <path d="M129.007,57.819c-4.68-4.68-12.499-4.68-17.191,0L3.555,165.803c-4.74,4.74-4.74,12.427,0,17.155c4.74,4.74,12.439,4.74,17.179,0l99.683-99.406l99.671,99.418c4.752,4.74,12.439,4.74,17.191,0c4.74-4.74,4.74-12.427,0-17.155 L129.007,57.819z"/>
                                        </svg>
                                    :   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835">
                                            <path d="M129.007,57.819c-4.68-4.68-12.499-4.68-17.191,0L3.555,165.803c-4.74,4.74-4.74,12.427,0,17.155c4.74,4.74,12.439,4.74,17.179,0l99.683-99.406l99.671,99.418c4.752,4.74,12.439,4.74,17.191,0c4.74-4.74,4.74-12.427,0-17.155 L129.007,57.819z"/>
                                        </svg>
                                }
                            </button>
                        </div>
                        <div>
                            <button value={ post_id } id="subscribe" onClick={ handleEvents }>
                                {
                                    subscription
                                    ?   <svg fill="#7c6aef" viewBox="-21 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m448 232.148438c-11.777344 0-21.332031-9.554688-21.332031-21.332032 0-59.839844-23.296875-116.074218-65.601563-158.402344-8.339844-8.339843-8.339844-21.820312 0-30.164062 8.339844-8.339844 21.824219-8.339844 30.164063 0 50.371093 50.367188 78.101562 117.335938 78.101562 188.566406 0 11.777344-9.554687 21.332032-21.332031 21.332032zm0 0"/>
                                            <path d="m21.332031 232.148438c-11.773437 0-21.332031-9.554688-21.332031-21.332032 0-71.230468 27.734375-138.199218 78.101562-188.566406 8.339844-8.339844 21.824219-8.339844 30.164063 0 8.34375 8.34375 8.34375 21.824219 0 30.164062-42.304687 42.304688-65.597656 98.5625-65.597656 158.402344 0 11.777344-9.558594 21.332032-21.335938 21.332032zm0 0"/>
                                            <path d="m434.753906 360.8125c-32.257812-27.265625-50.753906-67.117188-50.753906-109.335938v-59.476562c0-75.070312-55.765625-137.214844-128-147.625v-23.042969c0-11.796875-9.558594-21.332031-21.332031-21.332031-11.777344 0-21.335938 9.535156-21.335938 21.332031v23.042969c-72.253906 10.410156-128 72.554688-128 147.625v59.476562c0 42.21875-18.496093 82.070313-50.941406 109.503907-8.300781 7.105469-13.058594 17.429687-13.058594 28.351562 0 20.589844 16.746094 37.335938 37.335938 37.335938h352c20.585937 0 37.332031-16.746094 37.332031-37.335938 0-10.921875-4.757812-21.246093-13.246094-28.519531zm0 0"/>
                                            <path d="m234.667969 512c38.632812 0 70.953125-27.542969 78.378906-64h-156.757813c7.421876 36.457031 39.742188 64 78.378907 64zm0 0"/>
                                        </svg>
                                    :   <svg viewBox="-21 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m448 232.148438c-11.777344 0-21.332031-9.554688-21.332031-21.332032 0-59.839844-23.296875-116.074218-65.601563-158.402344-8.339844-8.339843-8.339844-21.820312 0-30.164062 8.339844-8.339844 21.824219-8.339844 30.164063 0 50.371093 50.367188 78.101562 117.335938 78.101562 188.566406 0 11.777344-9.554687 21.332032-21.332031 21.332032zm0 0"/>
                                            <path d="m21.332031 232.148438c-11.773437 0-21.332031-9.554688-21.332031-21.332032 0-71.230468 27.734375-138.199218 78.101562-188.566406 8.339844-8.339844 21.824219-8.339844 30.164063 0 8.34375 8.34375 8.34375 21.824219 0 30.164062-42.304687 42.304688-65.597656 98.5625-65.597656 158.402344 0 11.777344-9.558594 21.332032-21.335938 21.332032zm0 0"/>
                                            <path d="m434.753906 360.8125c-32.257812-27.265625-50.753906-67.117188-50.753906-109.335938v-59.476562c0-75.070312-55.765625-137.214844-128-147.625v-23.042969c0-11.796875-9.558594-21.332031-21.332031-21.332031-11.777344 0-21.335938 9.535156-21.335938 21.332031v23.042969c-72.253906 10.410156-128 72.554688-128 147.625v59.476562c0 42.21875-18.496093 82.070313-50.941406 109.503907-8.300781 7.105469-13.058594 17.429687-13.058594 28.351562 0 20.589844 16.746094 37.335938 37.335938 37.335938h352c20.585937 0 37.332031-16.746094 37.332031-37.335938 0-10.921875-4.757812-21.246093-13.246094-28.519531zm0 0"/>
                                            <path d="m234.667969 512c38.632812 0 70.953125-27.542969 78.378906-64h-156.757813c7.421876 36.457031 39.742188 64 78.378907 64zm0 0"/>
                                        </svg>
                                }
                            </button>
                            <button value={ post_id } id="favorite" onClick={ handleEvents }>
                                {
                                    favorite
                                    ?   <svg fill="#ffd338" viewBox="0 -10 511.98685 511" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/>
                                        </svg>
                                    :   <svg viewBox="0 -10 511.98685 511" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/>
                                        </svg>
                                }
                            </button>
                            {
                                (id in user && user.id == post.user_id)
                                &&  <button value={ post_id } id="edit" onClick={ ownerEvents }>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.873 477.873">
                                            <path d="M392.533,238.937c-9.426,0-17.067,7.641-17.067,17.067V426.67c0,9.426-7.641,17.067-17.067,17.067H51.2 c-9.426,0-17.067-7.641-17.067-17.067V85.337c0-9.426,7.641-17.067,17.067-17.067H256c9.426,0,17.067-7.641,17.067-17.067 S265.426,34.137,256,34.137H51.2C22.923,34.137,0,57.06,0,85.337V426.67c0,28.277,22.923,51.2,51.2,51.2h307.2 c28.277,0,51.2-22.923,51.2-51.2V256.003C409.6,246.578,401.959,238.937,392.533,238.937z"/>
                                            <path d="M458.742,19.142c-12.254-12.256-28.875-19.14-46.206-19.138c-17.341-0.05-33.979,6.846-46.199,19.149L141.534,243.937c-1.865,1.879-3.272,4.163-4.113,6.673l-34.133,102.4c-2.979,8.943,1.856,18.607,10.799,21.585c1.735,0.578,3.552,0.873,5.38,0.875c1.832-0.003,3.653-0.297,5.393-0.87l102.4-34.133c2.515-0.84,4.8-2.254,6.673-4.13l224.802-224.802C484.25,86.023,484.253,44.657,458.742,19.142z M434.603,87.419L212.736,309.286l-66.287,22.135l22.067-66.202L390.468,43.353c12.202-12.178,31.967-12.158,44.145,0.044c5.817,5.829,9.095,13.72,9.12,21.955C443.754,73.631,440.467,81.575,434.603,87.419z"/>
                                        </svg>
                                    </button>
                            }
                            {
                                (id in user && user.id == post.user_id)
                                &&  <button value={ post_id } id="delete" onClick={ ownerEvents }>
                                        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m442.154 145c10.585 0 17.924-10.701 13.955-20.514-14.093-34.841-48.275-59.486-88.109-59.486h-18.414c-6.867-36.273-38.67-65-77.586-65h-32c-38.891 0-70.715 28.708-77.586 65h-18.414c-39.834 0-74.016 24.645-88.109 59.486-3.969 9.813 3.37 20.514 13.955 20.514zm-202.154-115h32c21.9 0 40.49 14.734 46.748 35h-125.496c6.258-20.266 24.848-35 46.748-35z"/>
                                            <path d="m111.053 470.196c1.669 23.442 21.386 41.804 44.886 41.804h200.121c23.5 0 43.217-18.362 44.886-41.804l21.023-295.196h-331.938zm185.966-214.945c.414-8.274 7.469-14.655 15.73-14.232 8.274.414 14.646 7.457 14.232 15.73l-8 160c-.401 8.019-7.029 14.251-14.969 14.251-8.637 0-15.42-7.223-14.994-15.749zm-97.768-14.232c8.263-.415 15.317 5.959 15.73 14.232l8 160c.426 8.53-6.362 15.749-14.994 15.749-7.94 0-14.568-6.232-14.969-14.251l-8-160c-.413-8.273 5.959-15.316 14.233-15.73z"/>
                                        </svg>
                                    </button>
                            }
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
