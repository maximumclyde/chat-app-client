import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { AutoComplete, Input, message } from "antd";

import { UsersOption } from "..";
import { FriendType, GlobalStoreType, UserType } from "@types";
import { toArrayBuffer } from "@utils";
import { authenticatedUserActions } from "@store-actions";

function UserSearch() {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );

  const [queryUsers, setQueryUsers] = useState<FriendType[]>([]);
  const dispatch = useDispatch();

  function revokeAvatars() {
    for (const user of queryUsers) {
      if (user?.avatar) {
        URL.revokeObjectURL(user.avatar);
      }
    }
  }

  function updateQuery(users: Array<FriendType>) {
    users.forEach((user) => {
      if (user?.avatar) {
        const avatar = URL.createObjectURL(toArrayBuffer(user.avatar));
        user.avatar = avatar;
      }
    });
    setQueryUsers(users);
  }

  async function getUsersQuery(query: string): Promise<void> {
    void message.loading({
      content: "Searching...",
      key: "usersQuery",
      duration: 0,
    });

    try {
      revokeAvatars();
      const usersRes = await axios.post<FriendType[]>("/userQuery", {
        query,
      });
      message.destroy("usersQuery");
      updateQuery(usersRes.data);
    } catch (err) {
      console.log("Error getting users: ", err);
      void message.error({
        content: "Something went wrong while getting users",
        key: "usersQuery",
      });
    }
  }

  async function requestHandle(
    user: FriendType,
    type: "request" | "removeRequest"
  ) {
    await axios
      .post<UserType>(`/users/${type}/${user._id}`)
      .then(({ data }) => {
        dispatch(
          authenticatedUserActions.updateUserProperties({
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

  return (
    <AutoComplete
      popupMatchSelectWidth={false}
      options={queryUsers.map((e) => ({
        value: e.userName,
        label: (
          <UsersOption
            user={e}
            theme={preferences.theme}
            requestHandle={requestHandle}
            requestsMade={authenticatedUser?.requestsMade}
          />
        ),
      }))}
      popupClassName={preferences?.theme === "dark" ? "dark-popover" : ""}
    >
      <Input.Search
        enterButton
        allowClear
        placeholder="Search for users..."
        onSearch={(val) => {
          if (val) {
            void getUsersQuery(val);
          }
        }}
      />
    </AutoComplete>
  );
}

export default UserSearch;
