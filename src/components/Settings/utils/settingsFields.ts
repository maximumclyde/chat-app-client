import { FormFieldsPropsType } from "@types";

type SettingFieldProps = {
  onThemeChange: (e: any) => any;
};

function settingsFields(params: SettingFieldProps): FormFieldsPropsType[] {
  const { onThemeChange } = params;
  return [
    {
      label: "Color Theme",
      formName: "theme",
      type: "radio",
      onChange: onThemeChange,
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ],
    },
  ];
}

export default settingsFields;
