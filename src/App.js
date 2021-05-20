import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Headers/Header';
import Posts from './Posts/Posts';
import SinglePost from './Posts/SinglePost';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path='/' exact component={Posts} />
        <Route path='/posts' component={Posts} />
        <Route path='/post/:post_id' component={SinglePost} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
