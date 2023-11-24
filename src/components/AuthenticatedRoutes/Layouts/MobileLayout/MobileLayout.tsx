import { ReactNode } from "react";
type LayoutProps = {
  children: ReactNode;
};

function MobileLayout(props: LayoutProps) {
  return <div>{props.children}</div>;
}

export default MobileLayout;
