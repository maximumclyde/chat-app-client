import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Input, message, Divider, Empty } from "antd";
import axios from "axios";

import { UserPreview } from "..";
import { InfoModal } from "@ui-components";
import { GlobalStoreType, FriendType } from "@types";
import { toArrayBuffer } from "@utils";

import "./FindUsersModal.scss";

type UserModalProps = {
  open: boolean;
  onCancel: () => any;
};

function FindUsersModal(props: UserModalProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );

  const [queryUsers, setQueryUsers] = useState<FriendType[]>([]);
  const [requestsList, setRequestsList] = useState<FriendType[]>([]);
  const [requestsMade, setRequestsMade] = useState<FriendType[]>([]);

  const { open, onCancel } = props;

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
          revokeAvatars(prev);

          return res.data.map((e, i) => ({
            ...e,
            avatar: avatarList[i],
          }));
        });
      })
      .catch((err) => {
        console.log("Error getting requests: ", err);
      });
  }, [authenticatedUser?.friendRequests]);

  useEffect(() => {
    if (!authenticatedUser?.requestsMade?.length) {
      setRequestsMade([]);
      return;
    }

    axios
      .post<FriendType[]>("/users/batchGetUsers", {
        idList: authenticatedUser?.requestsMade,
      })
      .then((res) => {
        const avatarList = res.data.map(({ avatar }) => {
          return URL.createObjectURL(toArrayBuffer(avatar || ""));
        });

        setRequestsMade((prev) => {
          revokeAvatars(prev);

          return res.data.map((e, i) => ({
            ...e,
            avatar: avatarList[i],
          }));
        });
      })
      .catch((err) => {
        console.log("Error getting requests: ", err);
      });
  }, [authenticatedUser?.requestsMade]);

  useEffect(() => {
    return () => {
      revokeAvatars(queryUsers);
      revokeAvatars(requestsList);
      revokeAvatars(requestsMade);
    };
  }, [queryUsers, requestsList, requestsMade]);

  function revokeAvatars(users: FriendType[]) {
    for (const user of users) {
      if (user?.avatar) {
        URL.revokeObjectURL(user.avatar);
      }
    }
  }

  function assignAvatars(users: FriendType[]) {
    users.forEach((user) => {
      if (user?.avatar) {
        const avatar = URL.createObjectURL(toArrayBuffer(user.avatar));
        user.avatar = avatar;
      }
    });
  }

  async function getUsersQuery(query: string): Promise<void> {
    try {
      revokeAvatars(queryUsers);
      const usersRes = await axios.post<FriendType[]>("/userQuery", {
        query,
      });
      message.destroy("usersQuery");
      assignAvatars(usersRes.data);
      setQueryUsers(usersRes.data);
    } catch (err) {
      console.log("Error getting users: ", err);
      void message.error({
        content: "Something went wrong while getting users",
        key: "usersQuery",
      });
    }
  }

  const darkMode = preferences.theme === "dark";

  return (
    <InfoModal
      {...{
        open,
        onCancel,
        footer: null,
        title: "Users Search",
        destroyOnClose: true,
        className: `find-users-modal ${darkMode ? "users-modal-dark" : ""}`,
      }}
    >
      <div className="search-section">
        <Input
          allowClear
          className={`search-input ${darkMode ? "dark-antd-input" : ""}`}
          placeholder="Search for users..."
          onChange={(e) => {
            if (!e.target.value) {
              revokeAvatars(queryUsers);
              setQueryUsers([]);
            }
          }}
          onPressEnter={(e) => {
            const target = e.target as HTMLInputElement;
            const val: string = target.value;
            if (val) {
              void getUsersQuery(val);
            }
          }}
        />
      </div>
      <Divider orientation="left" orientationMargin={20}>
        Friend Requests
      </Divider>
      <div className="requests-section">
        {requestsList?.length ? (
          requestsList.map((e, i) => <UserPreview user={e} key={`req-${i}`} />)
        ) : (
          <Empty description="You are no friend requests" />
        )}
      </div>
      {Boolean(requestsMade?.length) && (
        <Divider orientation="left" orientationMargin={20}>
          Requests Made
        </Divider>
      )}
      <div className="results-section">
        {requestsMade.map((e, i) => (
          <UserPreview user={e} key={`made-${i}`} />
        ))}
      </div>
      {Boolean(queryUsers?.length) && (
        <Divider orientation="left" orientationMargin={20}>
          Search Results
        </Divider>
      )}
      <div className="results-section">
        {queryUsers.map((e, i) => (
          <UserPreview user={e} key={`search-${i}`} />
        ))}
      </div>
    </InfoModal>
  );
}

export default FindUsersModal;
