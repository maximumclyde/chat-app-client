import { ReactNode, useState } from "react";
import { Layout, Menu, message } from "antd";
import axios from "axios";
import Settings from "../../../Settings/Settings";
import { InfoModal } from "@ui-components";
import { getAuthenticatedHeaderItems } from "../../utils";
import ChatsSider from "./ChatsSider/ChatsSider";

import "./WebLayout.scss";

type LayoutProps = {
  children: ReactNode;
};

const { Header, Content } = Layout;

function WebLayout(props: LayoutProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  function onLogout() {
    void message.loading({
      content: "Logging out...",
      key: "userLogoutMessage",
    });
    axios
      .post("/users/logout")
      .then(async () => {
        await message
          .success({
            content: "Logout Successful!",
            key: "userLogoutMessage",
            duration: 2,
          })
          .then(() => {
            window.localStorage.removeItem("authenticationToken");
            window.location.replace(
              `${window.location.protocol}//${window.location.host}/`
            );
          });
      })
      .catch((err) => {
        console.log("Error logging out: ", err?.message || err);
        void message.error({
          content: "Something Went Wrong!",
          key: "userLogoutMessage",
        });
      });
  }

  return (
    <Layout className="main-page-layout">
      <Header>
        <Menu
          {...{
            mode: "horizontal",
            theme: "dark",
            selectable: false,
            items: getAuthenticatedHeaderItems(),
            onClick(e) {
              if (e.key === "logout") {
                setLogoutOpen(true);
              } else if (e.key === "settings") {
                setSettingsOpen(true);
              }
            },
          }}
        />
      </Header>
      <Content>
        <ChatsSider />
        <div className="authenticated-children-container">{props.children}</div>
      </Content>
      <InfoModal
        {...{
          open: settingsOpen,
          title: "Settings",
          footer: null,
          onCancel() {
            setSettingsOpen(false);
          },
        }}
      >
        <Settings />
      </InfoModal>
      <InfoModal
        {...{
          open: logoutOpen,
          title: "Log out confirmation",
          onCancel() {
            setLogoutOpen(false);
          },
          onConfirm() {
            onLogout();
          },
        }}
      >
        <span
          style={{
            width: "100%",
            textAlign: "left",
            display: "block",
            margin: "1.5rem 0 1.5rem 0",
          }}
        >
          Are you sure you want to log out?
        </span>
      </InfoModal>
    </Layout>
  );
}

export default WebLayout;
