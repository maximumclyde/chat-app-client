import { useState, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { FriendType, GlobalStoreType, GroupType } from "@types";

import "./ChatPage.scss";

export type ChatHandle = {
  changeChatView: (id: string, type: "GROUP" | "FRIEND") => any;
};

const ChatPage = forwardRef<ChatHandle, object>((_, ref) => {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const friendList = useSelector((state: GlobalStoreType) => state.friendList);
  const groupList = useSelector((state: GlobalStoreType) => state.groupList);

  const [viewObject, setViewObject] = useState<FriendType | GroupType>();

  useImperativeHandle(
    ref,
    () => {
      return {
        changeChatView(id, type) {
          if (viewObject?._id === id) {
            return;
          }

          if (type === "FRIEND") {
            const f = friendList.find((e) => e._id === id);
            if (f) {
              setViewObject(f);
            }
          } else {
            const g = groupList.find((e) => e._id === id);
            if (g) {
              setViewObject(g);
            }
          }
        },
      };
    },
    [friendList, groupList, viewObject]
  );

  return (
    <div
      className={`main-chat-page-container${
        preferences.theme === "dark" ? " chat-page-dark" : ""
      }`}
    ></div>
  );
});

export default ChatPage;
