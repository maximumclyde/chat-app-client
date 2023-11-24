type LoadingProps = {
  loading: boolean;
  children?: React.ReactNode;
};

function Loading(props: LoadingProps) {
  return props.loading ? (
    <div>Loading...</div>
  ) : props?.children ? (
    <>{props?.children}</>
  ) : (
    <></>
  );
}

export default Loading;
