import { Modal } from "antd";
import { oswald } from "@/style/font";

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
      className: `${oswald.className}`,
      maskClosable: true,
      wrapClassName: "custom-modal-wrap",
      styles: {
        mask: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
        body: {
          fontFamily: oswald.style.fontFamily,
          fontSize: "16px",
          color: "#333",
        },
        title: {
          fontFamily: oswald.style.fontFamily,
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
