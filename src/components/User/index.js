import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useLocation } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'

import FilteringBar from '../Filters'
import PostsList from '../Posts/PostsList'
import Pagination from '../Pagination'
import UserBlock from './UserBlock'
import './User.css'

export function User() {
    const { username } = useParams();

    const location = useLocation()
    const [posts, setPosts] = useState([]);
    const [query, setQuery] = useState(new URLSearchParams(useLocation().search));
    const [currentPageUrl, setCurrentPageUrl] = useState("https://orbimind.herokuapp.com/api/posts?page=1" + "&category=" + query.get("category") + "&order=date$desc" + '&user=' + username);
    const [nextPageUrl, setNextPageUrl] = useState();
    const [prevPageUrl, setPrevPageUrl] = useState();
    const params = new URLSearchParams('?' + currentPageUrl.split('?')[1]);
    let next = +params.get('page') + 1;
    let prev = +params.get('page') - 1;
    let title = "All posts";
    if(query.get("category") !== null)
      title = query.get("category");

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

    useEffect(() => {
        setQuery(new URLSearchParams(location.search.slice(1)))
    }, [location])

    useEffect(() => {
        let newUrl = currentPageUrl.slice(0, currentPageUrl.indexOf('?')) + '?'
        let queries = new URLSearchParams(currentPageUrl.slice(currentPageUrl.indexOf('?')))
    
        queries.set('category', query.get('category'))
        query.get('order') ? queries.set('order', query.get('order')) : queries.set('order', 'date$desc')
        queries.set('status', query.get('status'))
        queries.has('page') && queries.set('page', '1')
    
        for (const q of queries) {
          newUrl += q[0] + '=' + q[1] + '&'
        }
    
        if (newUrl[newUrl.length - 1] === '&') {
          newUrl = newUrl.slice(0, newUrl.length - 1)
        }
    
        setCurrentPageUrl(newUrl)
      }, [query])

    let logged = false;
    let user = Cookies.getJSON('user');
    if(user)
        if(username == user.username)
            logged = true;

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
                    <UserBlock username={ username } logged={ logged } toSettings={ true } />
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

    let isSettings = false;
    let user = Cookies.getJSON('user');
    if(user)
        if(username == user.username)
            isSettings = true;

    return (
        <div className='userRoot'>
            <div className='user'>
                <div>
                    <FilteringBar username={ username } favorite={ true } noFilters={ true }/>
                    <PostsList posts={ faves } />
                </div>
                <div>
                    <UserBlock username={ username } logged={ isSettings } toSettings={ false } />
                </div>
            </div>
        </div>
    );
}
