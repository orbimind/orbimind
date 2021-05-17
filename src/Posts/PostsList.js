import React from 'react';
import PostElement from './PostElement';

export default function PostsList({ posts }) {
    return posts.map(post => {
            let title = post.title;
            if(title.length >= 42)
                title = title.substr(0, 42) + "..";
            
            let content = post.content;
            if(content.length >= 152)
                content = content.substr(0, 152) + "..";
            
            let rating = post.rating;
            if(rating > 999)
                rating = 999;
                
            return <PostElement
                key={post.id} 
                id={post.id}
                title={title} 
                content={content}
                rating={rating}
                tags={post.category_id}
            />
    });
}
