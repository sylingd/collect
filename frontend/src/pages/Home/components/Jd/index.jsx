import { platform } from "@/utils";
import { Button, Table, Tag } from "antd";
import { useRequest } from "ice";
import React from "react";
import { request } from "ice";

export const load = async (id) => {
  const result = await request({
    url: "common/jd",
    params: {
      id,
    },
  });
  return result.data;
};

const Jd = () => {
  const { data, loading, request } = useRequest(getList, {
    manual: true
  });

  return (
    <div>
    </div>
  );
};

export default ListPage;
