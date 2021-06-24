import { request } from "ice";

export const getList = async (page) => {
  const result = await request({
    url: "list",
    params: {
      page,
    },
  });
  return result.data;
};
