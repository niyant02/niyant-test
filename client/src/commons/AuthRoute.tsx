import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

const AuthRoute = ({ ...rest }) => (
    <AuthLayout>
        <Route
            exact
            {...rest}
            render={(props) => {
                return <Component {...props} />;
            }}
        />
    </AuthLayout>
);

export default AuthRoute;
