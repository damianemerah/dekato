import { Modal } from "antd";

const useConfirmModal = () => {
  const showConfirmModal = ({ title, content, onOk }) => {
    Modal.confirm({
      title,
      content,
      onOk,
      okText: "Yes",
      cancelText: "No",
      okButtonProps: {
        className: "!bg-primary !text-white !hover:bg-gray-800 !rounded-none",
      },
      cancelButtonProps: {
        className:
          "!border-gray-300 !text-gray-700 !hover:border-gray-400 !rounded-none",
      },
      className: `font-oswald`,
      maskClosable: true,
      wrapClassName: "custom-modal-wrap",
      styles: {
        mask: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
        body: {
          fontFamily: "var(--font-oswald)",
          fontSize: "16px",
          color: "#333",
        },
        title: {
          fontFamily: "var(--font-oswald)",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#000",
        },
      },
      icon: null,
    });
  };

  return showConfirmModal;
};

export default useConfirmModal;
