import { Button, Input, message, Select } from "antd";
import { request, useRequest } from "ice";
import React, { useCallback, useRef } from "react";

const { Search } = Input;

const load = async (platform, id) => {
  const result = await request({
    url: `rebate/${platform}`,
    params: {
      id,
    },
  });
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
      message.error('无法识别链接');
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
    </div>
  );
};

export default Rebate;
