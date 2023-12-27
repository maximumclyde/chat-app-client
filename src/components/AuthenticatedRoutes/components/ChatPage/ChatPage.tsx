import { useSelector } from "react-redux";
import { GlobalStoreType } from "@types";

import "./ChatPage.scss";

function ChatPage() {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  return (
    <div
      className={`main-chat-page-container${
        preferences.theme === "dark" ? " chat-page-dark" : ""
      }`}
    ></div>
  );
}

export default ChatPage;
