import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Input, Card, Avatar, Badge } from "antd";

import { GlobalStoreType } from "@types";

import "./ChatSidebar.scss";

type IndicatorType = "FRIEND" | "GROUP";

type SidebarProps = {
  onChatSelect: (id: string, type: IndicatorType) => any;
};

const { Meta } = Card;

function ChatSidebar(props: SidebarProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const userMessages = useSelector(
    (state: GlobalStoreType) => state.userMessages
  );

  const friendList = useSelector((state: GlobalStoreType) => state.friendList);
  const groupList = useSelector((state: GlobalStoreType) => state.groupList);
  const [searchFilter, setSearchFilter] = useState("");

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

  function searchHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchFilter(e.target.value);
  }

  function getMessageNumber(id: string, type: IndicatorType): number {
    let count = 0;
    if (type === "FRIEND") {
      for (const message of userMessages) {
        if (message.senderId === id && message.messageStatus !== "SEEN") {
          ++count;
        }
      }
    } else {
      for (const message of userMessages) {
        if (message.groupId === id && message.messageStatus !== "SEEN") {
          ++count;
        }
      }
    }

    return count;
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
          const count = getMessageNumber(e.id, type);

          return (
            <div
              className="sidebar-option"
              id={e.id}
              key={e.id}
              onClick={() => {
                props.onChatSelect(e.id, type);
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
}

export default ChatSidebar;
