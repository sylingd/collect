import { platform } from "@/utils";
import { Button, DatePicker, Form, Input, message, Radio } from "antd";
import { request } from "ice";
import moment from "moment";
import React, { useCallback, useRef } from "react";

const SubmitPage = () => {
  const formRef = useRef(null);

  const handleSubmit = useCallback(async (values) => {
    const hide = message.loading("提交中", 0);
    const result = await request({
      url: "order/submit",
      method: "POST",
      data: {
        ...values,
        time: Math.floor(values.time.toDate().getTime() / 1000),
      },
    });
    hide();
    if (result.success) {
      message.success("提交成功");
      formRef.current.resetFields();
    } else {
      message.error(result.error);
    }
  }, []);

  return (
    <div>
      <Form
        ref={formRef}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        onFinish={handleSubmit}
        initialValues={{
          platform: 1,
          time: new moment(),
          orderId: "",
        }}
      >
        <Form.Item label="平台" name="platform" rules={[{ required: true, message: "请选择平台" }]}>
          <Radio.Group>
            {Object.keys(platform).map((x) => (
              <Radio value={x} key={x}>
                {platform[x]}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item label="下单时间" name="time" rules={[{ required: true, message: "请选择下单时间" }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>
        <Form.Item label="订单号" name="orderId" rules={[{ required: true, message: "请填写订单号" }]}>
          <Input />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SubmitPage;
