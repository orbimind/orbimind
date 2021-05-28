import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const style ={
    img: {
        borderRadius: "50%",
        border: "2px solid var(--theme-purple)"
    }
}

export function LoginButton() {
    return (
        <Link to='/login' className='userBar'>
            <button>Log in</button>
            <svg viewBox="0 0 34 34" fill="#F2F0FE" xmlns="http://www.w3.org/2000/svg"><circle cx="17" cy="17" r="17" /></svg>
        </Link>
    )
}

export function UserButton({ username }) {
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
        <Link to={`/user/${ username }`} className='userBar'>
            <button>{ username }</button>
            <img style={ style.img } src={`https://d3djy7pad2souj.cloudfront.net/avatars/${ user.image }`} alt="avatar" />
        </Link>
    )
}
