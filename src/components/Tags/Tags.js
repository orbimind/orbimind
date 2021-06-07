import React from 'react'

import AllTagsList from './AllTagsList'
import Preview from '../Base/Preview'
import './Tags.css'

export default function Tags() {
    let title = "All tags"

    return (
        <>
        <Preview title={ title }/>
        <div className='tagsRoot'>
            <div className='tags'>
                <AllTagsList />
            </div>
        </div>
        </>
    );
}
