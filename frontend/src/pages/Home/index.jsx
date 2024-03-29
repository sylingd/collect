import { Modal, Tabs } from "antd";
import React, { useCallback, useState } from "react";
import Rebate from "./components/Rebate";
import ListPage from "./components/ListPage";
import LoginForm from "./components/LoginForm";
import SettingPage from "./components/SettingPage";
import SubmitPage from "./components/SubmitPage";
import AdminOrder from "./components/AdminOrder";
import AdminOther from "./components/AdminOther";

const { TabPane } = Tabs;

const Home = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLoginSuccess = useCallback((newIsAdmin) => {
    setShowLogin(false);
    setIsAdmin(newIsAdmin);
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
          <TabPane tab="自助返利" key="rebate">
            <Rebate />
          </TabPane>
          <TabPane tab="查询" key="order">
            <ListPage />
          </TabPane>
          <TabPane tab="设置" key="setting">
            <SettingPage />
          </TabPane>
          {isAdmin && (
            <TabPane tab="管理 - 订单" key="admin-order">
              <AdminOrder />
            </TabPane>
          )}
          {isAdmin && (
            <TabPane tab="管理 - 其他" key="admin-other">
              <AdminOther />
            </TabPane>
          )}
        </Tabs>
      )}
    </div>
  );
};

export default Home;
