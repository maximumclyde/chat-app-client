import { Form, Button, message } from "antd";
import { FormFields } from "@ui-components";
import { loginFields } from "./utils";
import axios from "axios";

import { UserType, PreferenceStateType } from "@types";

type LoginType = {
  user: UserType;
  token: string;
  userPreferences: PreferenceStateType;
};

function LoginPage() {
  const [form] = Form.useForm();

  function onUserLogin() {
    form
      .validateFields()
      .then(() => {
        void message.loading({
          content: "Logging In...",
          key: "userLogging",
        });

        axios
          .post<LoginType>("/users/login", {
            email: form.getFieldValue("email"),
            password: form.getFieldValue("password"),
          })
          .then(async (res) => {
            localStorage.setItem("authenticationToken", res.data.token);

            return await message.success({
              content: "Login Successful",
              key: "userLogging",
              duration: 2,
            });
          })
          .then(() => {
            location.replace(`${location.protocol}//${location.host}/`);
          })
          .catch((err) => {
            void message.error({
              content: "Please recheck your credentials!",
              key: "userLogging",
            });
            console.log("Error: ", err);
          });
      })
      .catch(() => {});
  }

  return (
    <Form form={form} onKeyDown={({key}) => {
      if(key === "Enter") {
        onUserLogin()
      }
    }}>
      <FormFields fields={loginFields()} />
      <Button onClick={onUserLogin}>Login</Button>
    </Form>
  );
}

export default LoginPage;
