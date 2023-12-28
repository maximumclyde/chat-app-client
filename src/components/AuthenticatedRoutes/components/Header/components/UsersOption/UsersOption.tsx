import { Avatar, Card } from "antd";

import { StyledButton } from "@ui-components";
import { FriendType } from "@types";

import "./UsersOption.scss";

type OptionLabelProps = {
  user: FriendType;
  theme: "dark" | "light";
  requestHandle: (user: FriendType, type: "request" | "removeRequest") => any;
  requestsMade: string[];
};

const { Meta } = Card;

function UsersOption(props: OptionLabelProps): JSX.Element {
  const { user, theme, requestsMade, requestHandle } = props;

  const isRequested = requestsMade?.find((id) => id === user._id);

  return (
    <Meta
      className={`user-select-label ${
        theme === "dark" ? "select-label-dark" : ""
      }`}
      avatar={<Avatar src={user?.avatar} shape="circle" alt="" />}
      title={
        <div className="name-label">
          <span>{user.userName}</span>
          <StyledButton
            text={isRequested ? "Remove" : "Add"}
            type={isRequested ? "cancel" : "confirm"}
            onClick={() => {
              if (isRequested) {
                requestHandle(user, "removeRequest");
              } else {
                requestHandle(user, "request");
              }
            }}
          />
        </div>
      }
    />
  );
}

export default UsersOption;
