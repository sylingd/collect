import { Button, Form } from 'antd';
import React, { useRef } from 'react';

const LoginForm = () => {
  const formRef = useRef(null);

  const handleLogin = (type) => {
    formRef.current.validateFields()
      .then(value => {
        console.log(value)
      })
  };

  return (
    <Form
      ref={formRef}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      layout="horizontal"
    >
      <Form.Item label="用户名" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="密码" name="password" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Button type="primary" style={{ marginRight: "8px" }} onClick={() => handleLogin('login')}>
          登录
        </Button>
        <Button onClick={() => handleLogin('register')}>
          注册
        </Button>
      </Form.Item>
    </Form>
  )
};

export default LoginForm;
