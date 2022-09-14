import React, { ChangeEvent, useEffect, useState } from 'react';
import { Space, Table, Upload, message, Popconfirm, Button, Modal, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-components';
import { Card, Image } from 'antd';
import request from 'umi-request';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Admin: React.FC = () => {
  const [res, setRes] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [length, setLength] = useState<number>(0);
  const [Add, setAdd] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [text, setText] = useState<string>('');
  const [ imgUrl , setImgUrl] = useState<string>('');
  const [id,setId] = useState<number>();

  useEffect(() => {
    data1();
  }, []);

  const showModal = (props: any) => {
    console.log(props);
    if (props.isAdd) {
      setAdd(true);
    } else {
      setText(props.name);
      setFileList([
        {
          uid: '-1',
          name: props.name,
          status: 'done',
          url: props.imgUrl,
        },
      ]);
      setId(props._id);
      setImgUrl(props.imgUrl);
      setAdd(false);
    }
    setIsModalOpen(true);
  };

  const handleOk = async() => {
    if (Add) {
      await request('/api/classify/add',{
        method:"POST",
        data:{
          imgUrl,
          name:text
        }
      })
    } else {
      await request('/api/classify/change',{
        method:'POST',
        data:{
          imgUrl,
          name:text,
          id
        }
      })
    }
    data1();
    setIsModalOpen(false);
    setFileList([]);
    setImgUrl('');
    setText('');
    setId(0)
  };

  const handleCancel = () => {
    setFileList([]);
    setText('');
    setImgUrl('');
    setIsModalOpen(false);
    setId(0)
  };

  const data1 = async () => {
    let { data } = await request('/api/classify/index', {
      method: 'GET',
    });
    setLength(data.length);
    setRes(data);
  };

  const confirm = async (props: any) => {
    console.log(props);
    const { _id } = props;
    await request('/api/classify/delete', {
      method: 'POST',
      data: {
        _id: _id,
      },
    });
    data1();
    message.success('删除成功');
  };

  const columns: any = [
    {
      title: '分类图像',
      dataIndex: 'imgUrl',
      width: '100px',
      key: 'age',
      render: (_: any, record: any) => {
        return <Image width={100} height={100} src={record.imgUrl} />;
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: '600px',
      key: 'name',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (
        _: any,
        record: {
          name:
            | boolean
            | React.ReactChild
            | React.ReactFragment
            | React.ReactPortal
            | null
            | undefined;
        },
      ) => (
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

  const handleCancel1 = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList, file }) => {
    setFileList(newFileList);
    let { response } = file;
    if (response === undefined) {
    } else {
      let { data } = response;
      setImgUrl(data.imgUrl)
      console.log(data);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onchangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <PageHeaderWrapper>
      <Card
        title={`分类总共${length}种`}
        extra={<Button onClick={() => showModal({ isAdd: true })}>添加</Button>}
      >
        <Table
          pagination={{ pageSize: 10, showQuickJumper: true }}
          columns={columns}
          dataSource={res}
          bordered
        />
      </Card>

      <Modal title="分类" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        分类名称:
        <Input value={text} onChange={onchangeHandle} />
        封面头像:
        <Upload
          action="/api/img/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          name="img"
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel1}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Admin;
