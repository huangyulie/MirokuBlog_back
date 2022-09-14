import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-components';
import { Button, Card, message } from 'antd';
import MdEditor from 'md-editor-rt';
import request from 'umi-request';
import 'md-editor-rt/lib/style.css';
import '../index.less';
import { useParams } from 'react-router-dom';
import { history } from 'umi';
import axios from 'axios';

const Admin: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('hello md-editor-rt!\n >21123213');
  const [id, setId] = useState(0);
  const params = useParams();
  useEffect(() => {
    const data = async () => {
      let { data } = await request('/api/about/about');
      // console.log(data);
      if ((params as { id: string }).id === 'me') {
        setText(data[0].text);
        setId(data[0]._id);
      } else {
        setText(data[1].text);
        setId(data[1]._id);
      }
      setLoading(false);
    };
    data();
  }, []);

  const clickHandle = () => {
    history.push('/about');
  };

  const submitHandle = async () => {
    await request('/api/about/change', {
      method: 'POST',
      data: {
        id,
        text,
      },
    });
    message.success('提交成功');
    history.push('/about');
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

  return (
    <PageHeaderWrapper>
      <Card loading={loading} title="修改" extra={<Button onClick={clickHandle}>返回</Button>}>
        <div className="about">
          <div className="about-text">
            {(params as { id: string }).id === 'me' ? '😜 关于我' : '🏭 关于本站'}
            <Button onClick={submitHandle} type="primary" className="Button">
              提交
            </Button>
          </div>
          <MdEditor
            toolbarsExclude={['github', 'prettier']}
            modelValue={text}
            onChange={setText}
            previewTheme={'cyanosis'}
            onUploadImg={onUploadImg}
          />
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Admin;
