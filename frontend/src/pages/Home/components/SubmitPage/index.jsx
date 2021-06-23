import { Button, Form, Radio, Input, DatePicker } from 'antd';
import moment from "moment";
import React from 'react';

const SubmitPage = () => {
  return (
    <div>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        initialValues={{
          platform: 'taobao',
          time: new moment(),
          order: ''
        }}
      >
        <Form.Item label="平台" name="platform" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio value="taobao">淘宝</Radio>
            <Radio value="jd">京东</Radio>
            <Radio value="eleme">饿了么</Radio>
            <Radio value="pdd">拼多多</Radio>
            <Radio value="other">其他</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="下单时间" name="time" rules={[{ required: true }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>
        <Form.Item label="订单号" name="order" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button type="primary" htmlType="submit">提交</Button>
        </Form.Item>
      </Form>
    </div>
  )
};

export default SubmitPage;
