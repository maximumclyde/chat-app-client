import { CSSProperties, ReactNode } from "react";
import { Button } from "antd";

import "./StyledButton.scss";

export type StyledButtonProps = {
  className?: string;
  style?: CSSProperties;
  icon?: ReactNode;
  text: string;
  type?: "confirm" | "cancel" | "default";
  onClick?: () => any;
};

function StyledButton(props: StyledButtonProps) {
  const {
    className = "",
    style = {},
    icon = undefined,
    text = "",
    onClick = () => {},
  } = props;

  return (
    <Button
      {...{
        className: `styled-button ${className}`,
        icon,
        style,
        type: props?.type === "default" ? "default" : "primary",
        danger: props?.type === "cancel",
        onClick,
      }}
    >
      {text}
    </Button>
  );
}

export default StyledButton;
