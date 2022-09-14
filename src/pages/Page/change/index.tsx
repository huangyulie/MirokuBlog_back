import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-components';
import {
  Button,
  Card,
  Space,
  Modal,
  Select,
  Input,
  Checkbox,
  Form,
  Row,
  Col,
  Tag,
  message,
} from 'antd';
import MdEditor from 'md-editor-rt';
import { history, useParams } from 'umi';
import axios from 'axios';
import request from 'umi-request';
import 'md-editor-rt/lib/style.css';
import moment from 'moment';

const { Option } = Select;

interface LabelIprops {
  name: string;
  color: string;
  _id: number;
}

interface ClassifyIprops {
  name: string;
  imgUrl: string;
  _id: number;
}

const Admin: React.FC = () => {
  const [text, setText] = useState('>输入你滴博客哒！');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [label, setLabel] = useState<LabelIprops[]>();
  const [classify, setClassify] = useState<ClassifyIprops[]>();
  const [init, setInit] = useState<any>({ startDate: +new Date() });
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [ time , setTime ] = useState<any>();
  const params = useParams<any>();
  const MyRef = useRef<any>();

  useEffect(() => {
    data1();
    data2();
    const { id } = params;
    if (id !== 'add') {
      data3();
      setIsAdd(false);
    } else {
      setIsAdd(true);
    }
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
    let { data } = await request('/api/acticle/changeOne', {
      method: 'POST',
      data: params,
    });
    const { text, classify, label, name, startDate } = data;
    setTime(startDate);
    setText(text);
    setInit({
      name,
      classify,
      label,
      startDate,
    });
    console.log(data);
  };

  const onclick = () => {
    history.push('/admin/sub-page');
  };

  const clickHandle = () => {
    setIsModalOpen(true);
    console.log(text);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onUploadImg = async (files: any, callback: any) => {
    const res = await Promise.all(
      files.map((file: any) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append('img', file);
          axios
            .post('/api/img/upload', form, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((res) => rev(res))
            .catch((error) => rej(error));
        });
      }),
    );

    callback(res.map((item) => item.data.data.imgUrl));
  };

  const onFinish = async (values: any) => {
    console.log('Success:', values);
    values.text = text;
    if (isAdd) {
      await request('/api/acticle/add', {
        method: 'POST',
        data: values,
      });
    }else{
      const { id } = params;
      values.id = id;
      await request('/api/acticle/change',{
        method:"POST",
        data:values
      })
    }

    MyRef.current!.resetFields();
    message.success('提交成功');
    setIsModalOpen(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <PageHeaderWrapper>
      <Card
        title="文章"
        extra={
          <Space>
            <Button onClick={clickHandle}>提交</Button>
            <Button onClick={onclick}>返回</Button>
          </Space>
        }
      >
        <MdEditor
          toolbarsExclude={['github', 'prettier']}
          modelValue={text}
          onChange={setText}
          previewTheme={'cyanosis'}
          onUploadImg={onUploadImg}
        />
      </Card>
      <Modal
        footer={false}
        title="文章选择"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          ref={MyRef}
          name="basic"
          labelCol={{ span: 24 }}
          initialValues={init}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="文章标题"
            name="name"
            rules={[{ required: true, message: '请输入文章名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="classify" label="分类" rules={[{ required: true }]}>
            <Select placeholder="选择一个分类" allowClear>
              {classify?.map((item) => {
                return <Option value={item._id}>{item.name}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item name="label" label="标签" rules={[{ required: true }]}>
            <Checkbox.Group>
              <Row>
                {label?.map((item) => {
                  return (
                    <Col span={6} style={{ marginTop: '10px' }}>
                      <Checkbox value={item._id}>
                        <Tag color={item.color}>{item.name}</Tag>
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item label="创建时间" name="startDate">
            <div>{isAdd?moment().format('YYYY年MM月DD日 HH:mm'):moment(parseInt(time)).format('YYYY年MM月DD日 HH:mm')}</div>
            <Input type={'hidden'} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Admin;
