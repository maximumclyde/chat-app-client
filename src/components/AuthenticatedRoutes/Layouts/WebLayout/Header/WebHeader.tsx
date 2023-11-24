import { JSX, Fragment } from "react";

import styles from "./WebHeader.module.scss";

type WebHeaderProps = {
  leftItems: JSX.Element[];
  rightItems: JSX.Element[];
};

function WebHeader({ leftItems = [], rightItems = [] }: WebHeaderProps) {
  return (
    <div className={styles["web-header-container"]}>
      <Fragment>{leftItems}</Fragment>
      <Fragment>{rightItems}</Fragment>
    </div>
  );
}

export default WebHeader;
