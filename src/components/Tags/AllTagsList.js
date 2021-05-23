import React, { useEffect, useState } from 'react';
import axios from 'axios';

import SingleTag from './SingleTag';

export default function AllTagsList() {
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

    return tags.map(tag => {  
        return <SingleTag title={ tag.title } description={ tag.description }/>
    });
}
