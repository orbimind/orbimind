import React, {useState, useEffect} from 'react'
import axios from 'axios'

import { PopularTagsLoading } from '../Loading'
import TagElement from './TagElement'
import './Tags.css'

export default function PopularTagsList() {
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancel;
        axios.get("https://orbimind.herokuapp.com/api/categories?random=10" , {
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setTags(result.data.map(p => p))
            setLoading(false)
        });

        return () => cancel(); 
    }, []);
    
    return (
        <div className='popularTags unselectable'>
            <h1>Random tags</h1>
            {
                loading && <PopularTagsLoading />
            }
            { 
                tags.length
                ?
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
                : loading ? null : <p>No tags available</p>
            }
        </div>
    )
}
