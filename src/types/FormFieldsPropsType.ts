import { CSSProperties } from "react";
import { Dayjs } from "dayjs";

import {
  InputProps,
  SelectProps,
  AutoCompleteProps,
  CheckboxProps,
  DatePickerProps,
  TimePickerProps,
  RadioProps,
  FormItemProps,
} from "antd";

import { PickerProps } from "antd/es/calendar/generateCalendar";

type AntdPropsCombinations = InputProps &
  SelectProps &
  AutoCompleteProps &
  CheckboxProps &
  DatePickerProps &
  PickerProps<Dayjs> &
  TimePickerProps &
  RadioProps &
  FormItemProps;

type FieldWrapperType = {
  type?: string;
  formName: string;
  rules?: any[];
  style?: CSSProperties;
  className?: string;
  required?: boolean;
  initialValue?: any;
  label?: string;
  status?: "" | "error" | "warning" | undefined;
  hashId?: string | undefined;
  popupClassName?: string | undefined;
  rootClassName?: string | undefined;
  checkboxOptions?: any[];
};

type FormFieldsPropsType = Partial<AntdPropsCombinations> & FieldWrapperType;

export default FormFieldsPropsType;
