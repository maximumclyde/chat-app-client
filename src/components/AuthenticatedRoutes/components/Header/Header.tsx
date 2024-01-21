import { useState, useEffect, Fragment, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Badge, notification, Tooltip } from "antd";
import axios from "axios";
import {
  GlobalOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import socket from "@socket";
import { toArrayBuffer } from "@utils";
import Settings from "../../../Settings/Settings";
import { GlobalStoreType, FriendType } from "@types";
import { FindUsersModal, NewGroupModal } from "./components";
import { userActions, friendListActions } from "@store-actions";

import "./Header.scss";

type RequestBodyType = {
  _id: string;
};

type SocketRequestType = {
  request: string;
  body: RequestBodyType;
};

function Header() {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [usersModalOpen, setUsersModalOpen] = useState<boolean>(false);
  const [newGroupOpen, setNewGroupOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleSocketHeaderRequests = useCallback(
    (event: MessageEvent<string>) => {
      const { request, body } = JSON.parse(event.data) as SocketRequestType;

      if (request === "friend-request") {
        dispatch(
          userActions.addIdToUserProperties({ friendRequests: body._id })
        );
      } else if (request === "request-removed") {
        dispatch(
          userActions.removeIdFromUserProperties({ friendRequests: body._id })
        );
      } else if (request === "request-accept") {
        dispatch(
          userActions.removeIdFromUserProperties({ requestsMade: body._id })
        );
        dispatch(userActions.addIdToUserProperties({ friendList: body._id }));

        axios
          .get<FriendType>(`/users/${body._id}`)
          .then((res) => {
            let avatar = undefined;
            if (res.data?.avatar) {
              avatar = URL.createObjectURL(toArrayBuffer(res.data.avatar));
            }
            dispatch(friendListActions.addFriend({ ...res.data, avatar }));
            notification.success({
              message: (
                <span>
                  <b>{res.data.userName}&nbsp;</b>has accepted your request!
                </span>
              ),
              duration: 3,
              placement: "bottomLeft",
            });
          })
          .catch((err) => {
            console.log("Error getting friend: ", err);
          });
      } else if (request === "request-decline") {
        dispatch(
          userActions.removeIdFromUserProperties({ requestsMade: body._id })
        );
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.addEventListener("message", handleSocketHeaderRequests);
    }
    return () => {
      socket.removeEventListener("message", handleSocketHeaderRequests);
    };
  }, [handleSocketHeaderRequests]);

  return (
    <Fragment>
      <div
        className={`authenticated-layout-header ${
          preferences.theme === "dark" ? " header-dark" : ""
        }`}
      >
        <div className="header-left-section header-section">
          <div className="user-name-container">
            <Avatar src={authenticatedUser?.avatar} alt="" shape="circle" />
            <b className="user-name-text">{authenticatedUser.userName}</b>
          </div>
        </div>
        <div className="header-right-section header-section">
          <Tooltip title="New Group">
            <UsergroupAddOutlined
              style={{ cursor: "pointer" }}
              onClick={() => {
                setNewGroupOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Search for users">
            <Badge
              color="red"
              count={authenticatedUser?.friendRequests?.length}
              size="small"
            >
              <GlobalOutlined
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setUsersModalOpen(true);
                }}
              />
            </Badge>
          </Tooltip>
          <Tooltip title="Settings">
            <SettingOutlined
              style={{ cursor: "pointer" }}
              onClick={() => {
                setSettingsOpen(true);
              }}
            />
          </Tooltip>
        </div>
      </div>
      {usersModalOpen && (
        <FindUsersModal
          {...{
            open: usersModalOpen,
            onCancel() {
              setUsersModalOpen(false);
            },
          }}
        />
      )}
      {settingsOpen && (
        <Settings
          open={settingsOpen}
          onCancel={() => {
            setSettingsOpen(false);
          }}
        />
      )}
      {newGroupOpen && (
        <NewGroupModal
          open={newGroupOpen}
          onCancel={() => {
            setNewGroupOpen(false);
          }}
        />
      )}
    </Fragment>
  );
}

export default Header;
