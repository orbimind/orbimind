import React from 'react';
import { Link } from 'react-router-dom';

import UserStat from './UserStat';
import './UserBlock.css';

export default function UserBlock({ username }) {
    return (
        <div className="userBlock">
            <div>
                <div>
                    <div id="image" />
                </div>
            </div>
            <div>
                <h2>{ username }</h2>
                {/* <UserStat title='Rating' image={} content={ user.rating } />
                <UserStat title='Member for' image={} content={ moment(post.created_at).fromNow(true) } /> */}
                <Link to={`/user/${ username }/favorites`}>Favorites</Link>
                <Link to={`/account`}>Account settings</Link>
            </div>
        </div>
    )
}
