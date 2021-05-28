import React, { useState, useEffect } from 'react';
import { useParams, Link, Redirect } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import moment from 'moment';
import axios from 'axios';

import TagsList from '../Tags/TagsList';
import CommentList from '../Comments/CommentList';
import CommentInput from '../Comments/CommentInput';
import './SinglePost.css';
import '../Tags/Tags.css';

function deletePost(token, id){
    const api = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        data: {},
        url: `https://orbimind.herokuapp.com/api/posts/${ id }`
    };
    const promise = axios.delete(api.url, { headers: api.headers });

    toast.promise(
        promise, 
        {
            loading: 'Processing..',
            success: () => {
                setTimeout(location.reload(), 2000);
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
                    }
                    else {
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
                                    ?   <svg fill="#7c6aef" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835"><path d="M129.007 57.819c-4.68-4.68-12.499-4.68-17.191 0L3.555 165.803c-4.74 4.74-4.74 12.427 0 17.155 4.74 4.74 12.439 4.74 17.179 0l99.683-99.406 99.671 99.418c4.752 4.74 12.439 4.74 17.191 0 4.74-4.74 4.74-12.427 0-17.155L129.007 57.819z"/></svg>
                                    :   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835"><path d="M129.007 57.819c-4.68-4.68-12.499-4.68-17.191 0L3.555 165.803c-4.74 4.74-4.74 12.427 0 17.155 4.74 4.74 12.439 4.74 17.179 0l99.683-99.406 99.671 99.418c4.752 4.74 12.439 4.74 17.191 0 4.74-4.74 4.74-12.427 0-17.155L129.007 57.819z"/></svg>
                                }
                            </button>
                            <span id='rating'>{ currentRating }</span>
                            <button id="dislike" onClick={e => createLike(e.currentTarget.id)}>
                                {
                                    (likeType === "dislike")
                                    ?   <svg fill="#7c6aef" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835"><path d="M129.007 57.819c-4.68-4.68-12.499-4.68-17.191 0L3.555 165.803c-4.74 4.74-4.74 12.427 0 17.155 4.74 4.74 12.439 4.74 17.179 0l99.683-99.406 99.671 99.418c4.752 4.74 12.439 4.74 17.191 0 4.74-4.74 4.74-12.427 0-17.155L129.007 57.819z"/></svg>
                                    :   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.835 240.835"><path d="M129.007 57.819c-4.68-4.68-12.499-4.68-17.191 0L3.555 165.803c-4.74 4.74-4.74 12.427 0 17.155 4.74 4.74 12.439 4.74 17.179 0l99.683-99.406 99.671 99.418c4.752 4.74 12.439 4.74 17.191 0 4.74-4.74 4.74-12.427 0-17.155L129.007 57.819z"/></svg>
                                }
                            </button>
                        </div>
                        <div>
                            <button id="subscribe" onClick={e => handleEvents(e.currentTarget.id)}>
                                {
                                    subscription
                                    ?   <svg fill="#7c6aef" viewBox="-21 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M448 232.148c-11.777 0-21.332-9.554-21.332-21.332 0-59.84-23.297-116.074-65.602-158.402-8.34-8.34-8.34-21.82 0-30.164 8.34-8.34 21.825-8.34 30.164 0 50.372 50.367 78.102 117.336 78.102 188.566 0 11.778-9.555 21.332-21.332 21.332zM21.332 232.148C9.559 232.148 0 222.594 0 210.816 0 139.586 27.734 72.617 78.102 22.25c8.34-8.34 21.824-8.34 30.164 0 8.343 8.344 8.343 21.824 0 30.164C65.96 94.72 42.668 150.977 42.668 210.816c0 11.778-9.559 21.332-21.336 21.332zM434.754 360.813C402.496 333.546 384 293.695 384 251.476V192c0-75.07-55.766-137.215-128-147.625V21.332C256 9.535 246.441 0 234.668 0c-11.777 0-21.336 9.535-21.336 21.332v23.043c-72.254 10.41-128 72.555-128 147.625v59.477c0 42.218-18.496 82.07-50.941 109.503a37.262 37.262 0 0 0-13.059 28.352c0 20.59 16.746 37.336 37.336 37.336h352c20.586 0 37.332-16.746 37.332-37.336 0-10.922-4.758-21.246-13.246-28.52zM234.668 512c38.633 0 70.953-27.543 78.379-64H156.289c7.422 36.457 39.742 64 78.379 64zm0 0"/></svg>
                                    :   <svg viewBox="-21 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M448 232.148c-11.777 0-21.332-9.554-21.332-21.332 0-59.84-23.297-116.074-65.602-158.402-8.34-8.34-8.34-21.82 0-30.164 8.34-8.34 21.825-8.34 30.164 0 50.372 50.367 78.102 117.336 78.102 188.566 0 11.778-9.555 21.332-21.332 21.332zM21.332 232.148C9.559 232.148 0 222.594 0 210.816 0 139.586 27.734 72.617 78.102 22.25c8.34-8.34 21.824-8.34 30.164 0 8.343 8.344 8.343 21.824 0 30.164C65.96 94.72 42.668 150.977 42.668 210.816c0 11.778-9.559 21.332-21.336 21.332zM434.754 360.813C402.496 333.546 384 293.695 384 251.476V192c0-75.07-55.766-137.215-128-147.625V21.332C256 9.535 246.441 0 234.668 0c-11.777 0-21.336 9.535-21.336 21.332v23.043c-72.254 10.41-128 72.555-128 147.625v59.477c0 42.218-18.496 82.07-50.941 109.503a37.262 37.262 0 0 0-13.059 28.352c0 20.59 16.746 37.336 37.336 37.336h352c20.586 0 37.332-16.746 37.332-37.336 0-10.922-4.758-21.246-13.246-28.52zM234.668 512c38.633 0 70.953-27.543 78.379-64H156.289c7.422 36.457 39.742 64 78.379 64zm0 0"/></svg>

                                }
                            </button>
                            <button id="favorite" onClick={e => handleEvents(e.currentTarget.id)}>
                                {
                                    favorite
                                    ?   <svg fill="#ffd338" viewBox="0 -10 511.987 511" xmlns="http://www.w3.org/2000/svg"><path d="M510.652 185.902a27.158 27.158 0 0 0-23.425-18.71l-147.774-13.419-58.433-136.77C276.71 6.98 266.898.494 255.996.494s-20.715 6.487-25.023 16.534l-58.434 136.746-147.797 13.418A27.208 27.208 0 0 0 1.34 185.902c-3.371 10.368-.258 21.739 7.957 28.907l111.7 97.96-32.938 145.09c-2.41 10.668 1.73 21.696 10.582 28.094 4.757 3.438 10.324 5.188 15.937 5.188 4.84 0 9.64-1.305 13.95-3.883l127.468-76.184 127.422 76.184c9.324 5.61 21.078 5.097 29.91-1.305a27.223 27.223 0 0 0 10.582-28.094l-32.937-145.09 111.699-97.94a27.224 27.224 0 0 0 7.98-28.927zm0 0"/></svg>
                                    :   <svg viewBox="0 -10 511.987 511" xmlns="http://www.w3.org/2000/svg"><path d="M510.652 185.902a27.158 27.158 0 0 0-23.425-18.71l-147.774-13.419-58.433-136.77C276.71 6.98 266.898.494 255.996.494s-20.715 6.487-25.023 16.534l-58.434 136.746-147.797 13.418A27.208 27.208 0 0 0 1.34 185.902c-3.371 10.368-.258 21.739 7.957 28.907l111.7 97.96-32.938 145.09c-2.41 10.668 1.73 21.696 10.582 28.094 4.757 3.438 10.324 5.188 15.937 5.188 4.84 0 9.64-1.305 13.95-3.883l127.468-76.184 127.422 76.184c9.324 5.61 21.078 5.097 29.91-1.305a27.223 27.223 0 0 0 10.582-28.094l-32.937-145.09 111.699-97.94a27.224 27.224 0 0 0 7.98-28.927zm0 0"/></svg>
                                }
                            </button>
                            {
                                isAuthor &&
                                <Link to={`create/${ post_id }`} id="edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 477.873 477.873"><path d="M392.533 238.937c-9.426 0-17.067 7.641-17.067 17.067V426.67c0 9.426-7.641 17.067-17.067 17.067H51.2c-9.426 0-17.067-7.641-17.067-17.067V85.337c0-9.426 7.641-17.067 17.067-17.067H256c9.426 0 17.067-7.641 17.067-17.067S265.426 34.137 256 34.137H51.2C22.923 34.137 0 57.06 0 85.337V426.67c0 28.277 22.923 51.2 51.2 51.2h307.2c28.277 0 51.2-22.923 51.2-51.2V256.003c0-9.425-7.641-17.066-17.067-17.066z"/><path d="M458.742 19.142A65.328 65.328 0 0 0 412.536.004a64.85 64.85 0 0 0-46.199 19.149L141.534 243.937a17.254 17.254 0 0 0-4.113 6.673l-34.133 102.4c-2.979 8.943 1.856 18.607 10.799 21.585 1.735.578 3.552.873 5.38.875a17.336 17.336 0 0 0 5.393-.87l102.4-34.133c2.515-.84 4.8-2.254 6.673-4.13l224.802-224.802c25.515-25.512 25.518-66.878.007-92.393zm-24.139 68.277L212.736 309.286l-66.287 22.135 22.067-66.202L390.468 43.353c12.202-12.178 31.967-12.158 44.145.044a31.215 31.215 0 0 1 9.12 21.955 31.043 31.043 0 0 1-9.13 22.067z"/></svg>
                                </Link>
                            }
                            {
                                isAuthor &&
                                <button value={ post_id } id="delete" onClick={ ownerEvents }>
                                    <svg fill='rgba(234, 60, 83, 0.7)' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M442.154 145c10.585 0 17.924-10.701 13.955-20.514C442.016 89.645 407.834 65 368 65h-18.414C342.719 28.727 310.916 0 272 0h-32c-38.891 0-70.715 28.708-77.586 65H144c-39.834 0-74.016 24.645-88.109 59.486C51.922 134.299 59.261 145 69.846 145zM240 30h32c21.9 0 40.49 14.734 46.748 35H193.252C199.51 44.734 218.1 30 240 30zM111.053 470.196C112.722 493.638 132.439 512 155.939 512H356.06c23.5 0 43.217-18.362 44.886-41.804L421.969 175H90.031zm185.966-214.945c.414-8.274 7.469-14.655 15.73-14.232 8.274.414 14.646 7.457 14.232 15.73l-8 160c-.401 8.019-7.029 14.251-14.969 14.251-8.637 0-15.42-7.223-14.994-15.749zm-97.768-14.232c8.263-.415 15.317 5.959 15.73 14.232l8 160c.426 8.53-6.362 15.749-14.994 15.749-7.94 0-14.568-6.232-14.969-14.251l-8-160c-.413-8.273 5.959-15.316 14.233-15.73z"/></svg>
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
