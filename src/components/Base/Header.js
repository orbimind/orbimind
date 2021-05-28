import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import logoFull from '../../assets/logo-full.svg';
import { LoginButton, UserButton } from './Userbar';
import './Header.css';

export default function Header() {
    const [search, setSearch] = useState('');
    const user = Cookies.getJSON('user');

    return (
        <div className='headerRoot'>
            <div className='header'>
                <Link to='/' className='logo'><img src={logoFull} alt='logo' /></Link>
                <Link to='/posts' className='link'>
                    Posts
                </Link>
                <Link to='/tags' className='link'>
                    Tags
                </Link>
                <div className='searchBar'>
                    <input type='search' placeholder='Search for titles, contents or tags...' onChange={event => setSearch(event.target.value)} />
                    <Link to={`/posts?search=${search}`} className='link'>
                        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m19.361 18.217-4.76-4.95a8.049 8.049 0 0 0 1.894-5.192C16.495 3.623 12.873 0 8.42 0 3.968 0 .345 3.623.345 8.075c0 4.453 3.623 8.075 8.075 8.075a7.989 7.989 0 0 0 4.627-1.461l4.796 4.988c.2.208.47.323.759.323a1.054 1.054 0 0 0 .759-1.783zM8.421 2.107a5.975 5.975 0 0 1 5.968 5.968 5.975 5.975 0 0 1-5.969 5.969 5.975 5.975 0 0 1-5.968-5.969A5.975 5.975 0 0 1 8.42 2.107z" fill="#7C6AEF"/></svg>
                    </Link>
                </div>
                <Link to='/help' className='link'>
                    Help
                </Link>
                {
                    !user
                    ? <LoginButton />
                    : <UserButton username={ user.username }/>
                }
            </div>
        </div>
    );
}
