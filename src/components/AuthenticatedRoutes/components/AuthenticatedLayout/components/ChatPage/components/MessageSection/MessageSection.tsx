import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import axios from "axios";

import socket from "@socket";
import { MessageInput } from "..";
import { MessageBubble } from "@ui-components";
import { userMessageActions } from "@store-actions";
import { messageSocketHandler as socketHandler } from "@utils";
import { FriendType, GlobalStoreType, GroupType, MessageType } from "@types";

import "./MessageSection.scss";

type MessageSectionProps = {
  viewObject?: Partial<FriendType & GroupType & { type: "GROUP" | "FRIEND" }>;
  requestPrevMessages: () => any;
  onNewMessage: (id: string) => void;
};

function MessageSection(props: MessageSectionProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  const userMessages = useSelector(
    (state: GlobalStoreType) => state.userMessages
  );

  const dispatch = useDispatch();

  const { viewObject, requestPrevMessages, onNewMessage } = props;

  const scrollIfOnBottom = useCallback((checkBottom = true) => {
    const container = document.getElementById("message-list-container");
    if (container) {
      if (
        container.scrollTop >=
          container.scrollHeight - container.offsetHeight - 50 ||
        !checkBottom
      ) {
        setTimeout(() => {
          container.scroll({
            top: container.scrollHeight,
            behavior: "instant",
          });
        }, 0);
      }
    }
  }, []);

  const messageSocketHandler = useCallback(
    (event: MessageEvent<string>) => {
      socketHandler(event, {
        onMessageReceived(sender: string) {
          if (viewObject?._id !== sender) {
            onNewMessage(sender);
          }

          if (viewObject?._id === sender) {
            scrollIfOnBottom();
          }
        },
      });
    },
    [viewObject, scrollIfOnBottom, onNewMessage]
  );

  useEffect(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.addEventListener("message", messageSocketHandler);
    }
    return () => {
      socket.removeEventListener("message", messageSocketHandler);
    };
  }, [messageSocketHandler]);

  useEffect(() => {
    const container = document.getElementById("message-list-container");
    if (container) {
      container.scroll({ top: container.scrollHeight, behavior: "instant" });

      setTimeout(() => {
        container.addEventListener("scroll", requestPrevMessages);
      }, 0);

      requestPrevMessages();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", requestPrevMessages);
      }
    };
  }, [requestPrevMessages]);

  function messageFilter(message: MessageType): boolean {
    if (!viewObject) {
      return false;
    }

    if (message?.groupId) {
      return message?.groupId === viewObject?._id;
    } else {
      return (
        message?.senderId === viewObject?._id ||
        message?.receiverId === viewObject?._id
      );
    }
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
        scrollIfOnBottom(false);
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
      <div className="message-list-container" id="message-list-container">
        <div className="messages">
          {userMessages.flatMap((message, key) => {
            if (!messageFilter(message)) {
              return [];
            }
            return <MessageBubble message={message} key={`${key}`} />;
          })}
        </div>
      </div>
      <MessageInput onSend={onSend} />
    </div>
  );
}

export default MessageSection;
