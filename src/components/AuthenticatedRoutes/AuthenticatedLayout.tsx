import { ReactNode } from "react";
import { useMediaQuery } from "@hooks";
import WebLayout from "./Layouts/WebLayout/WebLayout";
import MobileLayout from "./Layouts/MobileLayout/MobileLayout";

import "./AuthenticatedLayout.scss";

type RoutesProps = {
  children: ReactNode;
};

const layouts = {
  mobile: MobileLayout,
  web: WebLayout,
};

function AuthenticatedLayout(props: RoutesProps) {
  const mobile = useMediaQuery("(max-width: 500px)");

  const Layout = layouts[mobile ? "mobile" : "web"];

  return <Layout>{props.children}</Layout>;
}

export default AuthenticatedLayout;
