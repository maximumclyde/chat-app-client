import { useDispatch, useSelector } from "react-redux";
import { Form, message } from "antd";
import axios from "axios";

import { settingsFields } from "../../utils";
import { preferenceActions } from "@store-actions";
import { GlobalStoreType, PreferenceStateType } from "@types";
import { FormFields } from "@ui-components";

import "./GeneralSettings.scss";

function GeneralSettings() {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const dispatch = useDispatch();
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
