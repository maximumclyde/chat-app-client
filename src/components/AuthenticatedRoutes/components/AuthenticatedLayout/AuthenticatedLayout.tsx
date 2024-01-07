import { useRef, useCallback } from "react";
import { Header, ChatSidebar, ChatPage } from "..";

import "./AuthenticatedLayout.scss";

import { ChatHandle } from "../ChatPage/ChatPage";
import { SidebarHandle } from "../ChatSidebar/ChatSidebar";

function AuthenticatedLayout() {
  const chatRef = useRef<ChatHandle>(null);
  const sidebarRef = useRef<SidebarHandle>(null);

  function onChatSelect(id: string, type: "FRIEND" | "GROUP") {
    const e = document.getElementById(id);
    const prevActive = document.querySelector(".sidebar-option-active");
    if (prevActive) {
      prevActive.classList.remove("sidebar-option-active");
    }
    if (e) {
      e.classList.add("sidebar-option-active");
    }

    chatRef.current?.changeChatView(id, type);
  }

  const onNewMessage = useCallback((id: string) => {
    sidebarRef.current?.onNewMessage(id);
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
