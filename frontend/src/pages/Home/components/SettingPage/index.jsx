import { Button, message } from "antd";
import { request } from "ice";
import React, { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "../../../../components/QRCode";

const SettingPage = () => {
  const canvasRef = useRef(null);
  const qrContainerRef = useRef(null);
  const [qr, setQr] = useState("");
  const qrcodeRef = useRef(null);

  const handleUploadQR = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;
    input.style.display = "none";
    document.body.appendChild(input);

    input.onchange = (e) => {
      document.body.removeChild(input);
      const files = e.currentTarget.files;
      if (!files || files.length < 1) {
        return;
      }
      const file = files[0];

      const url = URL.createObjectURL(file);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        canvasRef.current.height = img.height;
        canvasRef.current.width = img.width;
        const ctx = canvasRef.current.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);

        URL.revokeObjectURL(url);

        const imgData = ctx.getImageData(0, 0, img.width, img.height);

        const result = jsQR(imgData.data, imgData.width, imgData.height, {
          inversionAttempts: "dontInvert",
        });

        if (result === null) {
          message.error("没有找到二维码");
          return;
        }

        const code = result.data;
        if (code.indexOf("https://qr.alipay.com/") !== 0 && code.indexOf("wxp://") !== 0) {
          message.error("请选择支付宝或微信支付的二维码");
          return;
        }

        message.success("二维码识别成功");
        setQr(code);
      };
    };

    input.click();
  }, []);

  useEffect(async () => {
    const setting = await request("setting/load");
    setQr(setting.data.qrcode);
  }, []);

  const handleSave = useCallback(async () => {
    if (!qr) {
      message.error("二维码为空，无法保存");
      return;
    }
    await request({
      url: "setting/save",
      method: "POST",
      data: {
        qrcode: qr,
      },
    });
    message.success("成功");
  }, [qr]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          left: "-1000px",
          top: "-1000px",
        }}
      />
      <p>付款码设置</p>
      <QRCode text={qr} />
      <p>
        <Button onClick={handleUploadQR}>选择文件</Button>
        &nbsp;
        <Button onClick={handleSave}>保存</Button>
      </p>
    </div>
  );
};

export default SettingPage;
