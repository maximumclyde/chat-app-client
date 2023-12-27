import { FormFieldsPropsType } from "@types";

type SettingFieldProps = {
  onPreferenceChange: (key: string, value: any) => any;
};

function settingsFields(params: SettingFieldProps): FormFieldsPropsType[] {
  const { onPreferenceChange } = params;
  return [
    {
      label: "Color Theme",
      formName: "theme",
      type: "radio",
      onChange(e) {
        onPreferenceChange("theme", e.target.value);
      },
      options: [
        { label: "Light", value: "light" },
        { label: "Dark", value: "dark" },
      ],
    },
  ];
}

export default settingsFields;
