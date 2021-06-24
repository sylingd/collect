export default {
  "/api/info": {
    success: true,
  },
  "/api/login": {
    success: true,
  },
  "/api/register": {
    success: false,
    error: "用户名已存在",
  },
  "GET /api/setting": {
    success: true,
    data: {
      qr: "https://qr.alipay.com/fkx18753rv5jz8ubl3itt7f",
    },
  },
  "POST /api/setting": {
    success: true,
  },
  "POST /api/submit": {
    success: true,
  },
  "/api/list": {
    success: true,
    data: {
      total: 100,
      page: 1,
      pageSize: 5,
      list: [
        {
          id: 1,
          platform: "taobao",
          time: "2021-10-10 00:00",
          order: "1231231231231",
          status: "WAIT",
          remark: "",
        },
        {
          id: 2,
          platform: "taobao",
          time: "2021-10-10 00:00",
          order: "1231231231231",
          status: "CONFIRMED",
          remark: "",
        },
        {
          id: 3,
          platform: "taobao",
          time: "2021-10-10 00:00",
          order: "1231231231231",
          status: "CLOSED",
          remark: "",
        },
        {
          id: 4,
          platform: "taobao",
          time: "2021-10-10 00:00",
          order: "1231231231231",
          status: "ERROR",
          remark: "",
        },
      ],
    },
  },
};
