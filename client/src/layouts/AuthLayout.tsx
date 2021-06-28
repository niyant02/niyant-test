import React, { Component } from 'react';
import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

class AuthLayout extends Component {
    render() {
        return (
            <>
                <Layout>
                    <Header></Header>
                    <Content className="auth-layout">{this.props.children}</Content>
                    <Footer></Footer>
                </Layout>
            </>
        );
    }
}

export default AuthLayout;
