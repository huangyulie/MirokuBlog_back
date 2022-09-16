import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import { message } from 'antd';
import { RequestConfig, RunTimeLayoutConfig, useModel } from 'umi';
import { history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';

const loginPath = '/user/login';
let huangyulie: any = 'huangyulie';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// src/app.tsx
const authHeaderInterceptor = (url: string, options: RequestConfig): any => {
  // const { initialState, setInitialState } = useModel('@@initialState');
  // const { location } = history;
  // if (location.pathname !== loginPath) {
  //   // history.push(loginPath);
  //   message.warning('游客没有权限哦！！');
  //   return null;
  // }
  // let urlAcees = url.split('/');
  // if (urlAcees[urlAcees.length - 1] !== 'index') {
  //   if (location.pathname !== loginPath) {
  //     // history.push(loginPath);
  //     message.warning('游客没有权限哦！！');
  //     return null;
  //   }
  // }
  let storage = window.localStorage;
  let data = storage.getItem('token');
  const token = data ? data : '';
  const authHeader = { Authorization: `Bearer ${token}` };
  // console.log(initialState);
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

const demoResponseInterceptors = (response: Response) => {
  if (response.status === 401) {
    message.error('token过期');
    history.push(loginPath);
  }
  if (response.status === 404) {
    message.error('网络错误');
  }
  return response;
};

export const request: RequestConfig = {
  // 新增自动添加AccessToken的请求前拦截器
  requestInterceptors: [authHeaderInterceptor],
  responseInterceptors: [demoResponseInterceptors],
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  // console.log(initialState?.currentUser?.name);
  // huangyulie = initialState?.currentUser;
  // if(huangyulie.name !== undefined)
  // console.log(huangyulie.name);

  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: any, props: any) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
