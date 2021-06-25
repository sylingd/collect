import { platform } from "@/utils";
import { Table, Tag } from "antd";
import { useRequest } from "ice";
import React from "react";
import { getList } from "./utils";

const statusMap = {
  1: {
    type: "default",
    text: "已提交",
  },
  2: {
    type: "processing",
    text: "已确认",
  },
  3: {
    type: "success",
    text: "已结算",
  },
  4: {
    type: "error",
    text: "错误",
  },
};

const columns = [
  {
    title: "平台",
    dataIndex: "platform",
    key: "platform",
    render: (k) => platform[k],
  },
  {
    title: "下单时间",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "订单号",
    dataIndex: "orderId",
    key: "orderId",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (status) => <Tag color={statusMap[status].type}>{statusMap[status].text}</Tag>,
  },
  {
    title: "备注",
    dataIndex: "remark",
    key: "remark",
  },
];

const ListPage = () => {
  const { data, loading, request } = useRequest(getList, {
    manual: false,
    initialData: {
      total: 0,
      page: 1,
      pageSize: 10,
      list: [],
    },
  });

  return (
    <Table
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={data.list}
      pagination={{
        total: data.total,
        current: data.page,
        pageSize: data.pageSize,
        showSizeChanger: false,
        onChange: (page) => request(page),
      }}
    />
  );
};

export default ListPage;
