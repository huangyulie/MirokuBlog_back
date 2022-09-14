import { GithubOutlined,VerticalAlignTopOutlined } from '@ant-design/icons';
import { BackTop } from 'antd';
import { DefaultFooter } from '@ant-design/pro-components';

const Footer: React.FC = () => {
  const defaultMessage = 'Miroku后台管理系统';
  const currentYear = new Date().getFullYear();
  const style: React.CSSProperties = {
    height: 40,
    width: 40,
    lineHeight: '40px',
    borderRadius: 4,
    backgroundColor: '#1088e9',
    color: '#fff',
    textAlign: 'center',
    fontSize: 25,
  };
  return (
    <>
      <DefaultFooter
        copyright={`${currentYear} ${defaultMessage}`}
        links={[
          {
            key: 'MirokuBlog',
            title: 'MirokuBlog',
            href: 'https://pro.ant.design',
            blankTarget: true,
          },
          {
            key: 'github',
            title: <GithubOutlined />,
            href: 'https://github.com/huangyulie',
            blankTarget: true,
          },
          {
            key: 'MirokuSystem',
            title: 'MirokuSystem',
            href: 'https://ant.design',
            blankTarget: true,
          },
        ]}
      />
     <BackTop>
      <div style={style}><VerticalAlignTopOutlined /></div>
    </BackTop>
    </>
  );
};

export default Footer;
