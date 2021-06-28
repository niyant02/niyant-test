import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from '../components/Login';
import NotFound from './NotFound';
import AuthRoute from './AuthRoute';
import Register from '../components/Register';

const Routes = () => {
    return (
        <Switch>
            <AuthRoute exact path="/" component={Login} />
            <AuthRoute exact path="/register" component={Register} />
            <Route component={NotFound} />
        </Switch>
    );
};

export default Routes;
