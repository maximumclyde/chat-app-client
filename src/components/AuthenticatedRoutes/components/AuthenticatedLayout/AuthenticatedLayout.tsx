import { useRef } from "react";
import { Header, ChatSidebar, ChatPage } from "..";

import "./AuthenticatedLayout.scss";

import { ChatHandle } from "../ChatPage/ChatPage";

function AuthenticatedLayout() {
  const chatRef = useRef<ChatHandle>(null);

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

  return (
    <div className="authenticated-layout-container">
      <Header />
      <div className="authenticated-layout-body">
        <ChatSidebar onChatSelect={onChatSelect} />
        <ChatPage ref={chatRef} />
      </div>
    </div>
  );
}

export default AuthenticatedLayout;
