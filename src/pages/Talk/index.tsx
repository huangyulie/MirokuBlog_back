import React, { ChangeEvent, useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-components';
import { Button, Card, Space, Table, Modal, Input, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from 'umi-request';
import moment from 'moment';

interface DataType {
  _id?: number;
  text?: string;
  date?: number;
  Add?: boolean;
}

const Admin: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [talk, setTalk] = useState<DataType[]>([]);
  const [text, setText] = useState<string | undefined>('');
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [date, setDate] = useState<number | undefined>(+new Date());
  const [id, setId] = useState<number | undefined>(0);

  useEffect(() => {
    data1();
  }, []);

  const showModal = (props: DataType) => {
    if (props.Add) {
      setIsAdd(true);
      setDate(+new Date());
    } else {
      const { text, date, _id } = props;
      setText(text);
      setDate(date);
      setIsAdd(false);
      setId(_id);
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    console.log(isAdd);
    if (isAdd) {
      await request('/api/talk/add', {
        method: 'POST',
        data: {
          text,
          date: +new Date(),
        },
      });
    } else {
      await request('/api/talk/change', {
        method: 'POST',
        data: {
          text,
          id,
        },
      });
    }

    data1();
    setText('');
    message.success('提交成功!');
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setText('');
    setIsModalOpen(false);
  };

  const confirm = async (props: DataType) => {
    await request('/api/talk/delete', {
      method: 'POST',
      data: props,
    });
    data1();
    message.success('删除成功');
  };

  const data1 = async (): Promise<void> => {
    let { data } = await request('/api/talk/index', {
      method: 'GET',
    });
    setTalk(data);
    return;
  };

  const columns: ColumnsType<DataType> = [
    {
      title: '内容',
      dataIndex: 'text',
      key: 'text',
    },
    {
      title: '发布时间',
      dataIndex: 'date',
      key: 'date',
      render: (_, record) => {
        return <div>{moment(record.date).format('YYYY年MM月DD日 HH:mm')}</div>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showModal(record)}>修改</a>
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

  const changeHandle = (e?: ChangeEvent<HTMLInputElement>) => {
    setText(e!.target.value);
  };

  return (
    <PageHeaderWrapper>
      <Card
        title={'说说管理'}
        extra={<Button onClick={() => showModal({ Add: true })}>添加</Button>}
      >
        <Table columns={columns} dataSource={talk} />
      </Card>
      <Modal
        title="说说"
        open={isModalOpen}
        okText={'提交'}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        内容:
        <Input onChange={changeHandle} value={text} />
        时间:
        <div>{moment(date).format('YYYY年MM月DD日 HH:mm')}</div>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Admin;
