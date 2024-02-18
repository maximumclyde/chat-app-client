import {
  useMemo,
  useState,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from "react";
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
  const groupList = useSelector((state: GlobalStoreType) => state.groupList);
  const friendList = useSelector((state: GlobalStoreType) => state.friendList);
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  const [searchFilter, setSearchFilter] = useState("");
  const [newMessages, setNewMessages] = useState<NewMessageType>({});

  const { onChatSelect } = props;

  const list = useMemo(() => {
    const l = [];
    for (const friend of friendList) {
      l.push({
        name: friend.userName,
        id: friend._id,
        avatar: friend?.avatar,
        type: "FRIEND" as IndicatorType,
      });
    }

    for (const group of groupList) {
      l.push({
        name: group.groupName,
        id: group._id,
        avatar: group?.avatar,
        type: "GROUP" as IndicatorType,
      });
    }

    return l;
  }, [friendList, groupList]);

  const onUserSelect = useCallback(
    (id: string, type: IndicatorType) => {
      onChatSelect(id, type);
      setNewMessages((prev) => {
        const tmp = { ...prev };
        tmp[id] = 0;
        return tmp;
      });
    },
    [onChatSelect]
  );

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
        selectFirstElement() {
          if (list.length) {
            onUserSelect(list[0].id, list[0].type);
          }
        },
      };
    },
    [list, onUserSelect]
  );

  function searchHandler(e: React.ChangeEvent<HTMLInputElement>): void {
    setSearchFilter(e.target.value);
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

          const type = e.type;
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
                    <b>{e.name}</b>
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
