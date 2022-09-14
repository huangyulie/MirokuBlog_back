import React, { ChangeEvent, useEffect, useState } from 'react';
import { EllipsisOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, PageHeaderWrapper } from '@ant-design/pro-components';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Card, Input, Space, Table, Tag, Select, message, Popconfirm } from 'antd';
import { useRef } from 'react';
import request from 'umi-request';
import type { ColumnsType } from 'antd/es/table';
import { history } from 'umi';
import moment from 'moment';

const { Option } = Select;

interface LabelIprops {
  _id: number;
  name: string;
  color: string;
}

interface ClassifyIprops {
  name: string;
  _id: number;
  imgUrl: string;
}

const Admin: React.FC = () => {
  const [label, setLabel] = useState<LabelIprops[]>();
  const [text, setText] = useState<string>();
  const [classify, setClassify] = useState<ClassifyIprops[]>();
  const [select1, setSelect1] = useState<string>('');
  const [select2, setSelect2] = useState<string>('');
  const [acticle, setActicle] = useState([]);

  useEffect(() => {
    data1();
    data2();
    data3();
  }, []);

  const data1 = async () => {
    let { data } = await request('/api/label/index', {
      method: 'GET',
    });
    setLabel(data);
  };

  const data2 = async () => {
    let { data } = await request('/api/classify/index', {
      method: 'GET',
    });
    setClassify(data);
  };

  const data3 = async () => {
    let { data } = await request('/api/acticle/all', {
      method: 'GET',
    });
    setActicle(data);
  };

  const confirm = async (props: any) => {
    await request('/api/acticle/delete', {
      method: 'POST',
      data: props,
    });
    data3();
    message.success('删除成功');
  };

  const columns: ColumnsType<any> = [
    {
      title: '文章名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'classify',
      key: 'classify',
      render: (_, record: any) => {
        return <div>{record.classify.name}</div>;
      },
    },
    {
      title: '标签',
      key: 'label',
      dataIndex: 'label',
      render: (_, { label }: any) => (
        <>
          {label.map((item: any) => {
            return (
              <Tag color={item.color} key={item._id}>
                {item.name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (_, record: any) => {
        return <div>{moment(parseInt(record.startDate)).format('YYYY年MM月DD日')}</div>;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'refershDate',
      key: 'refershDate',
      render: (_, record: any) => {
        if (record.refershDate == undefined) {
          return <div>未更新</div>;
        } else {
          return <div>{moment(parseInt(record.refershDate)).format('YYYY年MM月DD日')}</div>;
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => onclick(record._id)}>修改</a>
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

  const onChange = async (value: any, type: string) => {
    if (type === '分类') {
      let { data } = await request('/api/acticle/findClassify', {
        method: 'POST',
        data: {
          classify: value,
        },
      });
      setActicle(data);
      setSelect1(value);
      setSelect2('');
      setText('');
    } else {
      let { data } = await request('/api/acticle/findLabel', {
        method: 'POST',
        data: {
          label: value,
        },
      });
      setActicle(data);
      setSelect2(value);
      setSelect1('');
      setText('');
    }
  };

  const onSearch = (value: string, type: string) => {
    if (type === '分类') {
      setSelect1(value);
      setSelect2('');
      setText('');
    } else {
      setSelect2(value);
      setSelect1('');
      setText('');
    }
  };

  const onChangeHandle = async (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    let { arr } = await request('/api/acticle/find', {
      method: 'POST',
      data: {
        name: e.target.value,
      },
    });
    setActicle(arr);
    setSelect1('');
    setSelect2('');
  };

  const OnclickHandle = () => {
    data3();
    setText('');
    setSelect1('');
    setSelect2('');
    message.success('重置成功');
  };

  const onclick = (props: any) => {
    if (props.isAdd === undefined) history.push(`/admin/sub-page/change/${props}`);
    else history.push(`/admin/sub-page/change/${'add'}`);
  };

  return (
    <PageHeaderWrapper>
      <Card title={`文章总共${acticle.length}篇`} extra={<Button onClick={() => onclick({ isAdd: true })}>添加</Button>}>
        <Space>
          搜索文章:
          <Input placeholder="搜索文章名" value={text} onChange={onChangeHandle} />
          搜索分类:
          <Select
            showSearch
            placeholder="选择分类"
            optionFilterProp="children"
            onChange={(v) => onChange(v, '分类')}
            onSearch={(v) => onSearch(v, '分类')}
            filterOption={(input, option) =>
              (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
            value={select1}
            style={{ width: 200 }}
          >
            {classify?.map((item) => {
              return <Option value={item._id}>{item.name}</Option>;
            })}
          </Select>
          搜索标签:
          {/*  */}
          <Select
            mode="multiple"
            style={{ width: 300 }}
            placeholder="选择标签"
            onChange={(v) => onChange(v, '标签')}
            // value={select2}
            filterOption={(input, option) =>
              (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
            }
          >
            {label?.map((item) => {
              return <Option key={item._id}>{item.name}</Option>;
            })}
          </Select>
          {/*  */}
          重置按钮:
          <Button onClick={OnclickHandle}>
            <RedoOutlined />
          </Button>
        </Space>
        <Table
          style={{ marginTop: '20px' }}
          columns={columns}
          dataSource={acticle}
          pagination={{ pageSize: 10, showQuickJumper: true }}
        />
      </Card>
    </PageHeaderWrapper>
  );
};

export default Admin;
