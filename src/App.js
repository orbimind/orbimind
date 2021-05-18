import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Headers/Header.js';
import AllPosts from './Posts/All.js';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path='/' exact component={AllPosts}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
