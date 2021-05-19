import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Headers/Header';
import AllPosts from './Posts/AllPosts';
import SinglePost from './Posts/SinglePost';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path='/' exact component={AllPosts}/>
        <Route path='/post/:post_id' component={SinglePost}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
