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
