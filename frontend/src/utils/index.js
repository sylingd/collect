import { request as iceRequest } from "ice";
import qs from "qs";
import * as md5 from "blueimp-md5";

export const setLogin = (user, password) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("user", user);
    localStorage.setItem("password", password);
  }
};

export const platformMap = {
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
    text: "待结算",
  },
  3: {
    type: "processing",
    text: "待返款",
  },
  4: {
    type: "success",
    text: "已完成",
  },
  9: {
    type: "error",
    text: "错误",
  },
};
