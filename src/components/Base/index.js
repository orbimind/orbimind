import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'

import { LogoFull, Logo } from '../../assets/Brand.jsx'
import * as Social from '../../assets/Social.jsx'
import { LoginButton, UserButton } from './Userbar'
import './Header.css'
import './Footer.css'

export function Header() {
    const [search, setSearch] = useState('');
    const user = Cookies.getJSON('user');

    return (
        <div className='headerRoot'>
            <div className='header unselectable'>
                <Link to='/' className='logo'><LogoFull width='100%' height='100%' /></Link>
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

export function Footer() {
    return (
        <div className='footerRoot unselectable'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 220"><path fill="#7c6aef" fillOpacity="1" d="M0,96L60,117.3C120,139,240,181,360,170.7C480,160,600,96,720,64C840,32,960,32,1080,58.7C1200,85,1320,139,1380,165.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path></svg>
            <div className='footer'>
                <div>
                    <Logo />
                    <div>
                        <span>Where great minds are in the same orbit.</span>
                        <span>Copyright © 2021 <a href='https://paxanddos.github.io/'>Paul Litovka</a>. All rights reserved.</span>
                    </div>
                </div>
                <div>
                    <a href='https://github.com/PAXANDDOS/orbimind-react' target='_black'><Social.GitHub /></a>
                    <a href='https://t.me/PAXANDDOS' target='_black'><Social.Telegram /></a>
                    <a href='https://www.facebook.com/paxanddos/' target='_black'><Social.Facebook /></a>
                    <a href='mailto:pashalitovka@gmail.com' target='_black'><Social.Email /></a>
                    <a href='https://github.com/PAXANDDOS/orbimind-api' target='_black'>API</a>
                </div>
            </div>
        </div>
    )
}
