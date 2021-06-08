import React from 'react'
import TagElement from './TagElement'

export default function SingleTag({ title, description }) {
    return (
        <div className="singeTag">
            <TagElement title={ title }/>
            <p id="tagDescription">{ description }</p>
        </div>
    )
}
