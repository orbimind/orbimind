import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Header from './components/Headers/Header';
import Posts from './components/Posts/Posts';
import SinglePost from './components/Posts/SinglePost';
import Tags from './components/Tags/Tags';
import Profile from './components/Profile'
import { Login, Register, ForgotPassword } from "./components/Auth";
import { LoginRoute, LoggedRoute } from './components/Routing';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path='/' exact component={Posts} />
        <Route path='/posts' component={Posts} />
        <Route path='/post/:post_id' component={SinglePost} />
        <Route path='/tags' component={Tags} />
        <LoggedRoute path='/profile'> <Profile /> </LoggedRoute>

        <LoginRoute path='/login'> <Login /> </LoginRoute>
        <LoginRoute path='/register'> <Register /> </LoginRoute>
        <LoginRoute path='/forgot-password'> <ForgotPassword /> </LoginRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
