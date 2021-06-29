import { request as iceRequest } from "ice";
import qs from "qs";
import * as md5 from "blueimp-md5";

export const setLogin = (user, password) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("user", user);
    localStorage.setItem("password", password);
  }
};

export const platform = {
  1: '淘宝',
  2: '京东',
  3: '饿了么',
  4: '拼多多',
  20: '其他',
}

export const statusMap = {
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
