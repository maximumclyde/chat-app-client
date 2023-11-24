import { useState, JSX } from "react";
import { Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { Field } from "@ui-components";
import "./SearchBar.module.scss";

type OptionsType = {
  label: JSX.Element;
  value: any;
  key?: any;
};

function SearchBar() {
  const [options, setOptions] = useState<OptionsType[]>([]);

  const [form] = Form.useForm();

  return (
    <Form form={form}>
      <Field
        {...{
          type: "autocomplete",
          formName: "search",
          suffix: <SearchOutlined />,
          placeholder: "Search by user id...",
          style: { maxWidth: "300px" },
          allowClear: true,
          options,
        }}
      />
    </Form>
  );
}

export default SearchBar;
