import { FormInstance } from "antd";
import { ResponseErrors } from "../SignUpPage";
import { FormFieldsPropsType } from "@types";

type SignUpFieldsParams = {
  form: FormInstance;
  responseErrors: ResponseErrors;
};

const PASSWORD_RG =
  /^(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=\D*\d)([^_+!\-@#]*[_+!\-@#]).*$/;

function signUpFields(params: SignUpFieldsParams): FormFieldsPropsType[] {
  const {
    form,
    responseErrors: { userAlias, email },
  } = params;

  return [
    {
      label: "User Name",
      formName: "userName",
      style: { width: 300 },
      required: true,
      rules: [
        {
          async validator(_: any, value: string) {
            if (userAlias.includes(value)) {
              return Promise.reject("*User name is already in use!");
            } else {
              return Promise.resolve();
            }
          },
        },
      ],
    },
    {
      label: "Email",
      formName: "userEmail",
      style: { width: 300 },
      required: true,
      rules: [
        { type: "email" },
        {
          async validator(_: any, value: string) {
            if (email.includes(value)) {
              return Promise.reject("*Email is already in use!");
            } else {
              return Promise.resolve();
            }
          },
        },
      ] as any[],
    },
    {
      label: "Password",
      type: "password",
      formName: "userPassword",
      style: { width: 300 },
      required: true,
      rules: [
        {
          pattern: PASSWORD_RG,
          message:
            "*Password must contain a capital, lower case characters, a digit and a special character",
        },
      ],
    },
    {
      label: "Verify Password",
      type: "password",
      formName: "verifyPassword",
      validateTrigger: "password",
      style: { width: 300 },
      required: true,
      dependencies: ["password"],
      rules: [
        {
          async validator(_: any, value: string) {
            const pass = form.getFieldValue("userPassword");
            if (!value) {
              return Promise.resolve("");
            }
            if (pass === value) {
              return Promise.resolve("");
            } else {
              return Promise.reject("*Field is different from input password");
            }
          },
        },
      ],
    },
  ];
}

export default signUpFields;
