import { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { Card, Avatar, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";

import { getOptions } from "./utils";
import { InfoModal } from "@ui-components";
import { blockUser, removeFriend } from "@utils";
import { FriendType, GroupType, GlobalStoreType } from "@types";

import "./ChatHeader.scss";

type ChatHeaderProps = {
  viewObject?: Partial<FriendType & GroupType & { type: "GROUP" | "FRIEND" }>;
};

const { Meta } = Card;

function ChatHeader(props: ChatHeaderProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  const [confirmAction, setConfirmAction] = useState<string>("");
  const [profileCardOpen, setProfileCardOpen] = useState<boolean>(false);
  const [usersCardOpen, setUsersCardOpen] = useState<boolean>(false);

  const { viewObject } = props;

  async function optionClickHandler(key: string, confirmed = false) {
    if (key === "SEE_PROFILE") {
      setProfileCardOpen(true);
    } else if (key === "SEE_MEMBERS") {
      setUsersCardOpen(true);
    } else {
      if (!confirmed) {
        setConfirmAction(key);
      } else {
        try {
          switch (key) {
            case "REMOVE_FRIEND":
              await removeFriend(viewObject?._id);
              break;
            case "BLOCK_FRIEND":
              await blockUser(viewObject?._id, viewObject?.userName);
              break;
            case "LEAVE_GROUP":
              break;
            default:
              break;
          }
        } catch (err) {
          console.log("Error: ", err);
        }
      }
    }
  }

  return (
    <Fragment>
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
        <div className="chat-header-section-right chat-header-section">
          <Dropdown
            {...{
              menu: {
                items: getOptions(viewObject?.type),
                onClick(e) {
                  void optionClickHandler(e.key);
                },
                className: "chat-header-drop",
                theme: preferences.theme,
              },
            }}
          >
            <MoreOutlined />
          </Dropdown>
        </div>
      </div>
      {Boolean(confirmAction) && (
        <InfoModal
          {...{
            open: Boolean(confirmAction),
            onCancel() {
              setConfirmAction("");
            },
            onConfirm() {
              void optionClickHandler(confirmAction, true);
              setConfirmAction("");
            },
            title: "Confirmation",
          }}
        >
          {`Are you sure you want to ${confirmAction.toLocaleLowerCase().split("_").join(" ")}?`}
        </InfoModal>
      )}
    </Fragment>
  );
}

export default ChatHeader;
