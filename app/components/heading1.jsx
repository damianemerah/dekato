import { useSidebarStore } from '@/app/store/store';

export default function HeaderOne({ children }) {
  const isSideBarOpen = useSidebarStore((state) => state.isSidebarOpen);

  return (
    <h1
      className={`font-oswald ${isSideBarOpen ? 'lg:text-[2.3547880691vw]' : 'lg:text-[2.9296875vw]'} text-center font-medium uppercase max-md:text-[6.25vw] md:text-[3.90625vw]`}
    >
      {children}
    </h1>
  );
}
