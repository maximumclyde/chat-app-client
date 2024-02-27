import { Form, message } from "antd";
import axios from "axios";

import { FormFields } from "@ui-components";
import { settingsFields } from "../../utils";
import { PreferenceStateType } from "@types";
import { preferenceActions } from "@store-actions";
import { useAppDispatch, useAppSelector } from "@hooks";

import "./GeneralSettings.scss";

function GeneralSettings() {
  const { preferences } = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

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

  return (
    <div
      className={`settings-layout-body general-settings ${
        preferences.theme === "dark" ? "general-settings-dark" : ""
      }`}
    >
      <Form form={form} initialValues={preferences}>
        <FormFields
          fields={settingsFields({ onPreferenceChange })}
          className="settings-fields-container"
        />
      </Form>
    </div>
  );
}

export default GeneralSettings;
