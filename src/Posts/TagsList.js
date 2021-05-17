import React, { useEffect, useState } from 'react';
import axios from "axios";
import TagElement from "./TagElement";

export default function TagsList({ post_id }) {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        let cancel;
        axios.get("https://orbimind.herokuapp.com/api/posts/" + post_id + "/categories", {
          cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setTags(result.data.map(p => p));
        });

        return () => cancel(); 
    }, []);
    return tags.map(tag => {  
        return <TagElement
            key={tag}
            title={tag}
        />
    });
}
