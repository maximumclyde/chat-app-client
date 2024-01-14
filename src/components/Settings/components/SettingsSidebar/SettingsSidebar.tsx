import { useState } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu } from "antd";

import { settingsItems } from "../../utils";
import { GlobalStoreType } from "@types";

type SettingsSidebarProps = {
  onSelect: (key: string) => any;
};

function SettingsSidebar(props: SettingsSidebarProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  const [collapsed, setCollapsed] = useState(false);

  const { theme } = preferences;
  const { onSelect } = props;

  return (
    <Layout.Sider
      {...{
        theme,
        collapsed,
        collapsible: true,
        onCollapse(c) {
          setCollapsed(c);
        },
      }}
    >
      <Menu
        {...{
          theme,
          mode: "inline",
          items: settingsItems,
          defaultSelectedKeys: ["Profile"],
          onSelect({ key }) {
            onSelect(key);
          },
        }}
      />
    </Layout.Sider>
  );
}

export default SettingsSidebar;
