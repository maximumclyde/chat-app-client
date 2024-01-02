import { useState, useEffect, Fragment, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Popover, Avatar, Badge, notification, Tooltip } from "antd";
import axios from "axios";
import { SettingOutlined, UsergroupAddOutlined } from "@ant-design/icons";

import Settings from "../../../Settings/Settings";
import { ProfileCard } from "..";
import { RequestsListCard, UsersSearch } from "./components";
import { ProfileHandlerType } from "../ProfileCard/ProfileCard";
import { GlobalStoreType, FriendType } from "@types";
import socket from "@socket";
import { toArrayBuffer } from "@utils";
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
  const dispatch = useDispatch();

  const profileCardRef = useRef<ProfileHandlerType>(null);

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
          <Popover
            title={null}
            content={<ProfileCard ref={profileCardRef} />}
            placement="bottom"
            trigger={["click"]}
            overlayClassName={`profile-card-popover${
              preferences.theme === "dark" ? " profile-popover-dark" : ""
            }`}
            onOpenChange={(open) => {
              if (!open) {
                if (profileCardRef?.current) {
                  setTimeout(() => {
                    profileCardRef.current?.resetStates();
                  }, 300);
                }
              }
            }}
          >
            <div className="user-name-container">
              <Avatar src={authenticatedUser?.avatar} alt="" shape="circle" />
              <b className="user-name-text">{authenticatedUser.userName}</b>
            </div>
          </Popover>
          <UsersSearch />
        </div>
        <div className="header-right-section header-section">
          <Popover
            title={null}
            content={<RequestsListCard />}
            placement="bottom"
            trigger={["click"]}
          >
            <Tooltip title="Search for users">
              <Badge
                color="red"
                count={authenticatedUser?.friendRequests?.length}
                size="small"
              >
                <UsergroupAddOutlined style={{ cursor: "pointer" }} />
              </Badge>
            </Tooltip>
          </Popover>
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
      {settingsOpen && (
        <Settings
          open={settingsOpen}
          onCancel={() => {
            setSettingsOpen(false);
          }}
        />
      )}
    </Fragment>
  );
}

export default Header;
