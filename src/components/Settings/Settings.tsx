import { useDispatch, useSelector } from "react-redux";
import { Form, RadioChangeEvent } from "antd";
import { useMediaQuery } from "@hooks";

import { preferenceActions } from "@store-actions";
import { settingsFields } from "./utils";
import { FormFields } from "@ui-components";
import { GlobalStoreType } from "@types";

import "./Settings.scss";

function Settings() {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const mobile = useMediaQuery("(max-width: 500px)");

  function onThemeChange(e: RadioChangeEvent) {
    const val = e.target.value;
    dispatch(preferenceActions.changePreferences({ theme: val }));
  }

  return (
    <div
      className={`settings-main ${
        mobile ? "settings-mobile" : "settings-contained"
      }`}
    >
      <Form form={form} initialValues={preferences}>
        <FormFields
          fields={settingsFields({ onThemeChange })}
          className="settings-fields-container"
        />
      </Form>
    </div>
  );
}

export default Settings;
