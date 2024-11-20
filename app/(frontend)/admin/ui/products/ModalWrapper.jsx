import { memo } from "react";
const ModalWrapper = ({ openSlider, setOpenSlider, children }) => (
  <div
    className={`fixed inset-0 transition-transform duration-500 ${
      openSlider ? "translate-x-0" : "translate-x-full"
    } z-10 overflow-x-hidden`}
  >
    <div
      className="absolute inset-0 h-full w-full bg-white bg-opacity-70 blur-md"
      onClick={() => setOpenSlider(false)}
    ></div>
    <div className="absolute right-0 top-0 h-screen w-full max-w-5xl overflow-y-scroll bg-white shadow-shadowBig">
      {children}
    </div>
  </div>
);

export default memo(ModalWrapper);
