import React, { useEffect, useState, Component } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';

import FilteringBar from '../Filters/FilteringBar';
import PostsList from '../Posts/PostsList';
import Pagination from '../Pagination';
import UserBlock from './UserBlock';
import './User.css';

export function User() {
    const { username } = useParams();

    const [posts, setPosts] = useState([]);
    const [currentPageUrl, setCurrentPageUrl] = useState("https://orbimind.herokuapp.com/api/posts?page=1&user=" + username + "&order=date$desc");
    const [nextPageUrl, setNextPageUrl] = useState();
    const [prevPageUrl, setPrevPageUrl] = useState();
    
    const params = new URLSearchParams('?' + currentPageUrl.split('?')[1]);
    let next = +params.get('page') + 1;
    let prev = +params.get('page') - 1;

    useEffect(() => {
        let cancel;

        axios.get(currentPageUrl, {
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setNextPageUrl("https://orbimind.herokuapp.com/api/posts?page=" + next + "&user=" + username + "&order=date$desc");
            setPrevPageUrl("https://orbimind.herokuapp.com/api/posts?page=" + prev + "&user=" + username + "&order=date$desc");
            setPosts(result.data.map(p => p));
        });

        return () => cancel(); 
    }, [ currentPageUrl ]);

    function gotoNextPage() {
        setCurrentPageUrl(nextPageUrl);
    }
    function gotoPrevPage() {
        setCurrentPageUrl(prevPageUrl);
    }

    return (
        <div className='userRoot'>
            <div className='user'>
                <div>
                    <FilteringBar username={ username } />
                    <PostsList posts={ posts } />
                    <Pagination 
                        gotoNextPage={gotoNextPage}
                        gotoPrevPage={gotoPrevPage}
                        currentPage={params.get('page')}
                    />
                </div>
                <div>
                    <UserBlock username={ username } />
                </div>
            </div>
        </div>
    );
}

export function UserFavorites() {
    const { username } = useParams();

    const [faves, setFaves] = useState([]);

    useEffect(() => {
        let cancel;

        axios.get("https://orbimind.herokuapp.com/api/users/" + username + "/favorites", {
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(result => {
            setFaves(result.data.map(p => p));
        });

        return () => cancel(); 
    }, []);

    return (
        <div className='userRoot'>
            <div className='user'>
                <div>
                    <FilteringBar username={ username } favorite={ true } noFilters={ true }/>
                    <PostsList posts={ faves } />
                </div>
                <div>
                    <UserBlock username={ username } />
                </div>
            </div>
        </div>
    );
}
