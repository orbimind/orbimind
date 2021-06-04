import React, { useEffect, useState } from 'react';
import axios from "axios";

import Comment from './Comment';
import './Comment.css';

export default function CommentList({ post_id }) {
    const [post, setPost] = useState({});
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

    useEffect(() => {
        let cancel;
        axios.get("https://orbimind.herokuapp.com/api/posts/" + post_id, {
          cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setPost(result.data);
        });

        return () => cancel(); 
    }, []);
    
    return (
        <div className="commentsSection">
            <h1>{comments.length} Answers</h1>
            {
                (comments.length === 0) &&
                <span style={{width: '100%', height: 'fit-content', display: 'grid', placeItems: 'center', marginTop: '20px'}}>No comments here :c Be the first to respond</span>
            }
            {
                comments.map(comment => {  
                    return <Comment
                            key={ comment.id }
                            comment={ comment }
                            post={ post }
                        />
                })
            }
        </div>
    )
}
