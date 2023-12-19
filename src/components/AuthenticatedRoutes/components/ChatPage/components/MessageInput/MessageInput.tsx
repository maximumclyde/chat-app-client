import { useSelector } from "react-redux";
import { GlobalStoreType } from "@types";

import "./MessageInput.scss";

function MessageInput() {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  return (
    <div
      className={`message-input${
        preferences.theme === "dark" ? " message-input-dark" : ""
      }`}
    ></div>
  );
}

export default MessageInput;
