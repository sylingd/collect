import { platformMap } from "@/utils";
import { Form, Input, message, Select, Spin, Tag } from "antd";
import { useRequest } from "ice";
import React, { useCallback, useEffect, useRef } from "react";
import QRCode from "../QRCode";
import { getPlatform, load } from "./utils";

const { Search } = Input;

const Rebate = () => {
  const { data: platforms } = useRequest(getPlatform, {
    manual: false,
    initialData: [],
  });
  const {
    data,
    loading,
    request: doSearch,
  } = useRequest(load, {
    manual: true,
  });

  const tokenRef = useRef(null);
  const platform = useRef(null);
  const handleSearch = useCallback((value) => {
    // 尝试获取商品ID
    let id = null;
    if (platform.current === 2) {
      if (/^(\d+)$/.test(value)) {
        id = value;
      } else if (/item\.jd\.com\/(\d+)\.html/.test(value)) {
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
    } else if (platform.current === 1) {
      if (/^(\d+)$/.test(value)) {
        id = `https://item.taobao.com/item.htm?id=${value}`;
      } else if (value.indexOf('m.tb.cn') > 0) {
        const res = /m\.tb\.cn\/([a-zA-Z0-9\.]+)/.exec(value);
        id = `https://${res[0]}`;
      } else {
        id = value;
      }
    }
    doSearch(platform.current, id);
  }, []);

  const handleSelect = useCallback((value) => {
    platform.current = typeof value === "string" ? parseInt(value) : value;
  }, []);
  useEffect(() => {
    platform.current = platforms[0];
  }, [platforms]);

  const handleTokenFocus = useCallback(() => {
    if (tokenRef.current) {
      const input = tokenRef.current.input;
      input.setSelectionRange(0, input.value.length);
    }
  }, []);

  const handleCopyToken = useCallback(() => {
    if (tokenRef.current) {
      const input = tokenRef.current.input;
      try {
        navigator.clipboard.writeText(input.value);
        message.success("已复制");
        return;
      } catch (e) {
        // ignore
      }
      tokenRef.current.focus();
      input.setSelectionRange(0, input.value.length);
      document.execCommand("copy");
      message.success("已复制");
    }
  }, []);

  if (platforms.length === 0) {
    return <Spin spinning={true} />;
  }

  return (
    <div className="page-rebate">
      <Search
        addonBefore={
          <Select defaultValue={platforms[0]} onChange={handleSelect}>
            {platforms.map((x) => (
              <Option value={x}>{platformMap[x]}</Option>
            ))}
          </Select>
        }
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
                <Form.Item label="口令" name="token">
                  <Input.Search
                    ref={tokenRef}
                    onFocus={handleTokenFocus}
                    readOnly
                    onSearch={handleCopyToken}
                    enterButton="复制"
                  />
                </Form.Item>
              )}
              {data.coupon && data.coupon.qrcode && (
                <Form.Item label="扫码领券">
                  <QRCode size={120} text={data.coupon.qrcode} />
                </Form.Item>
              )}
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
