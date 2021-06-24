import { setLogin } from "@/utils";
import { Button, Form, Input, message, Spin } from "antd";
import { request } from "ice";
import React, { useEffect, useRef, useState } from "react";

const LoginForm = (props) => {
  const [loading, setLoading] = useState(true);
  const formRef = useRef(null);

  const handleLogin = async (type) => {
    const value = await formRef.current.validateFields();
    setLoading(true);
    const result = await request({
      url: type,
      method: "POST",
      data: value,
    });
    if (result.success) {
      // 成功
      setLogin(value.user, value.password);
      message.success("成功");
      if (props.onSuccess) {
        props.onSuccess();
      }
    } else {
      message.error(result.error);
    }
    setLoading(false);
  };

  useEffect(async () => {
    const result = await request("info");
    if (result.success && props.onSuccess) {
      props.onSuccess();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Spin spinning={loading}>
      <Form ref={formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} layout="horizontal">
        <Form.Item label="用户名" name="user" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button type="primary" style={{ marginRight: "8px" }} onClick={() => handleLogin("login")}>
            登录
          </Button>
          <Button onClick={() => handleLogin("register")}>注册</Button>
        </Form.Item>
      </Form>
    </Spin>
  );
};

export default LoginForm;
