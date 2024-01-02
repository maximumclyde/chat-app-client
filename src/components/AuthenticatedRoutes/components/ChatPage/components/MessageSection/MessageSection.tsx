import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import axios from "axios";

import { MessageInput } from "..";
import { MessageBubble } from "@ui-components";
import { FriendType, GlobalStoreType, GroupType, MessageType } from "@types";
import { userMessageActions } from "@store-actions";
import socket from "@socket";

import "./MessageSection.scss";

type SocketRequestType = {
  request: string;
  body: MessageType;
};

type MessageSectionProps = {
  viewObject?: Partial<FriendType & GroupType & { type: "GROUP" | "FRIEND" }>;
};

function MessageSection(props: MessageSectionProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  const userMessages = useSelector(
    (state: GlobalStoreType) => state.userMessages
  );

  const dispatch = useDispatch();

  const messageSocketHandler = useCallback(
    (event: MessageEvent<string>) => {
      const { request, body } = JSON.parse(event.data) as SocketRequestType;
      if (request === "message-received" || request === "group-message") {
        dispatch(userMessageActions.addMessages([body]));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.addEventListener("message", messageSocketHandler);
    }
    return () => {
      socket.removeEventListener("message", messageSocketHandler);
    };
  }, [messageSocketHandler]);

  const { viewObject } = props;

  function messageFilter(message: MessageType): boolean {
    if (!viewObject) {
      return false;
    }

    return (
      message?.groupId === viewObject?._id ||
      message?.senderId === viewObject?._id ||
      message?.receiverId === viewObject?._id
    );
  }

  async function onSend(content: string) {
    if (!viewObject?._id) {
      return;
    }

    let URI = `/message/${viewObject._id}`;
    if (viewObject?.type === "GROUP") {
      URI = `/message/group/${viewObject._id}`;
    }

    await axios
      .post<MessageType>(URI, {
        content,
      })
      .then((res) => {
        dispatch(userMessageActions.addMessages([res.data]));
      })
      .catch((err) => {
        void message.error({
          content: "Something went wrong while trying to send the message!",
          key: "sendError",
        });
        console.log("Error sending the message: ", err);
      });
  }

  return (
    <div
      className={`message-section-container ${
        preferences.theme === "dark" ? "message-section-dark" : ""
      }`}
      style={{
        display: !viewObject ? "none" : undefined,
      }}
    >
      <div className="message-list-container">
        {userMessages.flatMap((message) => {
          if (!messageFilter(message)) {
            return [];
          }

          return <MessageBubble message={message} />;
        })}
      </div>
      <MessageInput onSend={onSend} />
    </div>
  );
}

export default MessageSection;
