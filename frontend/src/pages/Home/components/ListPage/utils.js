import { request } from "ice";

export const getList = async (page) => {
  const result = await request({
    url: "order/list",
    params: {
      page,
    },
  });
  return result.data;
};
