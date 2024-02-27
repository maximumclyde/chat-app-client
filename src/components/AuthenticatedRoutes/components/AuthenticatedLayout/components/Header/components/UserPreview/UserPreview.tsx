import { useState, Fragment } from "react";
import { Card, Avatar, Tooltip } from "antd";
import { StopOutlined } from "@ant-design/icons";

import {
  blockUser,
  makeRequest,
  removeFriend,
  removeRequest,
  acceptRequest,
  declineRequest,
} from "@utils";
import { FriendType } from "@types";
import { useAppSelector } from "@hooks";
import { StyledButton, InfoModal } from "@ui-components";

import "./UserPreview.scss";

type ActionType = "MAKE" | "REMOVE";

type ConfirmationType = "UNFRIEND" | "BLOCK";

type UserPreviewProps = {
  user: FriendType;
  onRequestHandler?: (id: string, type: ActionType) => any;
  onResponseHandler?: (id: string) => any;
  customAction?: React.ReactNode;
};

function UserPreview(props: UserPreviewProps) {
  const { preferences } = useAppSelector((state) => state.preferences);
  const authenticatedUser = useAppSelector((state) => state.authenticatedUser);

  const [confirmation, setConfirmation] = useState<ConfirmationType>();

  const {
    user,
    customAction,
    onRequestHandler = () => {},
    onResponseHandler = () => {},
  } = props;

  const darkMode = preferences.theme === "dark";

  const isFriend = authenticatedUser.friendList.includes(user?._id);
  const isRequested = authenticatedUser.requestsMade.includes(user?._id);
  const hasRequested = authenticatedUser.friendRequests.includes(user?._id);

  let mainActionText = "Make friend request";
  if (isFriend) {
    mainActionText = "Remove friend";
  } else if (isRequested) {
    mainActionText = "Remove friend request";
  } else if (hasRequested) {
    mainActionText = "Decline";
  }

  const negativeAction = mainActionText !== "Make friend request";

  async function requestAction(path: "removeRequest" | "request") {
    let func;

    if (path === "request") {
      func = makeRequest;
    } else {
      func = removeRequest;
    }

    await func(user._id)
      .then(() => {
        const type: ActionType = path === "request" ? "MAKE" : "REMOVE";
        onRequestHandler(user._id, type);
      })
      .catch(() => {});
  }

  async function acceptAction(path: "accept" | "decline") {
    let func;

    if (path === "accept") {
      func = acceptRequest;
    } else {
      func = declineRequest;
    }

    await func(user)
      .then(() => {
        onResponseHandler(user._id);
      })
      .catch(() => {});
  }

  async function blockHandler() {
    await blockUser(user._id, user.userName)
      .then(() => {
        onRequestHandler(user._id, "REMOVE");
      })
      .catch(() => {});
  }

  async function friendRemove() {
    await removeFriend(user._id).catch(() => {});
  }

  function clickHandler() {
    switch (mainActionText) {
      case "Make friend request":
        void requestAction("request");
        break;
      case "Remove friend request":
        void requestAction("removeRequest");
        break;
      case "Decline":
        void acceptAction("decline");
        break;
      default:
        setConfirmation("UNFRIEND");
    }
  }

  return (
    <Fragment>
      <div
        className={`user-preview-container ${
          darkMode ? "user-preview-dark" : ""
        }`}
      >
        <Card.Meta
          {...{
            avatar: <Avatar src={user?.avatar || undefined} alt="" />,
            title: user?.userName,
          }}
        />
        <div className="actions-container">
          {customAction !== undefined ? (
            customAction
          ) : (
            <Fragment>
              {hasRequested && (
                <StyledButton
                  text="Accept"
                  onClick={() => {
                    void acceptAction("accept");
                  }}
                />
              )}
              <StyledButton
                {...{
                  text: mainActionText,
                  type: negativeAction ? "cancel" : "confirm",
                  onClick() {
                    clickHandler();
                  },
                }}
              />
              <Tooltip title="Block user" trigger={["hover"]}>
                <StyledButton
                  text={<StopOutlined />}
                  type="cancel"
                  onClick={() => {
                    setConfirmation("BLOCK");
                  }}
                />
              </Tooltip>
            </Fragment>
          )}
        </div>
      </div>
      {Boolean(confirmation) && (
        <InfoModal
          {...{
            open: Boolean(confirmation),
            onCancel() {
              setConfirmation(undefined);
            },
            title: "Confirmation",
            onConfirm() {
              if (confirmation === "UNFRIEND") {
                void friendRemove();
              } else {
                void blockHandler();
              }
              setConfirmation(undefined);
            },
          }}
        >
          Are you sure you want to {confirmation?.toLocaleLowerCase()}{" "}
          {user.userName}?
        </InfoModal>
      )}
    </Fragment>
  );
}

export default UserPreview;
