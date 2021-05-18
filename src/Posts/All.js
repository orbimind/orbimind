import React, { useEffect, useState } from 'react';
import Preview from '../Headers/Preview.js';
import './Posts.css';
import FilteringBar from './FilteringBar';
import PopularTagsList from './PopularTagsList';
import PostsList from './PostsList';
import Pagination from './Pagination.js';
import axios from 'axios';

function AllPosts() {
    const [posts, setPosts] = useState([]);
    const [currentPageUrl, setCurrentPageUrl] = useState("https://orbimind.herokuapp.com/api/posts?page=1");
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
        setNextPageUrl("https://orbimind.herokuapp.com/api/posts?page=" + next);
        setPrevPageUrl("https://orbimind.herokuapp.com/api/posts?page=" + prev);
        setPosts(result.data.map(p => p));
      });

      return () => cancel();
    }, [currentPageUrl]);
  
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
                <div className='tags'>
                    <h1>Popular tags</h1>
                    <PopularTagsList />
                </div>
            </div>
        </div>
        </>
    );
}

export default AllPosts;