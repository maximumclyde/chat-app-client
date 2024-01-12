import { useSelector } from "react-redux";
import { Input, Form } from "antd";
import { SendOutlined, PaperClipOutlined } from "@ant-design/icons";

import { GlobalStoreType } from "@types";

import "./MessageInput.scss";

type MessageInputProps = {
  onSend: (content: string) => any;
};

function MessageInput(props: MessageInputProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const [form] = Form.useForm();

  const { onSend } = props;

  return (
    <div
      className={`message-input-container${
        preferences.theme === "dark" ? " message-input-dark" : ""
      }`}
    >
      <Form form={form}>
        <Form.Item name="input">
          <Input
            allowClear={false}
            size="large"
            placeholder="Write a message..."
            onKeyDown={(e) => {
              const val: string = form.getFieldValue("input");
              if (e.key === "Enter") {
                if (val) {
                  onSend(val);
                  form.setFieldValue("input", "");
                }
              }
            }}
            suffix={<PaperClipOutlined />}
            className={`message-input ${
              preferences.theme === "dark" ? "dark-antd-input" : ""
            }`}
          />
        </Form.Item>
      </Form>
      <div
        className="send-container"
        onClick={() => {
          const val: string = form.getFieldValue("input");
          if (val) {
            onSend(val);
            form.setFieldValue("input", "");
          }
        }}
      >
        <SendOutlined />
      </div>
    </div>
  );
}

export default MessageInput;
