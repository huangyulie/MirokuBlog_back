import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper, ProTable } from '@ant-design/pro-components';
import ModalBasic from './ModalBasic';
import type { ProColumns } from '@ant-design/pro-components';
import { Card, Image, Popconfirm, message, Modal, Form, Input, Button } from 'antd';
import request from 'umi-request';

import './index.less';
import Upload from './Upload';

export type TableListItem = {
  username: string;
  desc: string;
  imgUrl: string;
  link: string;
};

const Admin: React.FC = () => {
  const [res, setRes] = useState<TableListItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data1 , setData] = useState();
  const myRef = useRef<any>();
  const [form] = Form.useForm();
  const [ id , setId] = useState();
  const [length , setLength] = useState();

  const showModal = (record: any) => {
    form.setFieldsValue(record)
    setId(record._id)
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '图像',
      dataIndex: 'imgUrl',
      width: 100,
      render: (_, record) => <Image height={100} width={100} src={record.imgUrl} />,
    },
    {
      title: '名称',
      width: 100,
      dataIndex: 'username',
      align: 'center',
    },
    {
      title: '描述',
      width: 300,
      dataIndex: 'desc',
      align: 'center',
    },
    {
      title: '链接',
      width: 100,
      dataIndex: 'link',
      align: 'center',

      render: (_, record) => {
        return (
          <a href={record.link} target="blank">
            {record.link}
          </a>
        );
      },
    },
    {
      title: '操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      align: 'center',

      render: (_, record) => [
        <a key="link" onClick={()=>showModal(record)}>
          修改
        </a>,
        <Popconfirm
          key={'link2'}
          title="确认删除"
          onConfirm={() => confirm(record)}
          okText="Yes"
          cancelText="No"
        >
          <a href="#">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const confirm = async (props: any) => {
    await request('/api/friend/delete', {
      method: 'POST',
      data: props,
    });
    let { data } = await request('/api/friend/index', {
      method: 'GET',
    });
    setRes(data);
    message.success('删除成功');
  };

  const data = async () => {
    let { data } = await request('/api/friend/index', {
      method: 'GET',
    });
    setLength(data.length);
    setRes(data);
  };

  const onFinish = async(values: any) => {
    let res: any = data1;
    if(res === undefined){
      values.imgUrl = 'http://localhost:3001/img/loading.png'

    }else{
      values.imgUrl = res.imgUrl;
    }
    await request('/api/friend/change',{
      method:'POST',
      data:{...values,id}
    })    
    data();
    setIsModalOpen(false);
    setData(undefined);
    myRef.current.resetFields();
    message.success('成功提交');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onHandle = (props: any)=>{
    setData(props);
  }

  useEffect(() => {
    data();
  }, []);
  return (
    <PageHeaderWrapper>
      <Card title={`友链总共${length}条`} extra={<ModalBasic msg={data} />}>
        <ProTable<TableListItem>
          bordered
          dataSource={res}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
          columns={columns}
          options={false}
          search={false}
          dateFormatter="string"
        />
      </Card>

      <Modal title="修改" footer={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Form
          ref={myRef}
          form={form}
          name="basic"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 24 }}
          autoComplete="off"
        >
          <Form.Item label="名称" name="username" rules={[{ required: true }]}>
            <Input/>
          </Form.Item>

          <Form.Item label="描述" name="desc" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="链接" name="link" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="图像" name="imgUrl">
            <Upload Handle={onHandle} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
            <Button type="primary" htmlType="submit">
              修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Admin;
