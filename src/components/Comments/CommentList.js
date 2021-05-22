import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import axios from "axios";
import './Comment.css';

export default function CommentList({ post_id }) {
    const [comments, setComments] = useState([]);
    useEffect(() => {
        let cancel;
        axios.get("https://orbimind.herokuapp.com/api/posts/" + post_id + "/comments", {
          cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setComments(result.data.map(p => p));
        });

        return () => cancel(); 
    }, []);
    
    return (
        <div className="commentsSection">
            <h1>{comments.length} Answers</h1>
            {
                comments.map(comment => {  
                    return <Comment
                            key={comment.id}
                            user_id={comment.user_id}
                            rating={comment.rating}
                            date={comment.created_at}
                            content={comment.content}
                        />
                })
            }
        </div>
    )
}
