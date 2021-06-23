import { Table, Tag } from 'antd';
import React, { useMemo, useState } from 'react';

const statusMap = {
  WAIT: {
    type: 'default',
    text: '已提交',
  },
  CONFIRMED: {
    type: 'processing',
    text: '已确认',
  },
  CLOSED: {
    type: 'success',
    text: '已结算',
  },
  ERROR: {
    type: 'error',
    text: '错误',
  },
};

const ListPage = () => {
  const columns = useMemo(() => {
    return [
      {
        title: '平台',
        dataIndex: 'platform',
        key: 'platform',
      },
      {
        title: '下单时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '订单号',
        dataIndex: 'order',
        key: 'order',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          console.log(status);
          return <Tag color={statusMap[status].type}>{statusMap[status].text}</Tag>;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
    ];
  }, []);

  const [data, setData] = useState([
    {
      id: 1,
      platform: 'taobao',
      time: '2021-10-10 00:00',
      order: '1231231231231',
      status: 'WAIT',
      remark: '',
    },
    {
      id: 2,
      platform: 'taobao',
      time: '2021-10-10 00:00',
      order: '1231231231231',
      status: 'CONFIRMED',
      remark: '',
    },
    {
      id: 3,
      platform: 'taobao',
      time: '2021-10-10 00:00',
      order: '1231231231231',
      status: 'CLOSED',
      remark: '',
    },
    {
      id: 4,
      platform: 'taobao',
      time: '2021-10-10 00:00',
      order: '1231231231231',
      status: 'ERROR',
      remark: '',
    },
  ]);

  return <Table rowKey="id" columns={columns} dataSource={data} />;
};

export default ListPage;
