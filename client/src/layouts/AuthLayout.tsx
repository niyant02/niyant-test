import { Component } from 'react';
import { Layout } from 'antd';

const { Header, Footer, Content } = Layout;

class AuthLayout extends Component {
    render() {
        return (
            <>
                <Layout className="auth-layout">
                    <Header></Header>
                    <Content>{this.props.children}</Content>
                    <Footer></Footer>
                </Layout>
            </>
        );
    }
}

export default AuthLayout;
