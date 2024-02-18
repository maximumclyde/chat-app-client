import { useRef, useCallback, useEffect } from "react";

import socket from "@socket";
import { usersSocketHandler, groupSocketHandler } from "@utils";
import { ChatHandle } from "./components/ChatPage/ChatPage";
import { Header, ChatSidebar, ChatPage } from "./components";
import { SidebarHandle } from "./components/ChatSidebar/ChatSidebar";

import "./AuthenticatedLayout.scss";

function AuthenticatedLayout() {
  const chatRef = useRef<ChatHandle>(null);
  const sidebarRef = useRef<SidebarHandle>(null);

  const onNewMessage = useCallback((id: string) => {
    sidebarRef.current?.onNewMessage(id);
  }, []);

  const socketRemoveEvent = useCallback((event: MessageEvent<string>) => {
    usersSocketHandler(event, { chatRef });
  }, []);

  const groupHandler = useCallback((event: MessageEvent<string>) => {
    void groupSocketHandler(event);
  }, []);

  useEffect(() => {
    socket.addEventListener("message", socketRemoveEvent);
    socket.addEventListener("message", groupHandler);

    return () => {
      socket.removeEventListener("message", socketRemoveEvent);
      socket.removeEventListener("message", groupHandler);
    };
  }, [socketRemoveEvent, groupHandler]);

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
