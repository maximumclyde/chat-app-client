import { useState, Fragment, useRef } from "react";
import { useSelector } from "react-redux";
import { Popover, Avatar } from "antd";
import { SettingOutlined } from "@ant-design/icons";

import Settings from "../../../Settings/Settings";
import { ProfileCard } from "..";
import { UsersSearch } from "./components";
import { ProfileHandlerType } from "../ProfileCard/ProfileCard";
import { GlobalStoreType } from "@types";

import "./Header.scss";

function Header() {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );

  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);

  const profileCardRef = useRef<ProfileHandlerType>(null);

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
          <UsersSearch />
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
