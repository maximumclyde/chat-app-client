import { Spin } from "antd";

type LoadingProps = {
  loading: boolean;
  children?: React.ReactNode;
};

function Loading(props: LoadingProps) {
  return props.loading ? (
    <Spin size="large" spinning className="global-loading" />
  ) : props?.children ? (
    <>{props?.children}</>
  ) : (
    <></>
  );
}

export default Loading;
