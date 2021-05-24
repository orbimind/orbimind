import React from 'react';
import './UserStat.css';

export default function UserStat({ title, image, content }) {
    return (
        <div className="userStat">
            <h3>{ title }</h3>
            <div>
                <img src={ image }></img>
                <span>{ content }</span>
            </div>
        </div>
    );
}
