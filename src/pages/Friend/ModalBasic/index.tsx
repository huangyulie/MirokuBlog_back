import { useRef, useState } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import request from 'umi-request';
import Upload from '../Upload/index'


export default (props: any)=> {
  const [visible , setVisible] = useState(false);
  const [data , setData] = useState();
  const {msg} = props;
  const myRef = useRef<any>();
  
  const showModal = () => {
    setVisible(true)
  };

  const handleOk = (e: any) => {
    setVisible(false)
  };

  const handleCancel = (e: any) => {
    setVisible(false)
  };

  const onFinish = async(values: any) => {
    let res: any = data;
    console.log(res);
    if(res === undefined){
      values.imgUrl = 'http://localhost:3001/img/loading.png'

    }else{
      values.imgUrl = res.imgUrl;
    }
    await request('/api/friend/add',{
      method:'POST',
      data:values
    })    
    msg();
    setVisible(false);
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
    return (
      <div>
        <Button type="primary" onClick={showModal}>
          添加
        </Button>
        <Modal
          title="添加友链"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={false}
        >
          <Form
            ref={myRef}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            labelCol={{span:24}}
            autoComplete="off"
          >
            <Form.Item
              label="名称"
              name="username"
              rules={[{required:true}]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="描述"
              name="desc"
              rules={[{required:true}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="链接"
              name="link"
              rules={[{required:true}]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="图像"
              name="imgUrl"
            >
              <Upload Handle={onHandle}/>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
}

// export default () => (
//       <App />
// );
