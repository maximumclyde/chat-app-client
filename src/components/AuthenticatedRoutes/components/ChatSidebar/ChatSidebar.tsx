import { useSelector } from "react-redux";

import { GlobalStoreType } from "@types";

import "./ChatSidebar.scss";

function ChatSidebar() {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  return (
    <div
      className={`main-sidebar-container${
        preferences.theme === "dark" ? " sidebar-dark" : ""
      }`}
    >
      <div className="sidebar-search"></div>
      <div className="sidebar-list"></div>
    </div>
  );
}

export default ChatSidebar;
