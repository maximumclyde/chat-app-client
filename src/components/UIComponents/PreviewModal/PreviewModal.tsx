import InfoModal from "../InfoModal/InfoModal";

import "./PreviewModal.scss";

type PreviewModalProps = {
  open: boolean;
  onCancel: () => any;
  uri?: string;
};

function PreviewModal(props: PreviewModalProps) {
  const { open, onCancel, uri } = props;

  return (
    <InfoModal
      {...{
        open,
        onCancel,
        footer: null,
        className: "image-preview-modal",
      }}
    >
      <img
        {...{
          src: uri,
          width: "100%",
          height: "100%",
          alt: "No Image",
          className: "image-preview-frame",
        }}
      />
    </InfoModal>
  );
}

export default PreviewModal;
