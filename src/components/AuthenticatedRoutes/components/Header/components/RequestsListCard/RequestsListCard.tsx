import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Card, message } from "antd";

import { UsersOption } from "..";
import { GlobalStoreType, FriendType, UserType } from "@types";
import { toArrayBuffer } from "@utils";
import { userActions, friendListActions } from "@store-actions";
import { StyledButton } from "@ui-components";

import "./RequestsListCard.scss";

function RequestsListCard() {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );

  const [requestsList, setRequestsList] = useState<FriendType[]>([]);
  const dispatch = useDispatch();

  async function actionHandle(user: FriendType, type: "confirm" | "deny") {
    const path = type === "confirm" ? "accept" : "decline";
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

  useEffect(() => {
    if (!authenticatedUser?.friendRequests?.length) {
      setRequestsList([]);
      return;
    }

    axios
      .post<FriendType[]>("/users/batchGetUsers", {
        idList: authenticatedUser?.friendRequests,
      })
      .then((res) => {
        const avatarList = res.data.map(({ avatar }) => {
          return URL.createObjectURL(toArrayBuffer(avatar || ""));
        });

        setRequestsList((prev) => {
          prev.forEach((e) => {
            URL.revokeObjectURL(e?.avatar || "");
          });

          return res.data.map((e, i) => ({
            ...e,
            avatar: avatarList[i],
          }));
        });
      })
      .catch((err) => {
        console.log("Error getting requests: ", err);
      });
  }, [authenticatedUser.friendRequests]);

  useEffect(() => {
    return () => {
      requestsList.forEach((e) => {
        URL.revokeObjectURL(e?.avatar || "");
      });
    };
  }, [requestsList]);

  return (
    <Card
      style={{ width: 300 }}
      actions={[]}
      className={`requests-card${
        preferences.theme === "dark" ? "requests-card-dark" : ""
      }`}
    >
      {requestsList?.map((user) => (
        <UsersOption
          {...{
            user,
            key: user._id,
            theme: preferences.theme,
            actionHandle,
            denyActionUsers: authenticatedUser?.friendRequests || [],
            denyText: "Deny",
            additionalActions: (
              <StyledButton
                text="Accept"
                type="confirm"
                onClick={() => {
                  void actionHandle(user, "confirm");
                }}
              />
            ),
          }}
        />
      ))}
    </Card>
  );
}

export default RequestsListCard;
