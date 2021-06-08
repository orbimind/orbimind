import React, { useEffect, useState } from 'react'
import axios from 'axios'

import SingleTag from './SingleTag'
import { AllTagsLoading } from '../Misc/Loading'

export default function AllTagsList() {
    const [loading, setLoading] = useState(true)
    const [tags, setTags] = useState([])
    useEffect(() => {
        let cancel
        axios.get("https://orbimind.herokuapp.com/api/categories" , {
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setTags(result.data.map(p => p))
            setLoading(false)
        });

        return () => cancel(); 
    }, [])

    return (
        <>
            {
                loading && <AllTagsLoading />
            }
            {
                tags.length
                ?
                tags.map(tag => {  
                    return <SingleTag 
                        key={ tag.id } 
                        title={ tag.title } 
                        description={ tag.description }
                    />
                })
                : loading ? null : <p>No tags available</p>
            }
        </>
    )
}
