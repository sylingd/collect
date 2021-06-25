import { Modal, Tabs } from "antd";
import React, { useCallback, useState } from "react";
import Jd from "./components/Jd";
import ListPage from "./components/ListPage";
import LoginForm from "./components/LoginForm";
import SettingPage from "./components/SettingPage";
import SubmitPage from "./components/SubmitPage";

const { TabPane } = Tabs;

const Home = () => {
  const [showLogin, setShowLogin] = useState(true);

  const handleLoginSuccess = useCallback(() => {
    setShowLogin(false);
  }, []);

  return (
    <div className="card-container">
      {showLogin ? (
        <Modal title="登录" visible={showLogin} closable={false} maskClosable={false} footer={null}>
          <LoginForm onSuccess={handleLoginSuccess} />
        </Modal>
      ) : (
        <Tabs type="card">
          <TabPane tab="提交订单" key="submit">
            <SubmitPage />
          </TabPane>
          <TabPane tab="京东返利" key="jd">
            <Jd />
          </TabPane>
          <TabPane tab="查询" key="order">
            <ListPage />
          </TabPane>
          <TabPane tab="设置" key="setting">
            <SettingPage />
          </TabPane>
        </Tabs>
      )}
    </div>
  );
};

export default Home;
