import React from 'react';
import './Header.css';
import logoFull from '../assets/logo-full.svg';

function Header() {
    return (
        <div className='headerRoot'>
            <div className='header'>
                <div className='logo'><img src={logoFull} alt='logo' /></div>
                <button>Posts</button>
                <button>Tags</button>
                <div className='searchBar'>
                    <input type='text' placeholder='Search for titles, contents or tags...' />
                    <button>
                        <svg viewBox="0 0 20 20" fill="#7C6AEF" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.361 18.2168L14.601 13.2662C15.8249 11.8113 16.4954 9.98069 16.4954 8.07499C16.4954 3.62251 12.8729 0 8.42045 0C3.96797 0 0.345459 3.62251 0.345459 8.07499C0.345459 12.5275 3.96797 16.15 8.42045 16.15C10.092 16.15 11.6849 15.6458 13.0467 14.6888L17.8429 19.677C18.0434 19.8852 18.313 20 18.602 20C18.8755 20 19.1349 19.8957 19.3319 19.7061C19.7504 19.3034 19.7637 18.6357 19.361 18.2168ZM8.42045 2.10652C11.7115 2.10652 14.3889 4.78391 14.3889 8.07499C14.3889 11.3661 11.7115 14.0435 8.42045 14.0435C5.12937 14.0435 2.45198 11.3661 2.45198 8.07499C2.45198 4.78391 5.12937 2.10652 8.42045 2.10652Z" fill="#7C6AEF"/>
                        </svg>
                    </button>
                </div>
                <button>Help</button>
                <div className='userBar'>
                    <button>Log in</button>
                    <svg viewBox="0 0 34 34" fill="#F2F0FE" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="17" cy="17" r="17" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default Header;