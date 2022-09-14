import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginFormPage, ProFormText } from '@ant-design/pro-components';
import { login } from '@/services/ant-design-pro/api';
import { message, Tabs, Alert } from 'antd';
import { history, useModel } from 'umi';
import { useState } from 'react';
type LoginType = 'phone' | 'account';
export default () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const [type, setType] = useState<LoginType>('phone');
  const { status, type: loginType } = userLoginState;

  const LoginMessage: React.FC<{
    content: string;
  }> = ({ content }) => (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values, type });
      if (msg.status === 'ok') {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        let storage = window.localStorage
        storage.setItem("token",(msg as {token: string}).token);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;        
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        history.push(redirect || '/');
        return;
      }

      console.log(msg); // 如果失败去设置用户错误信息

      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: 'calc(100vh)',
        position: 'relative',
      }}
    >
      <div
        className="title"
        style={{
          position: 'absolute',
          fontSize: '50px',
          color: '#fff',
          top: '40vh',
          left: '20vw',
        }}
      >
        彼方尚有荣光在
      </div>
      <LoginFormPage
        backgroundImageUrl="/bgc.jpg"
        logo="/logo.png"
        title="MirokuBlog后台"
        subTitle="基于antdPro搭建的后台管理"
        onFinish={async (values) => {
          await handleSubmit(values as API.LoginParams);
        }}
      >
        <Tabs
          centered
          activeKey={type}
          onChange={(activeKey) => setType(activeKey as LoginType)}
          items={[
            {
              label: '管理员登录',
              key: 'account',
            },
            {
              label: '游客登录',
              key: 'phone',
            },
          ]}
        />
        {status === 'error' && loginType === 'account' && (
          <LoginMessage content={'错误的用户名和密码(admin/ant.design)'} />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'} />,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
        )}
        {type === 'phone' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'} />,
              }}
              name="mobile"
              placeholder={'随便一个名字'}
              rules={[
                {
                  required: true,
                  message: '请输入名字！',
                },
                {
                  max: 10,
                  message: '用户名最大不可超过十位',
                },
              ]}
            />
          </>
        )}
      </LoginFormPage>
    </div>
  );
};
