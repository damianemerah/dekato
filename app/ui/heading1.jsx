import { useSidebarStore } from "@/store/store";
import { oswald } from "@/style/font";

export default function HeaderOne({ children }) {
  const isSideBarOpen = useSidebarStore((state) => state.isSidebarOpen);

  return (
    <h1
      className={`${oswald.className} ${isSideBarOpen ? "lg:text-[2.3547880691vw]" : "lg:text-[2.9296875vw]"} text-center font-medium uppercase max-md:text-[6.25vw] md:text-[3.90625vw]`}
    >
      {children}
    </h1>
  );
}
