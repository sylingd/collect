import { platform, statusMap } from "@/utils";
import { Button, Dropdown, Menu, message, Space, Table, Tag } from "antd";
import { useRequest } from "ice";
import React, { useCallback, useMemo } from "react";
import { getList } from "./utils";

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

  const handleStatusUpdate = useCallback(async (id, newStatus) => {
    const hide = message.loading("正在更新");
    const res = await request({
      url: "admin/updateOrder",
      params: {
        status: newStatus,
        id,
      },
    });
    hide();
    if (res.success) {
      message.success("更新状态成功");
      refresh();
    } else {
      message.error("更新失败，" + res.error);
    }
  }, []);

  const handleRemarkUpdate = useCallback((id) => {
    const newRemark = window.prompt("请输入备注");
    if (newRemark) {
      const hide = message.loading("正在更新");
      const res = await request({
        url: "admin/updateOrder",
        method: "POST",
        data: {
          remark: newRemark,
          id,
        },
      });
      hide();
      if (res.success) {
        message.success("更新状态成功");
        refresh();
      } else {
        message.error("更新失败，" + res.error);
      }
    }
  }, []);

  const columns = useMemo(() => {
    const getMenu = (id) => {
      <Menu onClick={({ key }) => handleStatusUpdate(id, key)}>
        {Object.keys(statusMap).forEach((k) => {
          return <Menu.Item key={k}>{statusMap[k].text}</Menu.Item>;
        })}
      </Menu>;
    };

    return [
      {
        title: "平台",
        dataIndex: "platform",
        key: "platform",
        render: (k) => platform[k],
      },
      {
        title: "用户ID",
        dataIndex: "user",
        key: "user",
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
      {
        title: "操作",
        key: "action",
        render: (text, record) => (
          <Space size="middle">
            <Dropdown overlay={getMenu(record.id)}>
              <Button>状态</Button>
            </Dropdown>
            <Button onClick={() => handleRemarkUpdate(record.id)}>备注</Button>
          </Space>
        ),
      },
    ];
  }, []);

  return (
    <div>
      <Button onClick={refresh}>刷新</Button>
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
