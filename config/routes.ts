export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './user/Login' },
      { component: './404' },
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin/sub-page',
        name: '文章管理',
        icon: 'smile',
        hideChildrenInMenu: true,
        routes: [
          { path: '/admin/sub-page', name: '文章', icon: 'smile', component: './Page' },
          {
            path: '/admin/sub-page/change/:id',
            name: '文章编辑',
            icon: 'smile',
            component: './Page/change/index',
          },
        ],
      },
      { path: '/admin/sub-label', name: '标签管理', icon: 'smile', component: './Label' },
      { path: '/admin/sub-classify', name: '分类管理', icon: 'smile', component: './Classify' },
      { path: '/admin/sub-talk', name: '说说管理', icon: 'smile', component: './Talk' },
      { path: '/admin/sub-message', name: '留言管理', icon: 'smile', component: './Message' },

      { component: './404' },
    ],
  },
  {
    path: '/img',
    name: '图库',
    icon: 'picture',
    access: 'canAdmin',
    component: './Img',
  },
  {
    path: '/friend',
    name: '友链',
    icon: 'user',
    access: 'canAdmin',
    component: './Friend',
  },
  {
    path: '/build',
    name: '建站',
    icon: 'build',
    access: 'canAdmin',
    component: './Build',
  },
  {
    path: '/about',
    name: '关于',
    icon: 'android',
    access: 'canAdmin',
    // component: './About',
    hideChildrenInMenu: true,
    routes: [
      { path: '/about', name: '关于', icon: 'smile', component: './About' },
      {
        path: '/about/change/:id',
        name: '修改',
        icon: 'smile',
        component: './About/component/index',
      },
    ],
  },
  {
    path: '/show',
    name: '作品',
    icon: 'trophy',
    access: 'canAdmin',
    component: './Show',
  },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
