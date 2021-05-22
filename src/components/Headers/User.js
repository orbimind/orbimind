import React from 'react';
import { Link } from 'react-router-dom';
import temp from '../../assets/logo.svg';

export function LoginButton() {
    return (
        <Link to='/login' className='userBar'>
            <button>Log in</button>
            <svg viewBox="0 0 34 34" fill="#F2F0FE" xmlns="http://www.w3.org/2000/svg">
                <circle cx="17" cy="17" r="17" />
            </svg>
        </Link>
    )
}

export function UserButton({ username, user_id }) {
    // const [user, setUser] = useState([]);
    // const [avatar, setAvatar] = useState();
    // useEffect(() => {
    //     let cancel;

    //     axios.get("https://orbimind.herokuapp.com/api/users/" + user_id, {
    //         cancelToken: new axios.CancelToken(c => cancel = c)
    //     }).then(result => {
    //         setUser(result.data);
    //     });

    //     return () => cancel(); 
    // }, []);

    // useEffect(() => {
    //     if(user){
    //         let cancel;

    //         axios.get("https://orbimind.herokuapp.com/api/users/avatar/" + user.image, {
    //             cancelToken: new axios.CancelToken(c => cancel = c)
    //         }).then(result => {
    //             setAvatar(result.data);
    //         });
    //         console.log(avatar)

    //         return () => cancel(); 
    //     }
    // }, [user]);

    return (
        <Link to='/profile' className='userBar'>
            <button>{ username }</button>
            <img src={temp} alt="avatar" />
        </Link>
    )
}
