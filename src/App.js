import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './Headers/Header';
import Posts from './Posts/Posts';
import SinglePost from './Posts/SinglePost';
import Tags from './Tags/Tags';
import { Login, Register, ForgotPassword } from "./Auth";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path='/' exact component={Posts} />
        <Route path='/posts' component={Posts} />
        <Route path='/post/:post_id' component={SinglePost} />
        <Route path='/tags' component={Tags} />

        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <Route path='/forgot-password' component={ForgotPassword} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
