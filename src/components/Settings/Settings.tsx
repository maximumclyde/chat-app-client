import { useDispatch } from "react-redux";
import { Form, RadioChangeEvent } from "antd";
import { useMediaQuery } from "@hooks";
import { preferenceActions } from "../../store/preferences";
import { settingsFields } from "./utils";
import { FormFields } from "@ui-components";

import "./Settings.scss";

import { GlobalPropsType } from "@types";

function Settings(props: GlobalPropsType) {
  const { preferences } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const mobile = useMediaQuery("(max-width: 500px)");

  function onThemeChange(e: RadioChangeEvent) {
    const val = e.target.value;
    dispatch(preferenceActions.changePreference({ colorTheme: val }));
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
