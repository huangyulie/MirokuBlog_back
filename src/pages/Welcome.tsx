import { PageContainer } from '@ant-design/pro-components';
import { Col, Row, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import './Welcome.less';
import moment from 'moment';
import request from 'umi-request';
import { Pie } from '@ant-design/plots';
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

interface pieIprops{
  type: string;
  value: number;
}

const Welcome: React.FC = () => {
  const [label, setLabel] = useState<LabelIprops[]>();
  const [classify, setClassify] = useState<ClassifyIprops[]>();
  const [pie,setPie] = useState<pieIprops[]>();

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
  const data3 = async()=>{
    let {data} = await request('/api/acticle/findP',{
      method:'GET',
    })
    setPie(data)
    console.log(data);
    
  }

  const data: pieIprops[] = pie||[];
  const config: any = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };
  const classFile = ['文章数', '分类数', '标签数', '友链数', '留言数', '说说数'];

  return (
    <PageContainer>
      <Row>
        {/* xs,md,lg */}
        <Col xs={24} md={12} lg={8}>
          <div className="Col">
            <div className="Col-top">
              <div className="img">
                <img src="/logo.png" alt="logo" />
              </div>
              <div className="Col-item">
                <div className="Col-item-1">🔥 黄欲烈 你好!</div>
                <div className="Col-item-1">🎉 欢迎来到MirokuBlog后台管理系统</div>
                <div className="Col-item-1">📆 现在是{moment().format('MM-DD HH:mm')}</div>

                <div className="Col-item-1">🌍 ip:</div>
                <div className="Col-item-1">💒 来自</div>
                <div className="Col-item-1 Col-item-move">🌜 夜深了要早点睡哦</div>
              </div>
            </div>
            <div className="Col-bottom">
              <div className="top">分类概括</div>
              <div className="bottom">
                {classify?.map((item) => {
                  return <Tag className="Tag">{item.name}</Tag>;
                })}
              </div>
            </div>
            <div className="Col-bottom">
              <div className="top">标签概括</div>
              <div className="bottom">
                {label?.map((item) => {
                  return (
                    <Tag color={item.color} className="Tag">
                      {item.name}
                    </Tag>
                  );
                })}
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={12} lg={16}>
          <div className="Col-right">
            <div className="Col-top">
              {classFile.map((item, index) => {
                return (
                  <div className="Col-top-item" key={index}>
                    <div className="Col-top-1">
                      <div className="top-1"></div>
                      <div className="top-2">155</div>
                      <div className="top-3">{item}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="Col-bottom">
              <div className="Col-top-item">文章概括</div>
              <div className="Col-top-i">
                <Pie {...config} />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Welcome;
