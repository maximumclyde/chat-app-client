import { Form, Button, message } from "antd";
import { FormFields } from "@ui-components";
import { loginFields } from "./utils";
import axios from "axios";

import { UserType } from "@types";

type LoginType = {
  user: UserType;
  token: string;
};

function LoginPage() {
  const [form] = Form.useForm();

  function onUserLogin() {
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
        await message
          .success({
            content: "Login Successful",
            key: "userLogging",
            duration: 2,
          })
          .then(() => {
            localStorage.setItem("authenticationToken", res.data.token);
            window.location.replace(
              `${window.location.protocol}//${window.location.host}/`
            );
          });
      })
      .catch((err) => {
        void message.error({
          content: "Please recheck your credentials!",
          key: "userLogging",
        });
        console.log("Error: ", err);
      });
  }

  return (
    <Form form={form}>
      <FormFields fields={loginFields()} />
      <Button onClick={onUserLogin}>Login</Button>
    </Form>
  );
}

export default LoginPage;
