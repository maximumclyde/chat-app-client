import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import axios from "axios";

import { FriendType, GlobalStoreType, GroupType, MessageType } from "@types";
import { userMessageActions } from "@store-actions";
import { ChatHeader, MessageSection } from "./components";

import "./ChatPage.scss";

export type ChatHandle = {
  changeChatView: (id: string, type: "GROUP" | "FRIEND") => any;
};

type Callback = () => any;

const ChatPage = forwardRef<ChatHandle, object>((_, ref) => {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const friendList = useSelector((state: GlobalStoreType) => state.friendList);
  const groupList = useSelector((state: GlobalStoreType) => state.groupList);

  const [viewObject, setViewObject] =
    useState<Partial<FriendType & GroupType & { type: "GROUP" | "FRIEND" }>>();

  const dispatch = useDispatch();

  const requestPrevMessages = useCallback(
    (callback?: Event | Callback) => {
      const container = document.getElementById("message-list-container");

      if (!viewObject?._id) {
        return;
      }

      if (!container) {
        return;
      }

      if (container.scrollTop) {
        return;
      }

      let URI = `/message/${viewObject._id}`;
      if (viewObject?.type === "GROUP") {
        URI = `message/group/${viewObject._id}`;
      }

      axios
        .get<MessageType[]>(URI)
        .then((res) => {
          dispatch(userMessageActions.addMessages(res.data));
          if (typeof callback === "function") {
            callback();
          }
        })
        .catch((err) => {
          void message.error({
            content: "Something went wrong while trying to get the messages",
          });
          console.log("Error getting messages: ", err);
        });
    },
    [viewObject, dispatch]
  );

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
              setViewObject({ ...f, type: "FRIEND" });
            }
          } else {
            const g = groupList.find((e) => e._id === id);
            if (g) {
              setViewObject({ ...g, type: "GROUP" });
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
    >
      <ChatHeader viewObject={viewObject} />
      <MessageSection
        viewObject={viewObject}
        requestPrevMessages={requestPrevMessages}
      />
    </div>
  );
});

export default ChatPage;
