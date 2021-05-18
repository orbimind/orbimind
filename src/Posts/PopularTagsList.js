import React, {useState, useEffect} from 'react';
import axios from 'axios';
import './Posts.css';
import TagElement from './TagElement';

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

export default function PopularTagsList({}) {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        let cancel;
        axios.get("https://orbimind.herokuapp.com/api/categories" , {
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setTags(result.data.map(p => p));
        });

        return () => cancel(); 
    }, []);
    shuffle(tags);
    return tags.map(tag => {
        return <TagElement
            key={tag.id}
            title={tag.title}
        />
    });
}
