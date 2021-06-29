import { Switch, Route } from 'react-router-dom';
import Login from '../components/Login';
import NotFound from './NotFound';
import AuthRoute from './AuthRoute';
import Register from '../components/Register';
import AppRoute from './AppRoute';
import PropertyList from '../components/property/PropertyList';
import CreateProperty from '../components/property/CreateProperty';
import EditProperty from '../components/property/EditProperty';

const Routes = () => {
    return (
        <Switch>
            <AuthRoute exact path="/" component={Login} />
            <AuthRoute exact path="/register" component={Register} />
            <AppRoute exact path="/property" component={PropertyList} />
            <AppRoute exact path="/add-property" component={CreateProperty} />
            <AppRoute exact path="/edit-property" component={EditProperty} />
            <Route
                path="/callback"
                render={({ staticContext }) => {
                    console.log(staticContext);
                    return staticContext;
                }}
            />
            <Route component={NotFound} />
        </Switch>
    );
};

export default Routes;
