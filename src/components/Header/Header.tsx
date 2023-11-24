import { useMediaQuery } from "@hooks";

import { GlobalPropsType } from "@types";

function Header(props: GlobalPropsType) {
  const mobile = useMediaQuery("(max-width: 500px)");
  return <div>Header</div>;
}

export default Header;
