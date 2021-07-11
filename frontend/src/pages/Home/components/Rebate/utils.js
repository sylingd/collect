import { message } from "antd";
import { request } from "ice";

export const getPlatform = async () => {
  const result = await request("rebate/platform");

  return result.data;
};

export const load = async (platform, id) => {
  const result = await request({
    url: "rebate/convert",
    params: {
      platform,
      id,
    },
  });

  if (!result.success) {
    message.error(result.error);
    return null;
  }

  return result.data;
};
