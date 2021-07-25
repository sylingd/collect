import { Input, message } from "antd";
import React, { useRef, useCallback } from "react";

const CopyInput = (props) => {
  const inputRef = useRef(null);

  const handleFocus = useCallback(() => {
    if (inputRef.current) {
      const input = inputRef.current.input;
      input.setSelectionRange(0, input.value.length);
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (inputRef.current) {
      const input = inputRef.current.input;
      try {
        navigator.clipboard.writeText(input.value);
        message.success("已复制");
        return;
      } catch (e) {
        // ignore
      }
      inputRef.current.focus();
      input.setSelectionRange(0, input.value.length);
      document.execCommand("copy");
      message.success("已复制");
    }
  }, []);

  return (
    <Input.Search
      value={props.value}
      ref={inputRef}
      onFocus={handleFocus}
      readOnly
      onSearch={handleCopy}
      enterButton="复制"
    />
  );
};

export default CopyInput;
