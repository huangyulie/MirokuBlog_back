import React, { ChangeEvent, useEffect, useState } from 'react';
import { Card, Space, Table, Tag, message, Popconfirm, Radio, Modal, Input, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from 'umi-request';
import type { RadioChangeEvent } from 'antd';

import { PageHeaderWrapper } from '@ant-design/pro-components';
interface DataType {
  _id?: number;
  color?: string;
  name?: string;
  isAdd?: Boolean;
}

const Admin: React.FC = () => {
  const [source, setSource] = useState<DataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState<string>('芝士模板');
  const [color, setColor] = useState<string>('red');
  const [id, setId] = useState<number>();
  const [Add, setAdd] = useState(false);
  const [length, setLength] = useState<number>(0);

  useEffect(() => {
    data();
  }, []);
  const columns: ColumnsType<DataType> = [
    {
      title: '标签名',
      key: 'name',
      dataIndex: 'name',
      render: (_, record) => (
        <>
          <Tag color={record.color}>{record.name}</Tag>
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => changeHandle(record)}>修改</a>
          <Popconfirm
            title="确认删除"
            onConfirm={() => confirm(record)}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleOk = async () => {
    console.log(Add);
    if (Add) {
      await request('/api/label/add', {
        method: 'POST',
        data: {
          name: text,
          color,
        },
      });
    } else {
      await request('/api/label/change', {
        method: 'POST',
        data: {
          name: text,
          color,
          id,
        },
      });
      message.success('修改成功');
    }

    setIsModalOpen(false);
    data();
    setText('');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setText('');
  };

  const changeHandle = (props: any) => {
    setIsModalOpen(true);
    if (props.isAdd) setAdd(true);
    else {
      setId(props._id);
      setText(props.name);
      setColor(props.color);
      setAdd(false);
    }
  };

  const confirm = async (props?: DataType) => {
    await request('/api/label/delete', {
      method: 'POST',
      data: props,
    });
    data();
    message.success('删除成功');
  };

  const data = async () => {
    let { data } = await request('/api/label/index', {
      method: 'GET',
    });
    setLength(data.length);
    setSource(data);
  };

  const onChange = (e: RadioChangeEvent) => {
    setColor(e.target.value);
  };

  const onchangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  

  return (
    <PageHeaderWrapper>
      <Card
        title={`标签总共${length}个`}
        extra={<Button onClick={() => changeHandle({ isAdd: true })}>添加</Button>}
      >
        <Table
          columns={columns}
          dataSource={source}
          bordered
          pagination={{ pageSize: 20, showQuickJumper: true }}
        />
      </Card>
      <Modal title="标签名" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        标签名:
        <Input onChange={onchangeHandle} value={text} />
        选择颜色:
        <br />
        <Radio.Group onChange={onChange} defaultValue="magenta">
          <Space wrap>
            <Radio.Button value="magenta" style={{ backgroundColor: 'magenta' }}>
              magenta
            </Radio.Button>
            <Radio.Button value="red" style={{ backgroundColor: 'red' }}>
              red
            </Radio.Button>
            <Radio.Button value="orange" style={{ backgroundColor: 'orange' }}>
              orange
            </Radio.Button>
            <Radio.Button value="gold" style={{ backgroundColor: 'gold' }}>
              gold
            </Radio.Button>
            <Radio.Button value="lime" style={{ backgroundColor: 'lime' }}>
              lime
            </Radio.Button>
            <Radio.Button value="green" style={{ backgroundColor: 'green' }}>
              green
            </Radio.Button>
            <Radio.Button value="cyan" style={{ backgroundColor: 'cyan' }}>
              cyan
            </Radio.Button>
            <Radio.Button value="blue" style={{ backgroundColor: 'blue' }}>
              blue
            </Radio.Button>
            <Radio.Button value="geekblue" style={{ backgroundColor: 'geekblue' }}>
              geekblue
            </Radio.Button>
            <Radio.Button value="purple" style={{ backgroundColor: 'purple' }}>
              purple
            </Radio.Button>
          </Space>
        </Radio.Group>
        <br />
        样式:
        <br />
        <Tag
          color={color}
          style={{ height: '30px', lineHeight: '30px', textAlign: 'center', fontSize: '20px' }}
        >
          {text}
        </Tag>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Admin;
