import Header from "@/app/ui/header";
import LayoutWrapper from "@/app/ui/layout-wrapper";

export default function RootLayout({ children }) {
  return (
    <div>
      <Header />
      <LayoutWrapper>{children}</LayoutWrapper>
    </div>
  );
}
