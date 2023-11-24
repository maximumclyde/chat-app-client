import Field from "./Field";
import "./FormFields.scss";

import { FormFieldsPropsType } from "@types";

type FormFieldsType = {
  fields: FormFieldsPropsType[];
  className?: string;
};

function FormFields(props: FormFieldsType) {
  return (
    <div className={`form-fields-container ${props?.className || ""}`}>
      {props.fields.map((fieldProps) => (
        <Field {...fieldProps} key={Math.random()} />
      ))}
    </div>
  );
}

export default FormFields;
