import { useSelector } from "react-redux";

import { GlobalStoreType } from "@types";

import "./Header.scss";

function Header() {
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  return (
    <div
      className={`authenticated-layout-header ${
        preferences.theme === "dark" ? " header-dark" : ""
      }`}
    >
      <div className="header-left-section header-section">Profile</div>
      <div className="header-right-section header-section">Actions</div>
    </div>
  );
}

export default Header;
