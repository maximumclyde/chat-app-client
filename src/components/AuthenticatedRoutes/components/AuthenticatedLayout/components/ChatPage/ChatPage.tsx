import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { message } from "antd";

import { userMessageActions } from "@store-actions";
import { useAppSelector, useAppDispatch } from "@hooks";
import { ChatHeader, MessageSection } from "./components";
import { FriendType, GroupType, MessageType } from "@types";

import "./ChatPage.scss";

export type ChatHandle = {
  changeChatView: (id: string, type: "GROUP" | "FRIEND") => any;
  removeLiveChatView: (id: string) => any;
};

type ViewObjectType = Partial<
  FriendType & GroupType & { type: "GROUP" | "FRIEND" }
>;

type ChatPageProps = {
  onNewMessage: (id: string) => void;
};

const ChatPage = forwardRef<ChatHandle, ChatPageProps>((props, ref) => {
  const friendList = useAppSelector((state) => state.friendList);
  const groupList = useAppSelector((state) => state.groupList);
  const { preferences } = useAppSelector((state) => state.preferences);
  const userMessages = useAppSelector((state) => state.userMessages);
  const authenticatedUser = useAppSelector((state) => state.authenticatedUser);

  const [viewObject, setViewObject] = useState<ViewObjectType>();

  const dispatch = useAppDispatch();

  const prevQueryLimit = useRef<boolean>(false);
  const mesNo = useRef<number>(0);

  const requestPrevMessages = useCallback(() => {
    const container = document.getElementById("message-list-container");

    if (!viewObject?._id || !container || container?.scrollTop) {
      return;
    }

    let URI = `/message/${viewObject._id}?messagesExchanged=${mesNo.current}`;
    if (viewObject?.type === "GROUP") {
      URI = `/message/group/${viewObject._id}?messagesExchanged=${mesNo.current}`;
    }

    if (prevQueryLimit.current) {
      return;
    }

    const prevScrollHeight = container.scrollHeight;

    axios
      .get<MessageType[]>(URI)
      .then((res) => {
        if (!res.data.length) {
          prevQueryLimit.current = true;
          return;
        }

        dispatch(userMessageActions.addMessages(res.data));

        setTimeout(() => {
          container.scroll({
            top: container.scrollHeight - prevScrollHeight,
            behavior: "instant",
          });
        }, 0);
      })
      .catch((err) => {
        void message.error({
          content: "Something went wrong while trying to get the messages",
        });
        console.log("Error getting messages: ", err);
      });
  }, [viewObject, dispatch]);

  useEffect(() => {
    if (viewObject?._id) {
      updateMessageNumber(
        userMessages,
        viewObject?._id,
        authenticatedUser._id,
        viewObject?.type
      );
    }
  }, [viewObject, userMessages, authenticatedUser._id]);

  useEffect(() => {
    if (viewObject?._id) {
      if (
        !groupList.find(({ _id }) => _id === viewObject?._id) &&
        !friendList.find(({ _id }) => _id === viewObject?._id)
      ) {
        setViewObject(undefined);
      }
    }
  }, [groupList, friendList, viewObject?._id]);

  useImperativeHandle(
    ref,
    () => {
      return {
        changeChatView(id, type) {
          if (viewObject?._id === id) {
            return;
          }

          let tmpNewViewObject = {} as ViewObjectType;

          if (type === "FRIEND") {
            const f = friendList.find((e) => e._id === id);
            if (f) {
              tmpNewViewObject = { ...f, type: "FRIEND" };
            }
          } else {
            const g = groupList.find((e) => e._id === id);
            if (g) {
              tmpNewViewObject = { ...g, type: "GROUP" };
            }
          }

          if (tmpNewViewObject?._id) {
            updateMessageNumber(
              userMessages,
              tmpNewViewObject._id,
              authenticatedUser._id,
              tmpNewViewObject.type
            );
            prevQueryLimit.current = false;
          }

          setViewObject(tmpNewViewObject);
        },
        removeLiveChatView(id) {
          if (viewObject?._id === id) {
            setViewObject(undefined);
          }
        },
      };
    },
    [friendList, groupList, viewObject, userMessages, authenticatedUser._id]
  );

  function updateMessageNumber(
    messages: MessageType[],
    id: string,
    userId: string,
    type?: "GROUP" | "FRIEND"
  ) {
    let messagesExchanged = 0;
    for (const message of messages) {
      if (type === "GROUP") {
        if (message.groupId === id) {
          ++messagesExchanged;
        }
      } else {
        if (!message?.groupId) {
          if (
            (message.senderId === id && message.receiverId === userId) ||
            (message.receiverId === id && message.senderId === userId)
          ) {
            ++messagesExchanged;
          }
        }
      }
    }

    mesNo.current = messagesExchanged;
  }

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
        onNewMessage={props.onNewMessage}
      />
    </div>
  );
});

export default ChatPage;
