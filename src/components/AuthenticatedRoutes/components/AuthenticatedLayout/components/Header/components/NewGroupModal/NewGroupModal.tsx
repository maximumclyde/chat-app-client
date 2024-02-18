import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Input, Empty, message, InputRef } from "antd";

import { UserPreview } from "..";
import { InfoModal, StyledButton } from "@ui-components";
import { groupListActions, userActions } from "@store-actions";
import { GroupType, GlobalStoreType } from "@types";

import "./NewGroupModal.scss";

type NewGroupModalProps = {
  open: boolean;
  onCancel: () => any;
};

function NewGroupModal(props: NewGroupModalProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const friendList = useSelector((state: GlobalStoreType) => state.friendList);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const dispatch = useDispatch();
  const nameRef = useRef<InputRef>(null);

  const { open, onCancel } = props;

  function onFriendAction(id: string) {
    if (selectedFriends.find((el) => el === id)) {
      setSelectedFriends(selectedFriends.filter((el) => el !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  }

  async function createGroup() {
    if (!selectedFriends.length) {
      void message.warning({
        content: "Please select at least one friend in order to continue",
        key: "groupCreate",
      });
      return;
    }

    const groupName = nameRef.current?.input?.value;
    if (!groupName) {
      void message.warning({
        content: "Please enter a valid name for the group",
        key: "groupCreate",
      });
      return;
    }

    let newGroup = null;
    try {
      void message.loading({
        content: "Creating group...",
        key: "groupCreate",
        duration: 0,
      });
      newGroup = await axios
        .post<GroupType>("/groups", {
          groupName,
          groupMembers: selectedFriends,
        })
        .then(({ data }) => data);

      void message.success({
        content: "New group created!",
        key: "groupCreate",
      });

      dispatch(groupListActions.addGroup(newGroup));
      dispatch(userActions.addIdToUserProperties({ groupList: newGroup._id }));
      onCancel();
    } catch (err) {
      void message.error({
        content: "Something went wrong while creating the group",
        key: "groupCreate",
      });
    }
  }

  return (
    <InfoModal
      {...{
        open,
        onCancel,
        className: `new-group-modal ${
          preferences.theme === "dark" ? "group-modal-dark" : ""
        }`,
        title: "New Group",
        onConfirm() {
          if (!friendList.length) {
            onCancel();
          } else {
            void createGroup();
          }
        },
      }}
    >
      <div className="new-group-name">
        <Input
          {...{
            placeholder: "Enter the new group name...",
            className: preferences.theme === "dark" ? "dark-antd-input" : "",
            allowClear: true,
            ref: nameRef,
          }}
        />
      </div>
      <div className="new-group-members">
        {friendList.length ? (
          friendList.map((friend) => {
            const selected = selectedFriends.find((el) => el === friend._id);

            return (
              <UserPreview
                user={friend}
                key={friend._id}
                customAction={
                  <StyledButton
                    text={selected ? "Remove" : "Add"}
                    type={selected ? "cancel" : "confirm"}
                    onClick={() => {
                      onFriendAction(friend._id);
                    }}
                  />
                }
              />
            );
          })
        ) : (
          <Empty description="There are no friends to make a group with" />
        )}
      </div>
    </InfoModal>
  );
}

export default NewGroupModal;
