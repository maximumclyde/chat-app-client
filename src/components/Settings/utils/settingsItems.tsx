import { MenuItemType } from "antd/es/menu/hooks/useItems";
import { UserOutlined, ControlOutlined } from "@ant-design/icons";

const settingsItems: MenuItemType[] = [
  {
    label: "Profile",
    key: "Profile",
    icon: <UserOutlined />,
  },
  {
    label: "General",
    key: "General",
    icon: <ControlOutlined />,
  },
];

export default settingsItems;
