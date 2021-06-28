import React from 'react';
import { ConfigProvider } from 'antd';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';
import Routes from './commons/Routes';
import './App.scss';

const history = createBrowserHistory();

function App() {
    return (
        <Router history={history}>
            <ConfigProvider>
                <Routes />
            </ConfigProvider>
        </Router>
    );
}

export default App;
