import { runApp } from "ice";
import qs from "qs";

const appConfig = {
  app: {
    rootId: "app",
  },
  request: {
    baseURL: "/api/",
    transformRequest: [
      (data, headers) => {
        if (typeof data === "object") {
          headers["Content-Type"] = "application/x-www-form-urlencoded";
          return qs.stringify(data);
        }

        return data;
      },
    ],
    interceptors: {
      request: {
        onConfig: (config) => {
          if (!config.headers) {
            config.headers = {};
          }
          if (typeof localStorage !== "undefined") {
            const user = localStorage.getItem("user");
            const password = localStorage.getItem("password");
            if (user && password) {
              config.headers["X-Auth"] = `${user}|${password}`;
            }
          }
          return config;
        },
      },
    },
  },
};
runApp(appConfig);
