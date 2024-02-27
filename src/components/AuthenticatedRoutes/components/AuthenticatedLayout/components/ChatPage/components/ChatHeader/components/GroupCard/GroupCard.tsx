import { useState, Fragment, useMemo, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Card, Avatar, Divider, Dropdown, message, Tag } from "antd";
import { MoreOutlined } from "@ant-design/icons";

import { toArrayBuffer } from "@utils";
import { useAppSelector } from "@hooks";
import { FriendType, GroupType } from "@types";
import { InfoModal, PreviewModal } from "@ui-components";

import "./GroupCard.scss";

const { Meta } = Card;

type GroupCardProps = {
  open: boolean;
  onCancel: () => any;
  viewObject: Partial<FriendType & GroupType & { type: "GROUP" | "FRIEND" }>;
};

type KeyOptionType = "LEAVE" | "BLOCK" | "CLOSE";

type GroupMemberType = {
  userName: string;
  _id: string;
  avatar?: string;
  isAdmin?: boolean;
  isCreator?: boolean;
};

function GroupCard(props: GroupCardProps) {
  const { preferences } = useAppSelector((state) => state.preferences);
  const authenticatedUser = useAppSelector((state) => state.authenticatedUser);
  const friendList = useAppSelector((state) => state.friendList);

  const [preview, setPreview] = useState("");
  const [warning, setWarning] = useState<KeyOptionType>();
  const [membersObjects, setMembersObjects] = useState<GroupMemberType[]>([]);

  const { open, onCancel, viewObject } = props;

  useEffect(() => {
    if (viewObject?.type !== "GROUP") {
      return;
    }
    const membersToGet = [] as string[];
    const friendMembers = [] as FriendType[];

    for (const member of viewObject?.groupMembers || []) {
      if (member === authenticatedUser._id) {
        continue;
      }

      if (!authenticatedUser.friendList.includes(member)) {
        membersToGet.push(member);
      } else {
        const friendObject = friendList.find(({ _id }) => _id === member);
        if (friendObject) {
          friendMembers.push(friendObject);
        }
      }
    }

    axios
      .post<FriendType[]>("/users/batchGetUsers", { idList: membersToGet })
      .then(({ data }) => {
        const allUsersData = data
          .concat(friendMembers)
          .map(({ _id, userName, avatar }) => {
            let avatarURI = avatar;
            if (avatar && membersToGet.includes(_id)) {
              avatarURI = URL.createObjectURL(toArrayBuffer(avatar));
            }

            return {
              _id,
              userName,
              avatar: avatarURI,
              isAdmin: Boolean(viewObject?.groupAdmins?.includes(_id)),
              isCreator: Boolean(viewObject?.createdBy?.id === _id),
            };
          })
          .sort((a, b) => {
            if (a.isCreator) {
              return -1;
            }

            if ((a.isAdmin && b.isAdmin) || (!a.isAdmin && !b.isAdmin)) {
              return a.userName.localeCompare(b.userName);
            } else {
              if (a.isAdmin) {
                return -1;
              } else {
                return 1;
              }
            }
          });

        setMembersObjects(allUsersData);
      })
      .catch((err) => {
        void message.error({
          content: "Something went wrong while getting group members",
          key: "getMembersError",
        });
        console.log("Error getting members: ", err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    () => {
      membersObjects.forEach((member) => {
        if (!friendList.find(({ _id }) => member._id === _id)) {
          if (member.avatar) {
            URL.revokeObjectURL(member.avatar);
          }
        }
      });
    };
  }, [friendList, membersObjects]);

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

    return (
      <span>
        Created by&nbsp;<b>{createdByName}</b>&nbsp;on{" "}
        {dayjs(viewObject.createdAt).format("MMM DD, YYYY")}
      </span>
    );
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
                trigger: ["click"],
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
        <div className="group-members">
          <Divider orientation="left" orientationMargin={20}>
            Group Members
          </Divider>
        </div>
        {membersObjects.map((member) => {
          return (
            <Meta
              key={member._id}
              className="member"
              title={
                <div className="member-name-container">
                  <span>{member.userName}</span>
                  <div>
                    {(member.isAdmin || member.isCreator) && (
                      <Tag
                        color={
                          member.isCreator
                            ? "cyan"
                            : member.isAdmin
                            ? "volcano"
                            : ""
                        }
                      >
                        {member.isCreator
                          ? "Creator"
                          : member.isAdmin
                          ? "Admin"
                          : ""}
                      </Tag>
                    )}
                    <MoreOutlined />
                  </div>
                </div>
              }
              avatar={
                <Avatar
                  src={member?.avatar}
                  onClick={() => {
                    setPreview(member?.avatar || "");
                  }}
                />
              }
            />
          );
        })}
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
