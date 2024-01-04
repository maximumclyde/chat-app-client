import {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
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

type ViewObjectType = Partial<
  FriendType & GroupType & { type: "GROUP" | "FRIEND" }
>;

type Callback = () => any;

const ChatPage = forwardRef<ChatHandle, object>((_, ref) => {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const userMessages = useSelector(
    (state: GlobalStoreType) => state.userMessages
  );
  const friendList = useSelector((state: GlobalStoreType) => state.friendList);
  const groupList = useSelector((state: GlobalStoreType) => state.groupList);

  const [viewObject, setViewObject] = useState<ViewObjectType>();

  const dispatch = useDispatch();
  const prevQuery = useRef<string>("");
  const mesNo = useRef<number>(0);

  const requestPrevMessages = useCallback(
    (callback?: Event | Callback) => {
      const container = document.getElementById("message-list-container");

      if (!viewObject?._id || !container || container?.scrollTop) {
        return;
      }

      let URI = `/message/${viewObject._id}?messagesExchanged=${mesNo.current}`;
      if (viewObject?.type === "GROUP") {
        URI = `message/group/${viewObject._id}?messagesExchanged=${mesNo.current}`;
      }

      if (URI === prevQuery.current) {
        return;
      }

      axios
        .get<MessageType[]>(URI)
        .then((res) => {
          dispatch(userMessageActions.addMessages(res.data));
          prevQuery.current = URI;
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

  useEffect(() => {
    let messagesExchanged = 0;
    for (const message of userMessages) {
      if (
        message.senderId === viewObject?._id ||
        message.receiverId === viewObject?._id ||
        message.groupId === viewObject?._id
      ) {
        ++messagesExchanged;
      }
    }
    mesNo.current = messagesExchanged;
  }, [userMessages, viewObject]);

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
              prevQuery.current = "";
              mesNo.current = 0;
            }
          } else {
            const g = groupList.find((e) => e._id === id);
            if (g) {
              setViewObject({ ...g, type: "GROUP" });
              prevQuery.current = "";
              mesNo.current = 0;
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
