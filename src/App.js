import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Header, Footer } from './components/Base';
import Home from './components/Home';
import Posts from './components/Posts/Posts';
import CreatePost from './components/Posts/CreatePost';
import SinglePost from './components/Posts/SinglePost';
import Tags from './components/Tags/Tags';
import { LoginRoute, LoggedRoute, LoginHomeRoute } from './components/Routing';
import NotFound from './components/NotFound';
import { Login, Register, ForgotPassword } from "./components/Auth";
import { User, UserFavorites } from './components/User';
import UserAccount from './components/User/UserAccount';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <LoginHomeRoute exact path='/'> <Home /> </LoginHomeRoute>

        <Route exact path='/posts' component={ Posts } />
        <LoggedRoute exact path='/posts/create'> <CreatePost /> </LoggedRoute>
        <LoggedRoute exact path='/posts/create/:post_id'> <CreatePost /> </LoggedRoute>
        <Route path='/posts/:post_id' component={ SinglePost } />
        <Route exact path='/tags' component={ Tags } />
        <Route exact path='/user/:username' component={ User } />
        <Route exact path='/user/:username/favorites' component={ UserFavorites } />
        <LoggedRoute exact path='/account'> <UserAccount /> </LoggedRoute>

        <LoginRoute path='/login'> <Login /> </LoginRoute>
        <LoginRoute path='/register'> <Register /> </LoginRoute>
        <LoginRoute path='/forgot-password'> <ForgotPassword /> </LoginRoute>

        <Route path="*" component={ NotFound } />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}
