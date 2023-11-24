import { Input } from "antd";
import { SendOutlined } from "@ant-design/icons";

import "./MessageType.scss";

function MessageType() {
  return (
    <div className="message-typing-section">
      <Input suffix={<SendOutlined />} size="large" />
    </div>
  );
}

export default MessageType;
