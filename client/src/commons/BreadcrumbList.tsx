import { Breadcrumb } from 'antd';

const BreadcrumbList = (props: any) => {
    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            {props.lists.map((item: any, index: number) => (
                <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
            ))}
        </Breadcrumb>
    );
};

export default BreadcrumbList;
