import React from 'react';
import Cookies from 'js-cookie';
import { Route, Redirect } from 'react-router-dom';

export function LoginRoute({ children, ...rest }) {
    const user = Cookies.getJSON('user');
    return (
      <Route
        {...rest}
        render={({ location }) =>
            !user 
            ? ( children ) 
            : ( <Redirect to={{pathname: `/user/${ user.username }`, state: { from: location } }}/> )
        }
      />
    );
}

export function LoggedRoute({ children, ...rest }) {
  const user = Cookies.getJSON('user');
  return (
    <Route
      {...rest}
      render={({ location }) =>
          user 
          ? ( children ) 
          : ( <Redirect to={{pathname: "/login", state: { from: location } }}/> )
      }
    />
  );
}
