import Image from "next/image";
import logo from "@/public/assets/logo.png";

const Logo = () => {
  return (
    <Image
      src={logo}
      alt="Dekato Logo"
      width={90}
      height={30}
      className="text-xl font-semibold uppercase"
    />
  );
};

export default Logo;
