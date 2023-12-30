import { Avatar, Card } from "antd";

import { StyledButton } from "@ui-components";
import { FriendType } from "@types";

import "./UsersOption.scss";

type OptionLabelProps = {
  user: FriendType;
  theme: "dark" | "light";
  actionHandle: (user: FriendType, type: "confirm" | "deny") => any;
  denyActionUsers: string[];
  className?: string;
  showAction?: boolean;
  confirmText?: string;
  denyText?: string;
  additionalActions?: React.ReactNode;
};

const { Meta } = Card;

function UsersOption(props: OptionLabelProps): JSX.Element {
  const {
    user,
    theme,
    denyActionUsers,
    actionHandle,
    className = "",
    showAction = true,
    confirmText = "Add",
    denyText = "Remove",
    additionalActions = null,
  } = props;

  const isRequested = denyActionUsers?.find((id) => id === user._id);

  return (
    <Meta
      className={`user-select-label ${
        theme === "dark" ? "select-label-dark" : ""
      } ${className}`}
      avatar={<Avatar src={user?.avatar} shape="circle" alt="" />}
      title={
        <div className="name-label">
          <span>{user.userName}</span>
          <StyledButton
            text={isRequested ? denyText : confirmText}
            type={isRequested ? "cancel" : "confirm"}
            style={{ display: !showAction ? "none" : undefined }}
            onClick={() => {
              if (isRequested) {
                actionHandle(user, "deny");
              } else {
                actionHandle(user, "confirm");
              }
            }}
          />
          {additionalActions}
        </div>
      }
    />
  );
}

export default UsersOption;
