import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import axios from "axios";

import { settingsFields } from "./utils";
import { useMediaQuery } from "@hooks";
import { preferenceActions, userActions } from "@store-actions";
import { GlobalStoreType, PreferenceStateType } from "@types";
import { FormFields, StyledButton, InfoModal } from "@ui-components";

import "./Settings.scss";

type SettingsProps = {
  open: boolean;
  onCancel: () => void;
};

function Settings(props: SettingsProps) {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const dispatch = useDispatch();
  const [logoutConfirm, setLogoutConfirm] = useState<boolean>(false);
  const [form] = Form.useForm();

  const mobile = useMediaQuery("(max-width: 500px)");

  const { open, onCancel } = props;

  async function onPreferenceChange(key: string, value: any) {
    await axios
      .post<PreferenceStateType>("/userPreferences", {
        [key]: value,
      })
      .then(({ data }) => {
        message.destroy("preferenceSave");
        dispatch(preferenceActions.changePreferences(data.preferences));
      })
      .catch((err) => {
        void message.error({
          content: "Something went wrong while trying to save preference!",
          key: "preferenceSave",
        });
        console.log("Error patching preferences: ", err);
      });
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
        location.replace(`${location.protocol}//${location.host}/`);
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
    <Fragment>
      <InfoModal
        {...{
          open,
          onCancel,
          title: "Settings",
          footer: (
            <StyledButton
              {...{
                text: "Logout",
                type: "cancel",
                onClick() {
                  setLogoutConfirm(true);
                },
              }}
            />
          ),
          closeIcon: !mobile ? null : <CloseOutlined />,
          className: `settings-container${
            preferences.theme === "dark" ? " settings-dark" : ""
          }`,
        }}
      >
        <Form form={form} initialValues={preferences}>
          <FormFields
            fields={settingsFields({ onPreferenceChange })}
            className="settings-fields-container"
          />
        </Form>
      </InfoModal>
      {logoutConfirm && (
        <InfoModal
          {...{
            className: `settings-container${
              preferences.theme === "dark" ? " settings-dark" : ""
            }`,
            title: "Logout Confirmation",
            open: logoutConfirm,
            onCancel() {
              setLogoutConfirm(false);
            },
            onConfirm() {
              void onLogout();
            },
          }}
        >
          Are you sure you want to logout?
        </InfoModal>
      )}
    </Fragment>
  );
}

export default Settings;
