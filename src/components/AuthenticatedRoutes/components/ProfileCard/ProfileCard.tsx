import { useState, forwardRef, useImperativeHandle } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Avatar, Upload, message } from "antd";
import axios from "axios";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { authenticatedUserActions } from "@store-actions";
import { GlobalStoreType, UserType } from "@types";
import { toArrayBuffer } from "@utils";

import "./ProfileCard.scss";

const { Meta } = Card;

export type ProfileHandlerType = {
  resetStates: () => void;
};

type Props = object;

function UploadButton() {
  return (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
}

const ProfileCard = forwardRef<ProfileHandlerType, Props>((_, ref) => {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );
  const [mode, setMode] = useState<"VIEW" | "EDIT">("VIEW");
  const [fileList, setFileList] = useState<any[]>([]);

  const dispatch = useDispatch();

  useImperativeHandle(
    ref,
    () => {
      return {
        resetStates() {
          setMode("VIEW");
          setFileList([]);
        },
      };
    },
    []
  );

  function getActions() {
    switch (mode) {
      case "VIEW":
        return [
          <EditOutlined
            key="edit"
            onClick={() => {
              setMode("EDIT");
            }}
          />,
        ];
      case "EDIT":
        return [
          <CloseOutlined
            key="cancel"
            onClick={() => {
              setMode("VIEW");
              setFileList([]);
            }}
          />,
          <CheckOutlined
            key="save"
            onClick={() => {
              void onChangesSave();
            }}
          />,
        ];
      default:
        return [];
    }
  }

  async function onChangesSave() {
    void message.loading({
      content: "Saving profile picture...",
      key: "profileUpdate",
      duration: 0,
    });
    const body = new FormData();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    body.append("avatar", fileList?.[0]?.originFileObj);
    await axios
      .post<UserType>("/users/avatar", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        message.destroy("profileUpdate");
        let avatar = "";
        if (data?.avatar) {
          avatar = window.URL.createObjectURL(toArrayBuffer(data?.avatar));
        }
        dispatch(
          authenticatedUserActions.setAuthenticatedUser({ ...data, avatar })
        );
      })
      .catch((err) => {
        void message.error({
          content: "Something went wrong while updating profile",
          key: "profileUpdate",
        });
        console.log("Error: ", err);
      });

    setMode("VIEW");
    setFileList([]);
  }

  return (
    <Card
      style={{
        width: 300,
      }}
      actions={getActions()}
      className={`profile-card${
        preferences.theme === "dark" ? " profile-card-dark" : ""
      }`}
    >
      <Meta
        {...{
          avatar:
            mode === "VIEW" ? (
              <Avatar
                src={authenticatedUser?.avatar}
                shape="circle"
                alt=""
                size="large"
                style={{
                  height: "100px",
                  width: "100px",
                }}
              />
            ) : (
              <Upload
                action={""}
                accept="image/jpeg, image/png"
                listType="picture-circle"
                customRequest={({ onSuccess, file }) => {
                  if (file && onSuccess) {
                    onSuccess(file);
                  }
                }}
                onChange={({ fileList: newFileList }) => {
                  setFileList(newFileList);
                }}
              >
                {fileList?.length ? null : <UploadButton />}
              </Upload>
            ),
          title: authenticatedUser.userName,
        }}
      />
    </Card>
  );
});

export default ProfileCard;
