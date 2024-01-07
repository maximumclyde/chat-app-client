import { useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { Input, Card, Avatar, Badge } from "antd";

import { GlobalStoreType } from "@types";

import "./ChatSidebar.scss";

type IndicatorType = "FRIEND" | "GROUP";

type SidebarProps = {
  onChatSelect: (id: string, type: IndicatorType) => any;
};

type NewMessageType = {
  [key: string]: number;
};

export type SidebarHandle = {
  onNewMessage: (id: string) => void;
};

const { Meta } = Card;

const ChatSidebar = forwardRef<SidebarHandle, SidebarProps>((props, ref) => {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  const friendList = useSelector((state: GlobalStoreType) => state.friendList);
  const groupList = useSelector((state: GlobalStoreType) => state.groupList);
  const [searchFilter, setSearchFilter] = useState("");
  const [newMessages, setNewMessages] = useState<NewMessageType>({});

  const list = useMemo(() => {
    const l = [];
    for (const friend of friendList) {
      l.push({
        name: friend.userName,
        id: friend._id,
        avatar: friend?.avatar,
        type: "FRIEND",
      });
    }

    for (const group of groupList) {
      l.push({
        name: group.groupName,
        id: group._id,
        avatar: group?.avatar,
        type: "GROUP",
      });
    }

    return l;
  }, [friendList, groupList]);

  useImperativeHandle(
    ref,
    () => {
      return {
        onNewMessage(id: string) {
          setNewMessages((prev) => {
            const tmp = { ...prev };
            tmp[id] = (tmp?.[id] || 0) + 1;
            return tmp;
          });
        },
      };
    },
    []
  );

  function searchHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchFilter(e.target.value);
  }

  function onUserSelect(id: string, type: IndicatorType) {
    props.onChatSelect(id, type);
    setNewMessages((prev) => {
      const tmp = { ...prev };
      tmp[id] = 0;
      return tmp;
    });
  }

  return (
    <div
      className={`main-sidebar-container${
        preferences.theme === "dark" ? " sidebar-dark" : ""
      }`}
    >
      <div className="sidebar-search">
        <Input
          allowClear
          placeholder="Search..."
          onChange={searchHandler}
          className={`sidebar-search ${
            preferences.theme === "dark" ? "dark-antd-input" : ""
          }`}
        />
      </div>
      <div className="sidebar-list">
        {list.flatMap((e) => {
          if (
            !e.name
              .toLocaleLowerCase()
              .includes(searchFilter.toLocaleLowerCase())
          ) {
            return [];
          }

          const type = e.type as IndicatorType;
          const count = newMessages?.[e.id] || 0;

          return (
            <div
              className="sidebar-option"
              id={e.id}
              key={e.id}
              onClick={() => {
                onUserSelect(e.id, type);
              }}
            >
              <Meta
                avatar={<Avatar src={e.avatar} shape="circle" />}
                title={
                  <div className="sidebar-option-name">
                    <span>{e.name}</span>
                    {count ? <Badge count={count} color="red" /> : null}
                  </div>
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ChatSidebar;
