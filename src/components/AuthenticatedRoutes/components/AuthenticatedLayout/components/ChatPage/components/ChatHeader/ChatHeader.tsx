import { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { Card, Avatar } from "antd";

import { GroupCard, ProfileCard } from "./components";
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
  const [groupCardOpen, setGroupCardOpen] = useState<boolean>(false);

  const { viewObject } = props;

  async function optionClickHandler(key: string, confirmed = false) {
    if (key === "SEE_PROFILE") {
      setProfileCardOpen(true);
    } else if (key === "SEE_MEMBERS") {
      setGroupCardOpen(true);
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

  function openProfileCard() {
    if (viewObject?.type === "FRIEND") {
      setProfileCardOpen(true);
    } else {
      setGroupCardOpen(true);
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
              avatar: (
                <Avatar
                  alt=""
                  src={viewObject?.avatar}
                  onClick={openProfileCard}
                />
              ),
              title: (
                <b onClick={openProfileCard}>
                  {viewObject
                    ? viewObject?.groupName || viewObject?.userName
                    : ""}
                </b>
              ),
            }}
          />
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
          {`Are you sure you want to ${confirmAction
            .toLocaleLowerCase()
            .split("_")
            .join(" ")}?`}
        </InfoModal>
      )}
      {profileCardOpen && viewObject && (
        <ProfileCard
          {...{
            open: true,
            viewObject,
            onCancel() {
              setProfileCardOpen(false);
            },
          }}
        />
      )}
      {groupCardOpen && viewObject && (
        <GroupCard
          {...{
            open: true,
            viewObject,
            onCancel() {
              setGroupCardOpen(false);
            },
          }}
        />
      )}
    </Fragment>
  );
}

export default ChatHeader;
