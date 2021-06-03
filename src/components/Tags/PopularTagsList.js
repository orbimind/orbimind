import React, {useState, useEffect} from 'react';
import axios from 'axios';

import TagElement from './TagElement';
import './Tags.css';

export default function PopularTagsList() {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        let cancel;
        axios.get("https://orbimind.herokuapp.com/api/categories?random=10" , {
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setTags(result.data.map(p => p));
        });

        return () => cancel(); 
    }, []);
    
    return (
        <div className='popularTags'>
            <h1>Random tags</h1>
            <div>
                { 
                    tags.map(tag => {
                        return <TagElement
                            key={ tag.title }
                            title={ tag.title }
                        />
                    })
                }
            </div>
        </div>
    )
}
