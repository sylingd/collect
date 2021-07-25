import { platformMap, statusMap } from "@/utils";
import { Button, Table, Tag } from "antd";
import { useRequest } from "ice";
import React from "react";
import { getList } from "./utils";

const columns = [
  {
    title: "平台",
    dataIndex: "platform",
    key: "platform",
    render: (k) => platformMap[k],
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
  const { data, loading, refresh, request } = useRequest(getList, {
    manual: false,
    initialData: {
      total: 0,
      page: 1,
      pageSize: 10,
      list: [],
    },
  });

  return (
    <div>
      <div className="action">
        <Button onClick={refresh}>刷新</Button>
        &nbsp;
        <Button href="https://www.yuque.com/docs/share/2e48623f-f3bd-4a17-af79-94b8daa685b4" target="_blank">状态说明</Button>
      </div>
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
    </div>
  );
};

export default ListPage;
