import { FormFieldsPropsType } from "@types";

function loginFields(): FormFieldsPropsType[] {
  return [
    {
      label: "Email",
      formName: "email",
      placeholder: "Email",
      style: { width: 250 },
      required: true,
      rules: [
        {
          type: "email",
          message: "Input is not a valid email",
        },
      ] as any[],
    },
    {
      label: "Password",
      formName: "password",
      placeholder: "Password",
      type: "password",
      style: { width: 250 },
      required: true,
    },
  ];
}

export default loginFields;
