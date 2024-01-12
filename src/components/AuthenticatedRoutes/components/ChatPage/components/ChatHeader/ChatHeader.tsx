import { Card, Avatar } from "antd";
import { useSelector } from "react-redux";
import { FriendType, GroupType, GlobalStoreType } from "@types";

import "./ChatHeader.scss";

type ChatHeaderProps = {
  viewObject?: Partial<FriendType & GroupType>;
};

const { Meta } = Card;

function ChatHeader(props: ChatHeaderProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  const { viewObject } = props;

  return (
    <div
      className={`chat-header-container ${
        preferences.theme === "dark" ? "chat-header-dark" : ""
      }`}
      style={{
        display: !viewObject ? "none" : undefined,
      }}
    >
      <div className="chat-header-section-left chat-header-section">
        <Meta
          {...{
            avatar: <Avatar src={viewObject?.avatar} alt="" />,
            title: (
              <b>
                {viewObject
                  ? viewObject?.groupName || viewObject?.userName
                  : ""}
              </b>
            ),
          }}
        />
      </div>
      <div className="chat-header-section-right chat-header-section"></div>
    </div>
  );
}

export default ChatHeader;
