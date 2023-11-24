import { useState } from "react";
import { Layout, Menu } from "antd";
import { useMediaQuery } from "@hooks";

const { Sider } = Layout;

function ChatsSider() {
  const [collapsed, setCollapsed] = useState(false);
  const minCollapsibleWidth = useMediaQuery("(max-width: 1500px)");

  return (
    <Sider
      {...{
        width: "15dvw",
        collapsible: minCollapsibleWidth,
        collapsed,
        onCollapse(val) {
          setCollapsed(val);
        },
      }}
    >
      <Menu
        {...{
          mode: "inline",
          items: [
            {
              key: "test",
              label: "test",
              title: "test",
            },
          ],
        }}
      />
    </Sider>
  );
}

export default ChatsSider;
