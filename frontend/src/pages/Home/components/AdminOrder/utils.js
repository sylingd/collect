import { request } from "ice";

export const getList = async (page) => {
  const result = await request({
    url: "admin/orderList",
    params: {
      page,
    },
  });
  return result.data;
};
