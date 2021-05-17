import React, { useEffect, useState } from 'react';
import PostElement from './PostElement';
import axios from 'axios';

export default function PostsList({ posts }) {
    return posts.map(post => {
            let title = post.title;
            if(title.length >= 42)
                title = title.substr(0, 56) + "..";
            
            let content = post.content;
            if(content.length >= 152)
                content = content.substr(0, 152) + "..";
            
            let rating = post.rating;
            if(rating > 999)
                rating = 999;

            const [user, setUser] = useState([]);
            useEffect(() => {
                let cancel;
                axios.get("https://orbimind.herokuapp.com/api/users/" + post.user_id, {
                    cancelToken: new axios.CancelToken(c => cancel = c)
                }).then(result => {
                    setUser(result.data);
                });
        
                return () => cancel(); 
            }, []);

            return <PostElement
                key={post.id} 
                id={post.id}
                title={title} 
                content={content}
                rating={rating}
                date={post.created_at}
                user={user.username}
                user_rating={user.rating}
            />
    });
}
