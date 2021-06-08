import React from 'react'
import { Helmet } from 'react-helmet'

import AllTagsList from './AllTagsList'
import Preview from '../Base/Preview'
import './Tags.css'

export default function Tags() {
    let title = "All tags"

    return (
        <>
        <Helmet>
            <title>All tags &#8739; Orbimind</title> 
        </Helmet>
        <Preview title={ title }/>
        <div className='tagsRoot'>
            <div className='tags'>
                <AllTagsList />
            </div>
        </div>
        </>
    );
}
