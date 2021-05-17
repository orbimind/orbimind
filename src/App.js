import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Headers/Header.js';
import Preview from './Headers/Preview.js';
import AllPosts from './Posts/All.js';

function App() {
  const [posts, setPosts] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState("https://orbimind.herokuapp.com/api/posts?page=1");
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();

  useEffect(() => {
    let cancel;
    axios.get(currentPageUrl, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(result => {
      const params = new URLSearchParams('?' + currentPageUrl.split('?')[1]);
      let next = +params.get('page') + 1;
      let prev = +params.get('page') - 1;
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
      <Header />
      <Preview />
      <AllPosts 
        posts={posts}
        gotoNextPage={nextPageUrl ? gotoNextPage : null}
        gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
      />
    </>
  );
}

export default App;
