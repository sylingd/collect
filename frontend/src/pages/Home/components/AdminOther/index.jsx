import { Button, message, Card } from "antd";
import { request } from "ice";
import React, { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "../../../../components/QRCode";

const AdminOther = () => {
  const [taoLogin, setTaoLogin] = useState("");

  const handleLoadCode = useCallback(async () => {
    const res = await request("admin/loginTaobao");
    if (res.success) {
      message.success("刷新成功");
      setTaoLogin(res.data.url);
    } else {
      message.error("刷新失败");
    }
  }, []);

  return (
    <div>
      <Card
        title="淘宝登录"
        extra={
          <Button type="link" onClick={handleLoadCode}>
            刷新二维码
          </Button>
        }
      >
        <QRCode text={taoLogin} size={300} />
      </Card>
    </div>
  );
};

export default AdminOther;
