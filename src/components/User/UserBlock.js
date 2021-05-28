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
                <h2>{ username }<br/><small>{ user.name }</small></h2>
                <UserStat title='Rating' image={ ratingSvg } content={ user.rating } />
                <UserStat title='Member for' image={ timeSvg } content={ moment(user.created_at).fromNow(true) } />
                <div id='favorites'>
                    <svg viewBox="0 -10 511.987 511" xmlns="http://www.w3.org/2000/svg"><path d="M510.652 185.902a27.158 27.158 0 0 0-23.425-18.71l-147.774-13.419-58.433-136.77C276.71 6.98 266.898.494 255.996.494s-20.715 6.487-25.023 16.534l-58.434 136.746-147.797 13.418A27.208 27.208 0 0 0 1.34 185.902c-3.371 10.368-.258 21.739 7.957 28.907l111.7 97.96-32.938 145.09c-2.41 10.668 1.73 21.696 10.582 28.094 4.757 3.438 10.324 5.188 15.937 5.188 4.84 0 9.64-1.305 13.95-3.883l127.468-76.184 127.422 76.184c9.324 5.61 21.078 5.097 29.91-1.305a27.223 27.223 0 0 0 10.582-28.094l-32.937-145.09 111.699-97.94a27.224 27.224 0 0 0 7.98-28.927zm0 0"/></svg>
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
