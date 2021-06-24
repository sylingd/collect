import React, { useEffect, useMemo, useRef } from 'react';

const QRCode = (props) => {
  const { text } = props;
  const qrcodeRef = useRef(null);
  const qrContainerRef = useRef('null');

  useEffect(() => {
    if (!text || !qrContainerRef.current) {
      return;
    }
    if (qrcodeRef.current === null) {
      qrcodeRef.current = new window.QRCode(qrContainerRef.current, {
        text,
        width: 180,
        height: 180,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.H,
      });
    } else {
      qrcodeRef.current.makeCode(qr);
    }
  }, [text]);

  const logo = useMemo(() => {
    if (text.indexOf('wxp://') === 0) {
      return 'https://img.alicdn.com/tfs/TB1Y2BXoz39YK4jSZPcXXXrUFXa-657-578.png';
    }
    if (text.indexOf('https://qr.alipay.com/') === 0) {
      return 'https://img.alicdn.com/tfs/TB1ID6DkZVl614jSZKPXXaGjpXa-488-492.png';
    }
    return null;
  }, [text]);

  return (
    <div className="qrcode">
      <div className="code" ref={qrContainerRef}></div>
      {logo && (
        <div className="logo">
          <img src={logo} />
        </div>
      )}
    </div>
  );
};

export default QRCode;
