import { platformMap } from "@/utils";
import { Form, Input, message, Modal, Select, Spin, Tag } from "antd";
import { useRequest } from "ice";
import React, { useCallback, useEffect, useRef } from "react";
import CopyInput from "../../../../components/CopyInput";
import QRCode from "../../../../components/QRCode";
import { getPlatform, load } from "./utils";

const { Search } = Input;

const Rebate = () => {
  const {
    data,
    loading,
    request: doSearch,
  } = useRequest(load, {
    manual: true,
  });

  const handleSearch = useCallback((value) => {
    // 尝试获取商品ID
    let id = null;
    let platform = -1;

    const ok = () => doSearch(platform, id);

    // 京东
    if (/item\.jd\.com\/(\d+)\.html/.test(value)) {
      platform = 2;
      const res = /item\.jd\.com\/(\d+)\.html/.exec(value);
      id = res[1];
    } else if (/item\.m\.jd\.com\/product\/(\d+)\.html/.test(value)) {
      platform = 2;
      const res = /item\.m\.jd\.com\/product\/(\d+)\.html/.exec(value);
      id = res[1];
    } else if (/https?:\/\/u\.jd\.com\/(\w+)/.test(value)) {
      platform = 2;
      const res = /https?:\/\/u\.jd\.com\/(\w+)/.exec(value);
      id = res[0];
    } else if (value.indexOf("https://item.taobao.com/item.htm?") === 0) {
      platform = 1;
      id = value;
    } else if (value.indexOf("m.tb.cn") > 0) {
      platform = 1;
      const res = /m\.tb\.cn\/([a-zA-Z0-9\.]+)/.exec(value);
      id = `https://${res[0]}`;
    } else if (/^(\d+)$/.test(value)) {
      id = value;
      Modal.confirm({
        title: "请选择平台",
        okText: "淘宝",
        cancelText: "京东",
        onOk: () => {
          platform = 1;
          ok();
        },
        onCancel: () => {
          platform = 2;
          ok();
        }
      });
    } else {
      message.error("无法识别");
      return;
    }
    if (platform !== -1) {
      ok();
    }
  }, []);

  return (
    <div className="page-rebate">
      <Search
        enterButton="获取"
        placeholder="输入商品ID或商品链接，支持PC链接、移动链接和短链接"
        loading={loading}
        onSearch={handleSearch}
      />
      <Spin spinning={loading}>
        <div
          style={{
            paddingTop: "24px",
          }}
        >
          {data && (
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} layout="horizontal" initialValues={data}>
              <Form.Item label="商品">
                <span className="ant-form-text">
                  {data.name}
                  <span className="tags">
                    {data.tag && data.tag.length > 0
                      ? data.tag.map((x, index) => (
                          <Tag key={index} color={x.color}>
                            {x.text}
                          </Tag>
                        ))
                      : null}
                    {data.coupon && (
                      <Tag color="warning">
                        满 {data.coupon.total} 减 {data.coupon.discount}
                      </Tag>
                    )}
                  </span>
                </span>
              </Form.Item>
              <Form.Item label="价格">
                <span className="ant-form-text">{data.price}</span>
              </Form.Item>
              <Form.Item label="预计返利">
                {data.commission.map((x, index) => (
                  <span key={index} className="ant-form-text">
                    {x.type} ￥{x.amount}({x.rate}%)
                  </span>
                ))}
              </Form.Item>
              {data.token && (
                <Form.Item label="口令">
                  <CopyInput value={data.token} />
                </Form.Item>
              )}
              <Form.Item label="下单链接">
                <CopyInput value={data.qrcode} />
              </Form.Item>
              <Form.Item label="扫码下单">
                <QRCode size={120} text={data.qrcode} />
              </Form.Item>
            </Form>
          )}
        </div>
      </Spin>
    </div>
  );
};

export default Rebate;
