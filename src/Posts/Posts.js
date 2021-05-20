import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Preview from '../Headers/Preview.js';
import FilteringBar from '../Filters/FilteringBar';
import PopularTagsList from '../Tags/PopularTagsList';
import PostsList from './PostsList';
import Pagination from '../Pagination';
import axios from 'axios';
import './Posts.css';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState(new URLSearchParams(useLocation().search));
  const [currentPageUrl, setCurrentPageUrl] = useState("https://orbimind.herokuapp.com/api/posts?page=1" + "&category=" + query.get("category"));
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
      setNextPageUrl("https://orbimind.herokuapp.com/api/posts?page=" + next + "&category=" + query.get("category"));
      setPrevPageUrl("https://orbimind.herokuapp.com/api/posts?page=" + prev + "&category=" + query.get("category"));
      setPosts(result.data.map(p => p));
    });
    console.log(currentPageUrl)
    return () => cancel();
  }, [currentPageUrl
  
  ]);

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }
  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl);
  }

  return (
    <>
    <Preview />
    <div className='postsRoot'>
        <div className='posts'>
            <div className='content'>
                <FilteringBar />
                <div className="postsList">
                    <PostsList posts={posts}/>
                </div>
                <Pagination 
                    gotoNextPage={gotoNextPage}
                    gotoPrevPage={gotoPrevPage}
                    currentPage={params.get('page')}
                />
            </div>
            <PopularTagsList />
        </div>
    </div>
    </>
  );
}
