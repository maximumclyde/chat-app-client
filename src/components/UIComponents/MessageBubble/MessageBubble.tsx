import { useSelector } from "react-redux";
import dayjs from "dayjs";

import { MessageType, GlobalStoreType } from "@types";

import "./MessageBubble.scss";

type BubbleProps = {
  message: MessageType;
};

function MessageBubble(props: BubbleProps) {
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );

  const { message } = props;

  function getTime(created: string): string {
    const today = dayjs().startOf("D").valueOf();
    const createdTime = dayjs(created).valueOf();

    if (createdTime < today) {
      if (
        dayjs(createdTime).startOf("year").valueOf() <
        dayjs().startOf("year").valueOf()
      ) {
        return dayjs(created).format("DD/MM/YY - HH:mm");
      }

      return dayjs(created).format("DD/MM - HH:mm");
    }

    return dayjs(created).format("HH:mm");
  }

  return (
    <div
      className={`single-message-container ${
        message.senderId !== authenticatedUser._id
          ? "message-received"
          : "message-sent"
      }`}
    >
      <div className="message-bubble">
        <div
          className="bubble-name"
          style={{
            display:
              !message.groupId || message.senderId === authenticatedUser._id
                ? "none"
                : "",
          }}
        >
          {message.senderName}
        </div>
        <div className="bubble-content">{message.content}</div>
        <div className="bubble-time">{getTime(message.createdAt)}</div>
      </div>
    </div>
  );
}

export default MessageBubble;
