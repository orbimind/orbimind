import React from 'react';
import Cookies from 'js-cookie';
import { Route, Redirect } from 'react-router-dom';

export function LoginRoute({ children, ...rest }) {
    const token = Cookies.get('token');
    return (
      <Route
        {...rest}
        render={({ location }) =>
            !token 
            ? ( children ) 
            : ( <Redirect to={{pathname: "/", state: { from: location } }}/> )
        }
      />
    );
}

export function LoggedRoute({ children, ...rest }) {
  const token = Cookies.get('token');
  return (
    <Route
      {...rest}
      render={({ location }) =>
          token 
          ? ( children ) 
          : ( <Redirect to={{pathname: "/login", state: { from: location } }}/> )
      }
    />
  );
}