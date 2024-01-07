import { useSelector, useDispatch } from "react-redux";
import { Card, Avatar, Tooltip, message } from "antd";
import axios from "axios";
import { StopOutlined } from "@ant-design/icons";

import { StyledButton } from "@ui-components";
import { FriendType, GlobalStoreType, UserType } from "@types";
import { userActions, friendListActions } from "@store-actions";

import "./UserPreview.scss";

type UserPreviewProps = {
  user: FriendType;
};

function UserPreview(props: UserPreviewProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );
  const dispatch = useDispatch();

  const { user } = props;
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
      })
      .catch((err) => {
        void message.error({
          content: "Something went wrong while making request",
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
      })
      .catch((err) => {
        void message.error({
          content: `Something went wrong while trying to ${path} the request`,
          key: "userAcceptError",
        });
        console.log("Error declining the request: ", err);
      });
  }

  async function blockHandler() {}

  async function friendRemove() {}

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
        void friendRemove();
    }
  }

  return (
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
              void blockHandler();
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
}

export default UserPreview;
