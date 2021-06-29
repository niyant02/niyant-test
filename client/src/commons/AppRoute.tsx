import { Component } from 'react';
import { Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

const AppRoute = ({ ...rest }) => (
    <AppLayout>
        <Route
            exact
            {...rest}
            render={(props) => {
                return <Component {...props} />;
            }}
        />
    </AppLayout>
);

export default AppRoute;
