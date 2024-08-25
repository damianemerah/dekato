import { roboto } from "@/font";
import "@/style/globals.css";
import Provider from "@/app/ui/Provider";
import LayoutWrapper from "../ui/layout-wrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Provider>
        <body className={`${roboto.className} antialiased`}>
          <ToastContainer position="top-center" />
          <LayoutWrapper>{children}</LayoutWrapper>
        </body>
      </Provider>
    </html>
  );
}
