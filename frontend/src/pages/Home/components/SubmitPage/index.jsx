import { platformMap } from "@/utils";
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
      if (result.order) {
        const { order } = result;
        Modal.success({
          title: "提交成功",
          content: (
            <p>
              预计返利：￥{order.expect_rebate}，手续费：￥{order.charge}。<br />
              以上数据不含税。仅供参考，以实际返利为准。
            </p>
          ),
        });
      } else {
        message.success("提交成功");
      }
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
          platform: "1",
          time: new moment(),
          orderId: "",
        }}
      >
        <Form.Item label="平台" name="platform" rules={[{ required: true, message: "请选择平台" }]}>
          <Radio.Group>
            {Object.keys(platformMap).map((x) => (
              <Radio value={x} key={x}>
                {platformMap[x]}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="下单时间"
          name="time"
          rules={[{ required: true, message: "请选择下单时间" }]}
          tooltip="请注意：请填写订单创建时间，而非支付/收货时间。与平台相差不要大于10分钟。"
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm" />
        </Form.Item>
        <Form.Item
          label="订单号"
          name="orderId"
          rules={[{ required: true, message: "请填写订单号" }]}
          tooltip={
            <Button href="https://www.yuque.com/docs/share/a92ddc63-6208-44fd-a70e-2c0802dc2c1f" target="_blank" ghost>
              查看订单号获取方式
            </Button>
          }
        >
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
