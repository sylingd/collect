import { setLogin } from "@/utils";
import { Button, Form, Input, message, Spin } from "antd";
import { request } from "ice";
import React, { useEffect, useRef, useState } from "react";

import * as md5 from "blueimp-md5";

const LoginForm = (props) => {
  const [loading, setLoading] = useState(true);
  const formRef = useRef(null);

  const handleLogin = async (type) => {
    const value = await formRef.current.validateFields();
    value.password = md5(value.password);
    setLoading(true);
    const result = await request({
      url: `user/${type}`,
      method: "POST",
      data: value,
    });
    if (result.success) {
      // 成功
      setLogin(result.data.id, value.password);
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
    const result = await request("setting/info");
    if (result.success && props.onSuccess) {
      props.onSuccess();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Spin spinning={loading}>
      <Form ref={formRef} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} layout="horizontal">
        <Form.Item
          label="用户名"
          name="user"
          rules={[
            {
              required: true,
              message: "请输入用户名",
            },
            {
              pattern: /^([a-zA-Z0-9_]+)$/,
              message: "用户名只能是字母、数字、下划线组成",
            },
            {
              type: "string",
              min: 4,
              max: 16,
              message: "仅允许4-16位用户名",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: "请输入密码",
            },
            {
              type: "string",
              min: 6,
              max: 18,
              message: "仅允许6-18位密码",
            },
          ]}
        >
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
