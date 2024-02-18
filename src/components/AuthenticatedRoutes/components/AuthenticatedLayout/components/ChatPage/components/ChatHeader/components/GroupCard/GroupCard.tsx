import { useState, Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { Card, Avatar, Divider, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";

import { InfoModal, PreviewModal } from "@ui-components";
import { GlobalStoreType, FriendType, GroupType } from "@types";

import "./GroupCard.scss";

const { Meta } = Card;

type GroupCardProps = {
  open: boolean;
  onCancel: () => any;
  viewObject: Partial<FriendType & GroupType & { type: "GROUP" | "FRIEND" }>;
};

type KeyOptionType = "LEAVE" | "BLOCK" | "CLOSE";

function GroupCard(props: GroupCardProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );

  const [preview, setPreview] = useState("");
  const [warning, setWarning] = useState<KeyOptionType>();

  const { open, onCancel, viewObject } = props;

  const isCreator = viewObject?.createdBy?.id === authenticatedUser._id;

  const actionOptions = useMemo(() => {
    const baseOptions = [
      {
        danger: true,
        label: "Leave",
        key: "LEAVE",
      },
      {
        danger: true,
        label: "Block",
        key: "BLOCK",
      },
    ];

    if (isCreator) {
      baseOptions.splice(1, 1, {
        danger: true,
        label: "Close Group",
        key: "CLOSE",
      });
    }

    return baseOptions;
  }, [isCreator]);

  function getGroupDescription() {
    let createdByName = "unknown user";
    if (viewObject?.createdBy) {
      if (isCreator) {
        createdByName = "you";
      } else {
        createdByName = viewObject.createdBy.name;
      }
    }

    return `Created by ${createdByName} on ${dayjs(viewObject.createdAt).format(
      "MMM DD, YYYY"
    )}`;
  }

  function onOptionClick(key: KeyOptionType) {
    setWarning(key);
  }

  function onOptionConfirm(option: KeyOptionType) {}

  return (
    <Fragment>
      <InfoModal
        {...{
          open,
          onCancel,
          footer: null,
          className: `group-card-modal ${
            preferences.theme === "dark" ? "group-card-dark" : ""
          }`,
        }}
      >
        <div className="group-card-header">
          <Meta
            avatar={
              <Avatar
                src={viewObject?.avatar}
                onClick={() => {
                  setPreview(viewObject?.avatar || "");
                }}
              />
            }
            title={viewObject?.groupName}
            description={getGroupDescription()}
          />
          <div className="profile-actions">
            <Dropdown
              {...{
                placement: "bottomRight",
                overlayClassName: "profile-options",
                menu: {
                  theme: preferences.theme,
                  onClick(e) {
                    onOptionClick(e.key as KeyOptionType);
                  },
                  items: actionOptions,
                },
              }}
            >
              <MoreOutlined />
            </Dropdown>
          </div>
        </div>
      </InfoModal>
      <PreviewModal
        {...{
          open: Boolean(preview),
          uri: preview,
          onCancel() {
            setPreview("");
          },
        }}
      />
      {warning && (
        <InfoModal
          {...{
            open: true,
            title: "Confirmation",
            onCancel() {
              setWarning(undefined);
            },
            onConfirm() {
              onOptionConfirm(warning);
              setWarning(undefined);
            },
          }}
        >
          {`Are you sure you want to ${warning.toLocaleLowerCase()} '${
            viewObject?.groupName || "this group"
          }'?`}
        </InfoModal>
      )}
    </Fragment>
  );
}

export default GroupCard;
