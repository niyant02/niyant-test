import { useState } from 'react';
import { Form, Input, Checkbox, Button, Row, Col, Typography, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import client from '../client';
const { Item: FormItem } = Form;
const { Title } = Typography;

function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

const Register = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePath, setImagePath] = useState('');
    const history = useHistory();

    const onFinish = (values: any) => {
        console.log(values);
        client
            .post('/register', {
                email: values.email,
                name: values.name,
                password: values.password,
                mobile: values.mobile,
                address: values.address,
                avatar: imagePath,
            })
            .then((res: any) => {
                const { success, message: responseMessage } = res.data;
                if (success) {
                    message.success(responseMessage);
                    history.push('/');
                } else {
                    message.error(responseMessage);
                }
            })
            .catch((err: any) => {
                const { errors } = err.response.data;
                message.error(errors[0].msg);
            });
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            setImagePath(info.file.response.data.imagePath);
            getBase64(info.file.originFileObj, (imageUrl: any) => {
                setImageUrl(imageUrl);
                setLoading(false);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Helmet>
                <title>Register</title>
            </Helmet>
            <div className="container">
                <Row gutter={24} justify="center" align="middle">
                    <Col span={8}>
                        <Title level={2}>Register</Title>
                        <Form
                            name="register"
                            layout="vertical"
                            encType="multipart/form-data"
                            onFinish={onFinish}
                            scrollToFirstError
                        >
                            <FormItem
                                name="email"
                                label="E-mail"
                                hasFeedback
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ]}
                            >
                                <Input />
                            </FormItem>

                            <FormItem
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    {
                                        min: 8,
                                        message: 'Please enter min 8 char.',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password />
                            </FormItem>

                            <FormItem
                                name="confirm"
                                label="Confirm Password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(
                                                new Error('The two passwords that you entered do not match!'),
                                            );
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </FormItem>

                            <FormItem
                                name="name"
                                label="Full name"
                                tooltip="What do you want others to call you?"
                                hasFeedback
                                rules={[{ required: true, message: 'Please input your name!', whitespace: true }]}
                            >
                                <Input />
                            </FormItem>

                            <FormItem
                                name="mobile"
                                label="Phone Number"
                                hasFeedback
                                rules={[{ required: false, message: 'Please input your phone number!' }]}
                            >
                                <Input style={{ width: '100%' }} />
                            </FormItem>

                            <FormItem
                                name="address"
                                label="Address"
                                hasFeedback
                                rules={[{ required: false, message: 'Please input your address!', whitespace: true }]}
                            >
                                <Input />
                            </FormItem>

                            <FormItem>
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="http://localhost:4000/api/profile"
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                >
                                    {imageUrl ? (
                                        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                    ) : (
                                        uploadButton
                                    )}
                                </Upload>
                            </FormItem>

                            <FormItem
                                name="agreement"
                                valuePropName="checked"
                                hasFeedback
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value
                                                ? Promise.resolve()
                                                : Promise.reject(new Error('Should accept agreement')),
                                    },
                                ]}
                            >
                                <Checkbox>
                                    I have read the {/* eslint-disable-next-line */}
                                    <a href="#">agreement</a>
                                </Checkbox>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    Register
                                </Button>
                            </FormItem>

                            <p>
                                Already have an account? <Link to="/">Login</Link>
                            </p>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    );
};
export default Register;
