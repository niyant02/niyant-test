import { Component } from 'react';
import { Layout, Menu } from 'antd';
import { RadarChartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Footer, Content } = Layout;

class AppLayout extends Component {
    state = {
        current: window.location.pathname ? window.location.pathname : '/property',
    };

    handleClick = (e: any) => {
        this.setState({ current: e.key });
    };

    render() {
        const { current } = this.state;

        return (
            <>
                <Layout className="app-layout">
                    <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                        <div className="logo-container">
                            <RadarChartOutlined />
                        </div>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            onClick={this.handleClick}
                            selectedKeys={[current]}
                            defaultSelectedKeys={[current]}
                        >
                            <Menu.Item key="/add-property">
                                <Link to="/add-property">Add Property</Link>
                            </Menu.Item>
                            <Menu.Item key="/property">
                                <Link to="/property">Property</Link>
                            </Menu.Item>
                        </Menu>
                    </Header>
                    <Content style={{ padding: '0 50px', marginTop: 64 }}>{this.props.children}</Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Created by Niyant Shah{' '}
                        <a href="https://github.com/niyant02" target="_blank" rel="noreferrer">
                            @niyant02
                        </a>
                    </Footer>
                </Layout>
            </>
        );
    }
}

export default AppLayout;
