import React from 'react';
import moment from 'moment';
import PostElement from './PostElement';

export default function PostsList({ posts }) {
    if(!posts) 
        alert('Fix this lmao')
    return posts.map(post => {
            return <PostElement
                key={ post.id } 
                id={ post.id }
                title={ post.title } 
                content={ 
                    ( post.content.length >= 228 )
                    ? post.content.substr(0, 228) + "..."
                    : post.content
                }
                rating={ post.rating }
                date={ moment(post.created_at).fromNow() }
                user_id={ post.user_id }
            />
    });
}
