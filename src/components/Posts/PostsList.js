import React from 'react'
import PostElement from './PostElement'

export default function PostsList({ posts }) {
    return posts.map(post => {
            return <PostElement
                key={ post.id }
                post={ post }
                content={ 
                    ( post.content.length >= 228 )
                    ? post.content.substr(0, 228) + "..."
                    : post.content
                }
            />
    });
}
