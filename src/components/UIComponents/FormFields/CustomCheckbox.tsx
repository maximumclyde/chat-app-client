import { Checkbox } from "antd";

const { Group } = Checkbox;

function CustomCheckbox(props: any) {
  return <Group {...props} />;
}

export default CustomCheckbox;
