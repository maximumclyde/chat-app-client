import { useRef, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

import { Header, ChatSidebar, ChatPage } from "..";
import { ChatHandle } from "../ChatPage/ChatPage";
import { SidebarHandle } from "../ChatSidebar/ChatSidebar";
import {
  userActions,
  userMessageActions,
  friendListActions,
} from "@store-actions";
import socket from "@socket";

import "./AuthenticatedLayout.scss";

type SocketRequestType = {
  request: string;
  body: {
    _id: string;
    userName?: string;
  };
};

function AuthenticatedLayout() {
  const chatRef = useRef<ChatHandle>(null);
  const sidebarRef = useRef<SidebarHandle>(null);

  const dispatch = useDispatch();

  const onNewMessage = useCallback((id: string) => {
    sidebarRef.current?.onNewMessage(id);
  }, []);

  const socketRemoveEvent = useCallback(
    (event: MessageEvent<string>) => {
      const { request, body } = JSON.parse(event.data) as SocketRequestType;
      if (request === "unfriended" || request === "blocked") {
        chatRef.current?.removeLiveChatView(body._id);
        dispatch(
          userActions.removeIdFromUserProperties({ friendList: body._id })
        );
        dispatch(userMessageActions.removeUserMessages(body._id));
        dispatch(friendListActions.removeFriend(body._id));
      }

      if (request === "blocked") {
        dispatch(userActions.addIdToUserProperties({ blockedBy: body._id }));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    socket.addEventListener("message", socketRemoveEvent);

    return () => {
      socket.removeEventListener("message", socketRemoveEvent);
    };
  }, [socketRemoveEvent]);

  const onChatSelect = useCallback((id: string, type: "FRIEND" | "GROUP") => {
    const e = document.getElementById(id);
    const prevActive = document.querySelector(".sidebar-option-active");
    if (prevActive) {
      prevActive.classList.remove("sidebar-option-active");
    }
    if (e) {
      e.classList.add("sidebar-option-active");
    }

    chatRef.current?.changeChatView(id, type);
  }, []);

  return (
    <div className="authenticated-layout-container">
      <Header />
      <div className="authenticated-layout-body">
        <ChatSidebar onChatSelect={onChatSelect} ref={sidebarRef} />
        <ChatPage ref={chatRef} onNewMessage={onNewMessage} />
      </div>
    </div>
  );
}

export default AuthenticatedLayout;
