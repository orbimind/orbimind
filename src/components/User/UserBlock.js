import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import Cookies from 'js-cookie';
import axios from 'axios';

import UserStat from './UserStat';
import { Star } from '../../assets/Misc.jsx'
import './UserBlock.css';

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
                <h2>{ username }<br/><small>{ user.name }</small></h2>
                <UserStat title='Rating' image='rating' content={ user.rating } />
                <UserStat title='Member for' image='time' content={ moment(user.created_at).fromNow(true) } />
                <div id='favorites'>
                    <Star />
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
