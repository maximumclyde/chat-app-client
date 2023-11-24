import { ReactNode } from "react";
import { InfoModal } from "@ui-components";

export type WarningModalProps = {
  open: boolean;
  onDeny: () => any;
  onConfirm: () => any;
  message: ReactNode;
};

function WarningModal(props: WarningModalProps) {
  return <div></div>;
}

export default WarningModal;
