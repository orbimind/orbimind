import React from 'react';
import Preview from '../Headers/Preview';
import AllTagsList from './AllTagsList';
import './Tags.css';

export default function Tags() {
    let title = "All tags";

    return (
        <>
        <Preview title={title}/>
        <div className='tagsRoot'>
            <div className='tags'>
                <AllTagsList />
            </div>
        </div>
        </>
    );
}
