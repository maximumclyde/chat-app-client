import { Form, Input, TimePicker, Select, AutoComplete } from "antd";
import CustomDatePick from "./CustomDatePick";
import CustomCheckbox from "./CustomCheckbox";
import CustomRadio from "./CustomRadio";

import { FormFieldsPropsType } from "@types";
import { camelToTitle } from "@utils";

const Item = Form.Item;
const { Password } = Input;

function Field(props: FormFieldsPropsType) {
  const {
    type = "input",
    formName: name,
    style,
    className = "",
    rules = [],
    required = false,
    initialValue = undefined,
    label = undefined,
    checkboxOptions = [],
    ...fieldProps
  } = props;

  return (
    <Item
      {...{
        name,
        style,
        className: `formField-input-container ${className}`,
        initialValue,
        label,
        rules: [
          {
            required,
            message: required ? `*${camelToTitle(name)} is required!` : "",
          },
          ...rules,
        ],
      }}
    >
      {type?.toLowerCase() === "input" ? (
        <Input {...fieldProps} />
      ) : type?.toLowerCase() === "select" ? (
        <Select {...fieldProps} />
      ) : type?.toLowerCase() === "timepicker" ? (
        <TimePicker {...fieldProps} />
      ) : type?.toLowerCase() === "autocomplete" ? (
        <AutoComplete {...fieldProps} />
      ) : type?.toLowerCase() === "radio" ? (
        <CustomRadio {...fieldProps} />
      ) : type?.toLowerCase() === "datepicker" ? (
        <CustomDatePick {...fieldProps} />
      ) : type?.toLowerCase() === "password" ? (
        <Password {...fieldProps} />
      ) : type?.toLowerCase() === "checkbox" ? (
        <CustomCheckbox {...{ fieldProps, options: checkboxOptions }} />
      ) : (
        <Input {...fieldProps} />
      )}
    </Item>
  );
}

export default Field;
