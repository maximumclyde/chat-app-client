import { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Avatar, Tooltip, message } from "antd";
import axios from "axios";
import { StopOutlined } from "@ant-design/icons";

import { StyledButton, InfoModal } from "@ui-components";
import { FriendType, GlobalStoreType, UserType } from "@types";
import {
  userActions,
  friendListActions,
  userMessageActions,
} from "@store-actions";

import "./UserPreview.scss";

type ActionType = "MAKE" | "REMOVE";

type ConfirmationType = "UNFRIEND" | "BLOCK";

type UserPreviewProps = {
  user: FriendType;
  onRequestHandler?: (id: string, type: ActionType) => any;
  onResponseHandler?: (id: string) => any;
};

function UserPreview(props: UserPreviewProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );

  const [confirmation, setConfirmation] = useState<ConfirmationType>();

  const dispatch = useDispatch();

  const {
    user,
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
    await axios
      .post<UserType>(`/users/${path}/${user._id}`)
      .then(({ data }) => {
        dispatch(
          userActions.updateUserProperties({
            requestsMade: data?.requestsMade,
          })
        );
        const type: ActionType = path === "request" ? "MAKE" : "REMOVE";
        onRequestHandler(user._id, type);
      })
      .catch((err) => {
        void message.error({
          content: "Something went wrong while processing request",
          key: "requestError",
        });
        console.log("Error making request: ", err);
      });
  }

  async function acceptAction(path: "accept" | "decline") {
    await axios
      .post<UserType>(`/users/${path}/${user._id}`)
      .then((res) => {
        dispatch(
          userActions.updateUserProperties({
            friendList: res.data.friendList,
            friendRequests: res.data.friendRequests,
          })
        );

        if (path === "accept") {
          dispatch(friendListActions.addFriend(user));
        }

        onResponseHandler(user._id);
      })
      .catch((err) => {
        void message.error({
          content: `Something went wrong while trying to ${path} the request`,
          key: "userAcceptError",
        });
        console.log("Error declining the request: ", err);
      });
  }

  async function blockHandler() {
    await axios
      .post<UserType>(`/block/${user._id}`)
      .then(({ data }) => {
        dispatch(
          userActions.updateUserProperties({
            friendList: data.friendList,
            friendRequests: data.friendRequests,
            requestsMade: data.requestsMade,
            userBlock: data.userBlock,
            blockedBy: data.blockedBy,
          })
        );

        dispatch(friendListActions.removeFriend(user._id));
        dispatch(userMessageActions.removeUserMessages(user._id));
      })
      .catch((err) => {
        void message.error({
          content: `Something went wrong while trying to block ${user.userName}`,
          key: "blockError",
        });
        console.log("Error blocking user: ", err);
      });
  }

  async function friendRemove() {
    await axios
      .post<UserType>(`/users/unfriend/${user._id}`)
      .then(({ data }) => {
        if (user?.avatar) {
          URL.revokeObjectURL(user?.avatar);
        }

        dispatch(
          userActions.updateUserProperties({ friendList: data?.friendList })
        );
        dispatch(friendListActions.removeFriend(user._id));
        dispatch(userMessageActions.removeUserMessages(user._id));
      })
      .catch((err) => {
        void message.error({
          content: "Something went wrong while trying to unfriend",
          key: "unfriendError",
        });
        console.log("Error unfriending user: ", err);
      });
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
