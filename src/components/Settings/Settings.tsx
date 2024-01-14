import { useState } from "react";
import { useSelector } from "react-redux";
import { Layout } from "antd";

import {
  SettingsSidebar,
  GeneralSettings,
  ProfileSettings,
} from "./components";
import { InfoModal } from "@ui-components";
import { GlobalStoreType } from "@types";

import "./Settings.scss";

type SettingsPropsType = {
  open: boolean;
  onCancel: () => any;
};

type Dictionary = {
  [key: string]: () => JSX.Element;
};

const views: Dictionary = {
  Profile: ProfileSettings,
  General: GeneralSettings,
};

function Settings(props: SettingsPropsType) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  const [activeView, setActiveView] = useState("Profile");

  const { open, onCancel } = props;

  const View = views[activeView];

  return (
    <InfoModal
      {...{
        open,
        onCancel,
        footer: null,
        className: `settings-component ${
          preferences.theme === "dark" ? "settings-component-dark" : ""
        }`,
        title: "Settings",
      }}
    >
      <Layout>
        <SettingsSidebar
          onSelect={(key: string) => {
            setActiveView(key);
          }}
        />
        <Layout.Content>
          <View />
        </Layout.Content>
      </Layout>
    </InfoModal>
  );
}

export default Settings;
