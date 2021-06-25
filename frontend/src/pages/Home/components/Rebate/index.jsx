import { Form, Spin, Button, Input, message, Select, Tag } from "antd";
import { request, useRequest } from "ice";
import React, { useCallback, useRef } from "react";
import QRCode from "../QRCode";

const { Search } = Input;

const load = async (platform, id) => {
  const result = await request({
    url: `rebate/${platform}`,
    params: {
      id,
    },
  });

  if (!result.success) {
    message.error(result.error);
    return null;
  }

  return result.data;
};

const Rebate = () => {
  const {
    data,
    loading,
    request: doSearch,
  } = useRequest(load, {
    manual: true,
  });

  const platform = useRef("jd");
  const handleSearch = useCallback((value) => {
    // 尝试获取商品ID
    let id = null;
    if (/item\.jd\.com\/(\d+)\.html/.test(value)) {
      const res = /item\.jd\.com\/(\d+)\.html/.exec(value);
      id = res[1];
    } else if (/item\.m\.jd\.com\/product\/(\d+)\.html/.test(value)) {
      const res = /item\.m\.jd\.com\/product\/(\d+)\.html/.exec(value);
      id = res[1];
    } else if (/https?:\/\/u\.jd\.com\/(\w+)/.test(value)) {
      const res = /https?:\/\/u\.jd\.com\/(\w+)/.exec(value);
      id = res[0];
    } else {
      message.error("无法识别链接");
      return;
    }
    doSearch(platform.current, id);
  }, []);

  const handleSelect = useCallback((value) => {
    platform.current = value;
  }, []);

  console.log(data);

  return (
    <div className="page-rebate">
      <Search
        addonBefore={
          <Select defaultValue="jd" onChange={handleSelect}>
            <Option value="jd">京东</Option>
          </Select>
        }
        enterButton="获取"
        placeholder="粘贴商品链接，同时支持PC链接、移动链接和短链接"
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
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} layout="horizontal">
              <Form.Item label="商品">
                <span className="ant-form-text">
                  {data.skuName}
                  {data.isZY ? <Tag color="success">自营</Tag> : <Tag color="processing">非自营</Tag>}
                </span>
              </Form.Item>
              {data.couponLink && (
                <Form.Item label="优惠券">
                  <span className="ant-form-text">
                    满 {data.couponQuota} 减 {data.couponDiscount}
                  </span>
                </Form.Item>
              )}
              <Form.Item label="价格">
                <span className="ant-form-text">{data.finalPrice}</span>
              </Form.Item>
              <Form.Item label="预计返利">
                <span className="ant-form-text">
                  普通会员 ￥{data.wlCommission}({data.wlCommissionRatio}%)
                </span>
                {typeof data.plusCommissionShare !== "undefined" && (
                  <span className="ant-form-text">
                    PLUS会员 ￥{Math.round(data.finalPrice * data.plusCommissionShare) / 100}({data.plusCommissionShare}
                    %)
                  </span>
                )}
              </Form.Item>
              {data.union.coupon && (
                <Form.Item label="扫码领券">
                  <QRCode size={100} text={data.union.coupon} />
                </Form.Item>
              )}
              <Form.Item label="扫码下单">
                <QRCode size={100} text={data.union.url} />
              </Form.Item>
            </Form>
          )}
        </div>
      </Spin>
    </div>
  );
};

export default Rebate;
