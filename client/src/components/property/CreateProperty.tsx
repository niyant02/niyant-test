import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Form, Input, Button, Typography, message } from 'antd';
import BreadcrumbList from '../../commons/BreadcrumbList';
import client from '../../client';
import { useHistory } from 'react-router';

const lists: any[] = [
    {
        path: '/property',
        name: 'Home',
    },
    {
        path: '',
        name: 'Create Property',
    },
];

const { Title } = Typography;

const CreateProperty = () => {
    const [form] = Form.useForm();
    const [state, setState] = useState({});
    const history = useHistory();

    const handleChange = (field: string, event: any) => {
        setState({ ...state, [field]: event.target.value });
    };

    const onSubmit = (values: any) => {
        client
            .post('/create/property', {
                propertyName: values.name,
                location: values.location,
                latitude: values.latitude,
                longitude: values.longitude,
            })
            .then((res: any) => {
                const { success, message: responseMessage } = res.data;
                if (success) {
                    message.success(responseMessage);
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
                <title>Property List</title>
            </Helmet>
            <BreadcrumbList lists={lists} />
            <div className="bg-white" style={{ padding: 24, minHeight: 380 }}>
                <Row gutter={24}>
                    <Col span={24}>
                        <Title level={3}>Create Property</Title>
                        <Form name="addProperty" layout="vertical" form={form} onFinish={onSubmit}>
                            <Row gutter={[24, 12]}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please input property name!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            name="name"
                                            placeholder="enter property name"
                                            onChange={(event) => handleChange('name', event)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Location"
                                        name="location"
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please input property location!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            name="location"
                                            placeholder="enter property location"
                                            onChange={(event) => handleChange('location', event)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Latitude"
                                        name="latitude"
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please input property latitude!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            name="latitude"
                                            placeholder="enter property latitude"
                                            onChange={(event) => handleChange('latitude', event)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Longitude"
                                        name="longitude"
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                message: 'Please input property longitude!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            name="longitude"
                                            placeholder="enter property longitude"
                                            onChange={(event) => handleChange('longitude', event)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default CreateProperty;
