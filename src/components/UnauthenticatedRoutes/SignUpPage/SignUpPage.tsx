import { useState } from "react";
import { Form, Button, message } from "antd";
import { FormFields } from "@ui-components";
import axios from "axios";
import { signUpFields } from "./utils";

import { UserType, PreferenceStateType } from "@types";

type SignUpType = {
  user: UserType;
  token: string;
  userPreferences: PreferenceStateType;
};

export type ResponseErrors = {
  email: string[];
  userAlias: string[];
};

function SignUpPage() {
  const [responseErrors, setResponseErrors] = useState<ResponseErrors>({
    email: [],
    userAlias: [],
  });
  const [form] = Form.useForm();

  function onUserSignUp() {
    void message.loading({
      content: "Loading...",
      key: "userSignUp",
    });

    const fields = form.getFieldsValue();
    delete fields["verifyPassword"];

    axios
      .post<SignUpType>("/users", {
        ...fields,
      })
      .then(async (res) => {
        window.localStorage.setItem("authenticationToken", res.data.token);

        return await message.success({
          content: "Sign Up Successful!",
          key: "userSignUp",
          duration: 2,
        });
      })
      .then(() => {
        window.location.replace(
          `${window.location.protocol}//${window.location.host}/`
        );
      })
      .catch((err: any) => {
        console.log("Error creating user: ", err);
        const errorFields = { email: [""], userAlias: [""] };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if (err?.response?.data?.keyPattern?.userEmail) {
          void message.warning({
            content: "Email already in use!",
            key: "userSignUp",
          });
          errorFields.email = [
            ...responseErrors.email,
            form.getFieldValue("userEmail"),
          ];
          errorFields.userAlias = [...responseErrors.userAlias];
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        } else if (err?.response?.data?.keyPattern?.userName) {
          void message.warning({
            content: "User name is already in use!",
            key: "userSignUp",
          });
          errorFields.userAlias = [
            ...responseErrors.userAlias,
            form.getFieldValue("userName"),
          ];
          errorFields.email = [...responseErrors.email];
        } else {
          void message.error({
            content: "Could not sign up!",
            key: "userSignUp",
          });
        }
        setResponseErrors(errorFields);
      });
  }

  return (
    <Form form={form}>
      <FormFields fields={signUpFields({ form, responseErrors })} />
      <Button
        onClick={() => {
          void form.validateFields().then(() => onUserSignUp());
        }}
      >
        Sign Up
      </Button>
    </Form>
  );
}

export default SignUpPage;
