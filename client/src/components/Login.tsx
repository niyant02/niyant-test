import React from 'react';
import { Helmet } from 'react-helmet';
import { Form, Input, Button, Checkbox, Row, Col, Typography, message } from 'antd';
import client from '../client';
import { AUTH_TOKEN, USER } from '../constants';
import { Link } from 'react-router-dom';

const { Item: FormItem } = Form;
const { Title } = Typography;

const Login = () => {
    const onFinish = (values: any) => {
        console.log('Success:', values);
        client
            .post('/login', {
                email: values.email,
                password: values.password,
            })
            .then((res: any) => {
                const { data, message: responseMessage, success } = res.data;
                if (success) {
                    message.success(responseMessage);
                    localStorage.setItem(AUTH_TOKEN, data.token);
                    localStorage.setItem(USER, JSON.stringify(data.user));
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
