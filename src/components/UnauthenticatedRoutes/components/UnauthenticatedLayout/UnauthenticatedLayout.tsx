import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { getUnauthenticatedItems } from "./getUnauthenticatedItems";

import "../../../AuthenticatedRoutes/components/AuthenticatedLayout/AuthenticatedLayout.scss";

type UnauthenticatedLayoutProps = {
  children: ReactNode;
};

const { Header, Content } = Layout;

function UnauthenticatedLayout(props: UnauthenticatedLayoutProps) {
  const navigate = useNavigate();

  return (
    <Layout className="main-page-layout">
      <Header>
        <Menu
          onClick={(e) => {
            navigate(`/${e.key}`);
          }}
          defaultSelectedKeys={[""]}
          theme="dark"
          mode="horizontal"
          items={getUnauthenticatedItems()}
        />
      </Header>
      <Content>
        <div className="authenticated-children-container">{props.children}</div>
      </Content>
    </Layout>
  );
}

export default UnauthenticatedLayout;
