import { Helmet } from 'react-helmet';
import { Form, Input, Button, Checkbox, Row, Col, Typography, message } from 'antd';
import client from '../client';
import { AUTH_TOKEN, USER } from '../constants';
import { Link, useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';

const { Item: FormItem } = Form;
const { Title } = Typography;

const Login = () => {
    const history = useHistory();

    const onFinish = (values: any) => {
        client
            .post('/login', {
                email: values.email,
                password: values.password,
            })
            .then((res: any) => {
                const { data, message: responseMessage, success } = res.data;
                if (success) {
                    message.success(responseMessage);
                    localStorage.clear();
                    localStorage.setItem(AUTH_TOKEN, data.token);
                    localStorage.setItem(USER, JSON.stringify(data.user));
                    history.push('/property');
                } else {
                    message.error(responseMessage);
                }
            })
            .catch((err: any) => {
                const { errors } = err.response.data;
                message.error(errors[0].msg);
            });
    };

    const responseGoogle = (response: any) => {
        console.log(response);
        const { googleId, profileObj } = response;
        client
            .post('/login/google', {
                email: profileObj.email,
                socialId: googleId,
                name: profileObj.name,
                profile: profileObj.imageUrl,
            })
            .then((res: any) => {
                const { data, message: responseMessage, success } = res.data;
                if (success) {
                    message.success(responseMessage);
                    localStorage.clear();
                    localStorage.setItem(AUTH_TOKEN, data.token);
                    localStorage.setItem(USER, JSON.stringify(data.user));
                    history.push('/property');
                } else {
                    message.error(responseMessage);
                }
            })
            .catch((err: any) => {
                const { errors } = err.response.data;
                message.error(errors[0].msg);
            });
    };

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div className="container">
                <Row gutter={24} justify="center" align="middle">
                    <Col span={8}>
                        <Title level={2}>Login</Title>
                        <Form name="login" layout="vertical" initialValues={{ remember: true }} onFinish={onFinish}>
                            <FormItem
                                label="Email Address"
                                name="email"
                                hasFeedback
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input type={'email'} />
                            </FormItem>

                            <FormItem
                                label="Password"
                                name="password"
                                hasFeedback
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </FormItem>

                            <FormItem name="remember" valuePropName="checked">
                                <Checkbox>Remember me</Checkbox>
                            </FormItem>

                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </FormItem>

                            <p className="text-center">OR</p>

                            <FormItem>
                                <GoogleLogin
                                    clientId="382135382848-om4c30i4gp1ntf9bncpqgi9lsksjkg2t.apps.googleusercontent.com"
                                    buttonText="Login"
                                    onSuccess={responseGoogle}
                                    onFailure={responseGoogle}
                                    redirectUri="https://niyant-test.com:3000/callback"
                                />
                            </FormItem>

                            <p>
                                <Link to="/register">Create an account.</Link>
                            </p>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default Login;
