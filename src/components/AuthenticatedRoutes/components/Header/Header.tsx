import { useState, Fragment, useRef } from "react";
import { useSelector } from "react-redux";
import { Input, AutoComplete, message, Popover, Avatar } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import axios from "axios";

import Settings from "../../../Settings/Settings";
import { ProfileCard } from "..";
import { ProfileHandlerType } from "../ProfileCard/ProfileCard";
import { FriendType, GlobalStoreType } from "@types";

import "./Header.scss";

function Header() {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );

  const [queryUsers, setQueryUsers] = useState<FriendType[]>([]);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const profileCardRef = useRef<ProfileHandlerType>(null);

  async function getUsersQuery(query: string): Promise<void> {
    void message.loading({
      content: "Searching...",
      key: "usersQuery",
      duration: 0,
    });
    try {
      const usersRes = await axios.post<FriendType[]>("/userQuery", {
        query,
      });
      message.destroy("usersQuery");
      setQueryUsers(usersRes.data);
    } catch (err) {
      console.log("Error getting users: ", err);
      void message.error({
        content: "Something went wrong while getting users",
        key: "usersQuery",
      });
    }
  }

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
              <span className="user-name-text">
                {authenticatedUser.userName}
              </span>
            </div>
          </Popover>
          <AutoComplete
            {...{
              popupMatchSelectWidth: false,
              options: queryUsers.map((e) => ({
                label: e.userName,
                value: e.userName,
              })),
            }}
          >
            <Input.Search
              enterButton
              allowClear
              placeholder="Search for users..."
              onChange={(val) => {
                if (!val.target.value) {
                  setQueryUsers([]);
                }
              }}
              onSearch={(val) => {
                void getUsersQuery(val);
              }}
            />
          </AutoComplete>
        </div>
        <div className="header-right-section header-section">
          <SettingOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSettingsOpen(true);
            }}
          />
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
