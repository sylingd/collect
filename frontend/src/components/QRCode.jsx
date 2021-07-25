import React, { useEffect, useMemo, useRef } from "react";

const QRCode = (props) => {
  const { text, size = 180 } = props;
  const instance = useRef(null);
  const qrContainerRef = useRef("null");

  useEffect(() => {
    if (!text || !qrContainerRef.current) {
      return;
    }
    if (instance.current === null) {
      instance.current = new window.QRCode(qrContainerRef.current, {
        text,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H,
      });
    } else {
      instance.current.makeCode(text);
    }
  }, [text, size]);

  const logo = useMemo(() => {
    if (text.indexOf("wxp://") === 0) {
      return "https://img.alicdn.com/tfs/TB1Y2BXoz39YK4jSZPcXXXrUFXa-657-578.png";
    }
    if (text.indexOf("https://qr.alipay.com/") === 0) {
      return "https://img.alicdn.com/tfs/TB1ID6DkZVl614jSZKPXXaGjpXa-488-492.png";
    }
    if (text.indexOf(".jd.com/") >= 0) {
      return "https://ae01.alicdn.com/kf/H3e7b0fdc21f74c5d9c73bbb19ea28f0dj.png";
    }
    if (text.indexOf(".taobao.com/") >= 0 || text.indexOf(".tb.cn/") >= 0) {
      return "https://img.alicdn.com/tps/i3/T1OjaVFl4dXXa.JOZB-114-114.png";
    }
    return null;
  }, [text]);

  const logoSize = Math.round(size / 4);

  return (
    <div
      className="qrcode"
      style={{
        height: `${size}px`,
        width: `${size}px`,
      }}
    >
      <div
        className="code"
        ref={qrContainerRef}
        style={{
          height: `${size}px`,
          width: `${size}px`,
        }}
      ></div>
      {logo && (
        <div
          className="logo"
          style={{
            height: `${logoSize}px`,
            width: `${logoSize}px`,
          }}
        >
          <img src={logo} />
        </div>
      )}
    </div>
  );
};

export default QRCode;
