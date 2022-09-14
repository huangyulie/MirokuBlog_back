import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-components';
import { Button, Card, Col, Row } from 'antd';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import request from 'umi-request';
import './index.less';
import { history } from 'umi';

const Admin: React.FC = () => {
  const [text, setText] = useState('hello md-editor-rt!\n >21123213');
  const [text1, setText1] = useState('hello md-editor-rt!\n >21123213');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const data = async () => {
      let { data } = await request('/api/about/about');
      setText(data[0].text);
      setText1(data[1].text);
      setLoading(false);
    };
    data();
  }, []);

  const clickHandle = (props: string) => {
    history.push(`/about/change/${props}`);
  };
  return (
    <PageHeaderWrapper>
      <Card
        loading={loading}
        title="关于"
        extra={
          <>
            <Button style={{margin:'0 10px 0 0'}} onClick={()=>clickHandle('me')}>修改关于我</Button>
            <Button onClick={()=>clickHandle('us')}>修改本站</Button>
          </>
        }
      >
        <Row>
          <Col xs={24} md={24} lg={12}>
            <div className="about h1">
              <div className="about-text">😜 关于我</div>
              <MdEditor
                modelValue={text}
                onChange={setText}
                previewOnly
                previewTheme={'cyanosis'}
              />
            </div>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <div className="about h2">
              <div className="about-text">🏭 关于本站</div>
              <MdEditor
                modelValue={text1}
                onChange={setText}
                previewOnly
                previewTheme={'cyanosis'}
              />
            </div>
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Admin;
