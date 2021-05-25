import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';

import UserStat from './UserStat';
import './UserBlock.css';
import ratingSvg from '../../assets/karma.svg';
import timeSvg from '../../assets/replace.svg';

function logout(){
    const api = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer'  + Cookies.getJSON('user').token,
        },
        data: {},
        url: "https://orbimind.herokuapp.com/api/auth/logout"
    };
    const promise = axios.post(api.url, api.data, { headers: api.headers });

    toast.promise(
        promise, 
        {
            loading: 'Processing..',
            success: () => {
                Cookies.remove('user');
                setTimeout(() => {
                    location.href = '/';
                }, 1000);
                return 'Goodbye!';
            },
            error: (error) => {
                return error.response.data.message;
            }
        }
    );
}

export default function UserBlock({ username, logged, toSettings }) {
    const [user, setUser] = useState([]);
    useEffect(() => {
        let cancel;

        axios.get("https://orbimind.herokuapp.com/api/users/" + username, {
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setUser(result.data);
        });

        return () => cancel(); 
    }, []);

    return (
        <div className="userBlock">
            <div>
                <img src={`https://d3djy7pad2souj.cloudfront.net/avatars/${ user.image }`} alt='avatar' />
            </div>
            <div>
                <h2>{ username }</h2>
                <UserStat title='Rating' image={ ratingSvg } content={ user.rating } />
                <UserStat title='Member for' image={ timeSvg } content={ moment(user.created_at).fromNow(true) } />
                <div id='favorites'>
                    <svg viewBox="0 -10 511.98685 511" xmlns="http://www.w3.org/2000/svg">
                        <path d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"/>
                    </svg>
                    <Link to={`/user/${ username }/favorites`}>Favorites</Link>
                </div>
                {
                    (logged && toSettings)
                    ? <Link to={`/account`}>Account settings</Link>
                    : <Link to={`/user/${ username }`}>Back</Link>
                }
                {
                    logged && <button id='logoutButton' onClick={ logout }>Log out</button>
                }
                <Toaster
                    position="bottom-center"
                    reverseOrder={false}
                    toastOptions={{
                        style: {
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            padding: '10px',
                        },
                        duration: 2000,
                        success: {
                            iconTheme: {
                                primary: '#7c6aef',
                                secondary: '#FFF',
                            },
                        },
                        error: { duration: 4000 }
                    }}
                />
            </div>
        </div>
    )
}
