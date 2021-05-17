import React from 'react';
import './Posts.css';
import FilteringBar from './FilteringBar';
import PopularTags from './PopularTags';
import PostsList from './PostsList';
import Pagination from '../Pagination.js';

function AllPosts({ posts, gotoNextPage, gotoPrevPage }) {
    return (
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
                    />
                </div>
                <PopularTags />
            </div>
        </div>
    );
}

export default AllPosts;