import { ReactNode } from "react";
import { Modal, ModalProps } from "antd";

import { useAppSelector } from "@hooks";
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
};

export type InfoModalProps = Partial<ModalProps> & InfoBaseProps;

function InfoModal(props: InfoModalProps) {
  const { preferences } = useAppSelector((state) => state.preferences);

  const {
    children = <></>,
    className = "",
    wrapClassName = "info-modal-wrap",
    centered = true,
    onCancel = () => {},
    onConfirm = () => {},
    closable = true,
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
        className: `${className} info-modal-container ${
          preferences?.theme === "dark" ? "info-modal-dark" : "info-modal-light"
        }`,
        wrapClassName,
        closable: !rest?.title ? false : closable,
        centered,
        footer: props?.footer
          ? props?.footer
          : props?.footer === null
          ? undefined
          : defaultFooter,
        maskClosable: true,
        onCancel,
        ...rest,
      }}
    >
      {children}
    </Modal>
  );
}

export default InfoModal;
