import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import { Avatar, Badge, Tooltip } from "antd";
import {
  GlobalOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

import socket from "@socket";
import { requestsSocketHandler } from "@utils";
import Settings from "../../../../../Settings/Settings";
import { GlobalStoreType } from "@types";
import { FindUsersModal, NewGroupModal } from "./components";

import "./Header.scss";

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

  useEffect(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.addEventListener("message", requestsSocketHandler);
    }
    return () => {
      socket.removeEventListener("message", requestsSocketHandler);
    };
  }, []);

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
