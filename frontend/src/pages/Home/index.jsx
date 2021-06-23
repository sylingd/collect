import { Modal, Tabs } from 'antd';
import React, { useState } from 'react';
import ListPage from './components/ListPage';
import LoginForm from './components/LoginForm';
import SettingPage from './components/SettingPage';
import SubmitPage from './components/SubmitPage';

const { TabPane } = Tabs;

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="card-container">
      <Modal title="登录" visible={showLogin} closable={false} maskClosable={false} footer={null}>
        <LoginForm />
      </Modal>
      <Tabs type="card">
        <TabPane tab="提交订单" key="1">
          <SubmitPage />
        </TabPane>
        <TabPane tab="查询" key="2">
          <ListPage />
        </TabPane>
        <TabPane tab="设置" key="3">
          <SettingPage />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Home;
