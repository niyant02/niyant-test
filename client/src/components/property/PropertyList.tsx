import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import BreadcrumbList from '../../commons/BreadcrumbList';
import { Space, Tooltip, Modal, Col, Row, Table, message, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import client from '../../client';
import FavoritesMap from '../../commons/LeafletMap';

const { Title } = Typography;

export type Property = {
    id: number;
    propertyName: string;
    location: string;
    latitude: string;
    longitude: string;
    createdAt: string;
    updatedAt: string;
    createdBy: number;
    deleted: boolean;
};

const lists: any = [
    {
        path: '/',
        name: 'Home',
    },
    {
        path: '',
        name: 'Property List',
    },
];

const PropertyList = () => {
    const [visible, setVisible] = useState<boolean | false>(false);
    const [deleteRecord, setDeleteRecord] = useState<Property | null>(null);
    const [confirmLoading, setConfirmLoading] = useState<boolean | false>(false);
    const [data, setData] = useState<Property[] | []>([]);

    useEffect(() => {
        client
            .get('/properties')
            .then((res: any) => {
                const { success, data: propertyData } = res.data;
                if (success) {
                    setData(propertyData.properties);
                }
            })
            .catch((err: any) => {
                const { errors } = err.response.data;
                message.error(errors[0].msg);
            });
    }, [deleteRecord]);

    const showModal = (record: any) => {
        setVisible(true);
        setDeleteRecord(record);
    };

    const handleOk = () => {
        setConfirmLoading(true);
        client
            .post('/delete/property/' + deleteRecord?.id, {})
            .then((res: any) => {
                const { success, message: responseMessage } = res.data;
                if (success) {
                    message.success(responseMessage);
                    setConfirmLoading(false);
                    setVisible(false);
                    setDeleteRecord(null);
                } else {
                    message.error(responseMessage);
                }
            })
            .catch((err: any) => {
                const { errors } = err.response.data;
                message.error(errors[0].msg);
                setConfirmLoading(false);
            });
    };

    const handleCancel = () => {
        setVisible(false);
        setDeleteRecord(null);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'propertyName',
            key: 'propertyName',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Latitude',
            dataIndex: 'latitude',
            key: 'latitude',
        },
        {
            title: 'Longitude',
            dataIndex: 'longitude',
            key: 'longitude',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: any) => (
                <Space size="middle">
                    <Tooltip placement="bottom" title="Edit">
                        <Link
                            to={{
                                pathname: `/edit-property`,
                                state: { data: record, edit: true },
                            }}
                        >
                            <EditOutlined />
                        </Link>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Delete">
                        {/* eslint-disable-next-line */}
                        <a onClick={() => showModal(record)}>
                            <DeleteOutlined />
                        </a>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            <Helmet>
                <title>Property List</title>
            </Helmet>
            <BreadcrumbList lists={lists} />
            <div className="bg-white" style={{ padding: 24, minHeight: 380 }}>
                <Row gutter={[24, 12]}>
                    <Col span={24}>
                        <Title level={3}>Property List</Title>
                    </Col>
                    <Col span={12}>
                        <FavoritesMap lists={data} />
                    </Col>
                    <Col span={12}>
                        <Table rowKey={(record) => record.id} columns={columns} dataSource={data} />
                    </Col>
                </Row>
            </div>
            <Modal
                title="Delete Property"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                destroyOnClose={true}
                okText="Ok"
                cancelText="Cancel"
            >
                <p>Are you sure to this property?</p>
            </Modal>
        </>
    );
};

PropertyList.displayName = 'PropertyList';

export default PropertyList;
