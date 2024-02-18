import { useState, Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import { Card, Avatar, Divider, Dropdown, Empty } from "antd";
import dayjs from "dayjs";
import { MoreOutlined } from "@ant-design/icons";

import { InfoModal, PreviewModal } from "@ui-components";
import { GlobalStoreType, FriendType, GroupType } from "@types";
import { removeFriend, blockUser } from "@utils";

import "./ProfileCard.scss";

const { Meta } = Card;

type ProfileCardProps = {
  open: boolean;
  onCancel: () => any;
  viewObject: Partial<FriendType & GroupType & { type: "GROUP" | "FRIEND" }>;
};

type KeyOptionType = "UNFRIEND" | "BLOCK";

function ProfileCard(props: ProfileCardProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const friendList = useSelector((state: GlobalStoreType) => state.friendList);

  const [preview, setPreview] = useState<string>("");
  const [warning, setWarning] = useState<KeyOptionType>();

  const { open, onCancel, viewObject } = props;

  const commonFriends = useMemo(() => {
    if (viewObject.type !== "FRIEND") {
      return [];
    }

    const fr = [];
    for (const friend of viewObject?.friendList || []) {
      const friendObject = friendList.find(({ _id }) => _id === friend);
      if (friendObject) {
        fr.push(friendObject);
      }
    }

    return fr;
  }, [viewObject, friendList]);

  function onOptionClick(key: KeyOptionType) {
    setWarning(key);
  }

  async function onOptionConfirm(option: KeyOptionType) {
    if (option === "UNFRIEND") {
      try {
        await removeFriend(viewObject?._id);
        onCancel()
        // eslint-disable-next-line no-empty
      } catch {}
    } else {
      try {
        await blockUser(viewObject?._id, viewObject?.userName);
        onCancel()
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }

  return (
    <Fragment>
      <InfoModal
        {...{
          open,
          onCancel,
          footer: null,
          className: `profile-card-modal ${
            preferences.theme === "dark" ? "profile-card-dark" : ""
          }`,
        }}
      >
        <div className="profile-card-header">
          <Meta
            avatar={
              <Avatar
                src={viewObject?.avatar}
                onClick={() => {
                  setPreview(viewObject?.avatar || "");
                }}
              />
            }
            title={viewObject?.userName}
            description={`Member since: ${dayjs(viewObject?.createdAt).format(
              "MMM DD, YYYY"
            )}`}
          />
          <div className="profile-actions">
            <Dropdown
              {...{
                placement: "bottomRight",
                overlayClassName: "profile-options",
                menu: {
                  theme: preferences.theme,
                  onClick(e) {
                    onOptionClick(e.key as KeyOptionType);
                  },
                  items: [
                    {
                      danger: true,
                      label: "Unfriend",
                      key: "UNFRIEND",
                    },
                    {
                      danger: true,
                      label: "Block",
                      key: "BLOCK",
                    },
                  ],
                },
                trigger: ["click"],
              }}
            >
              <MoreOutlined />
            </Dropdown>
          </div>
        </div>
        <div className="profile-card-common-friends">
          <Divider orientation="left" orientationMargin={20}>
            Friends in common
          </Divider>
          {commonFriends.map(({ _id, userName, avatar }) => {
            return (
              <Meta
                {...{
                  avatar: (
                    <Avatar
                      src={avatar}
                      onClick={() => {
                        setPreview(avatar || "");
                      }}
                    />
                  ),
                  title: userName,
                  key: _id,
                }}
              />
            );
          })}
          {!commonFriends.length && (
            <Empty description="You have no friends in common" />
          )}
        </div>
      </InfoModal>
      <PreviewModal
        {...{
          open: Boolean(preview),
          uri: preview,
          onCancel() {
            setPreview("");
          },
        }}
      />
      {warning && (
        <InfoModal
          {...{
            open: true,
            title: "Confirmation",
            onCancel() {
              setWarning(undefined);
            },
            onConfirm() {
              void onOptionConfirm(warning);
              setWarning(undefined);
            },
          }}
        >
          {`Are you sure you want to ${warning.toLocaleLowerCase()} ${
            viewObject?.userName || "this user"
          }?`}
        </InfoModal>
      )}
    </Fragment>
  );
}

export default ProfileCard;
