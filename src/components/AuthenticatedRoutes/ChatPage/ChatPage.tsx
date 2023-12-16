import { useEffect } from "react";
import { useSelector } from "react-redux";

import { GlobalStoreType } from "@types";
import socket from "@socket";
import MessageType from "./MessageType/MessageType";

import "./ChatPage.scss";

function ChatPage() {
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );

  useEffect(() => {
    socket.addEventListener("open", () => {
      const { userId } = authenticatedUser;
      const token = window.localStorage.getItem("authenticationToken");
      socket.send(
        JSON.stringify({
          event: "CONNECTION_MESSAGE",
          userId,
          token,
        })
      );
    });

    socket.addEventListener("message", (e: MessageEvent<string>) => {
      console.log("Message: ", e);
    });
  }, [authenticatedUser]);

  return (
    <div className="main-chat-page">
      <div className="message-section"></div>
      <MessageType />
    </div>
  );
}

export default ChatPage;
