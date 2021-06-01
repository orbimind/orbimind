import React from 'react'

import { Karma, Replace } from '../../assets/Misc.jsx'
import './UserStat.css'

export default function UserStat({ title, image, content }) {
    let isRating = false
    let isTime = false

    switch(image) {
        case 'rating': isRating = true; break;
        case 'time': isTime = true; break;
    }

    return (
        <div className="userStat">
            <h3>{ title }</h3>
            <div>
                {
                    isRating && <Karma />
                }
                {
                    isTime && <Replace />
                }
                <span>{ content }</span>
            </div>
        </div>
    );
}
