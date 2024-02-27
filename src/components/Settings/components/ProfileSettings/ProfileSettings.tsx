import { useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { Avatar, Upload, UploadFile, message } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";

import { UserType } from "@types";
import { toArrayBuffer } from "@utils";
import { userActions } from "@store-actions";
import { StyledButton } from "@ui-components";
import { useAppSelector, useAppDispatch } from "@hooks";

import "./ProfileSettings.scss";

function UploadButton() {
  return (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
}

function ProfileSettings() {
  const { preferences } = useAppSelector((state) => state.preferences);
  const authenticatedUser = useAppSelector((state) => state.authenticatedUser);
  
  const [changeAvatarMode, setChangeAvatarMode] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const dispatch = useAppDispatch();

  async function saveAvatarHandler() {
    const file = fileList?.[0]?.originFileObj;
    if (!file) {
      void message.warning({
        content: "Please upload a picture",
        key: "missingPicture",
      });
      return;
    }

    const body = new FormData();
    body.append("avatar", file);
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
        dispatch(userActions.updateUserProperties({ avatar }));
      })
      .catch((err) => {
        void message.error({
          content: "Something went wrong while updating profile",
          key: "profileUpdate",
        });
        console.log("Error: ", err);
      });

    setChangeAvatarMode(false);
    setFileList([]);
  }

  async function onLogout() {
    void message.loading({
      content: "Logging out...",
      key: "logout",
      duration: 0,
    });

    await axios
      .post("/users/logout")
      .then(async () => {
        return await message.success({
          content: "Logout successful",
          key: "logout",
          duration: 2,
        });
      })
      .then(() => {
        dispatch(userActions.userLogout());
      })
      .catch((err) => {
        void message.error({
          content: "Something went wrong while trying to log out",
          key: "logout",
        });
        console.log("Error logging out: ", err);
      });
  }

  return (
    <div
      className={`settings-layout-body profile-settings ${
        preferences.theme === "dark" ? "profile-settings-dark" : ""
      }`}
    >
      <div className="profile-info-section">
        <div className="general-info-section">
          {changeAvatarMode ? (
            <Upload
              action={""}
              accept="image/jpeg, image/png"
              listType="picture-circle"
              maxCount={1}
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
          ) : (
            <Avatar
              src={authenticatedUser?.avatar}
              alt=""
              icon={<UserOutlined />}
              size="large"
            />
          )}
          <div className="name-section">
            <span className="user-name">{authenticatedUser.userName}</span>
            <span className="member-since">
              Member since{" "}
              {dayjs(authenticatedUser.createdAt).format("MMM DD, YYYY")}
            </span>
          </div>
        </div>
        {changeAvatarMode ? (
          <div className="save-profile-buttons">
            <StyledButton
              text={"Cancel"}
              type="cancel"
              onClick={() => {
                setFileList([]);
                setChangeAvatarMode(false);
              }}
            />
            <StyledButton
              text={"Save"}
              type="default"
              onClick={() => {
                void saveAvatarHandler();
              }}
            />
          </div>
        ) : (
          <StyledButton
            text={"Change Avatar"}
            type="default"
            onClick={() => {
              setFileList([]);
              setChangeAvatarMode(true);
            }}
          />
        )}
      </div>
      <div className="info-edit-section"></div>
    </div>
  );
}

export default ProfileSettings;
