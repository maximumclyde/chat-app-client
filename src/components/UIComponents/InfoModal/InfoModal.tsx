import { ReactNode } from "react";
import { Modal, ModalProps } from "antd";
import { StyledButton } from "@ui-components";

import "./InfoModal.scss";

type InfoBaseProps = {
  children: ReactNode;
  open: boolean;
  onCancel: () => any;
  onConfirm?: () => any;
  className?: string;
  wrapClassName?: string;
  centered?: boolean;
  footer?: ReactNode | null;
  closeIcon?: ReactNode | null;
  bodyClass?: string;
  title?: ReactNode;
  theme?: "dark" | "light";
};

export type InfoModalProps = Partial<ModalProps> & InfoBaseProps;

function InfoModal(props: InfoModalProps) {
  const {
    children,
    className = "",
    wrapClassName = "info-modal-wrap",
    bodyClass = "info-modal-body",
    centered = true,
    closeIcon = null,
    onCancel = () => {},
    onConfirm = () => {},
    ...rest
  } = props;

  const defaultFooter = [
    <StyledButton
      {...{
        text: "Cancel",
        type: "cancel",
        onClick: onCancel,
        key: Math.random(),
      }}
    />,
    <StyledButton
      {...{
        text: "Confirm",
        type: "default",
        onClick: onConfirm,
        key: Math.random(),
      }}
    />,
  ];

  return (
    <Modal
      {...{
        className: `${className} info-modal-container`,
        wrapClassName,
        centered,
        footer: props?.footer
          ? props?.footer
          : props?.footer === null
          ? undefined
          : defaultFooter,
        closeIcon,
        maskClosable: true,
        onCancel,
        ...rest,
      }}
    >
      <div className={bodyClass}>{children}</div>
    </Modal>
  );
}

export default InfoModal;
