import { request as iceRequest } from "ice";
import qs from "qs";
import * as md5 from "blueimp-md5";

export const setLogin = (user, password) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("user", user);
    localStorage.setItem("password", md5(password));
  }
};
