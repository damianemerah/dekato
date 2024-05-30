import * as React from "react";
import Image from "next/image";
import logoBig from "@/public/assets/icons/logo-lg.png";
import security from "@/public/assets/icons/security.svg";
import support_agent from "@/public/assets/icons/support_agent.svg";
import local_shipping from "@/public/assets/icons/local_shipping.svg";
import quality from "@/public/assets/icons/quality.svg";
import cardFrame from "@/public/assets/frame77.png";
import call from "@/public/assets/icons/call.svg";
import facebook from "@/public/assets/icons/facebook.svg";
import instagram from "@/public/assets/icons/instagram.svg";
import whatsapp from "@/public/assets/icons/whatsapp.svg";

export default function Footer() {
  return (
    <div className="flex flex-col mt-10">
      <div className="flex justify-center items-center px-16 py-16 w-full bg-neutral-300 max-md:px-5 max-md:max-w-full">
        <div className="flex flex-col mb-11 w-full max-w-[1228px] max-md:mb-10 max-md:max-w-full">
          <h2 className="self-center text-3xl font-semibold tracking-normal text-black">
            Why Shop With Us
          </h2>
          <div className="mt-16 max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow justify-center px-10 text-lg font-semibold tracking-tight text-center text-black max-md:px-5 max-md:mt-10">
                  <Image
                    alt="footer img"
                    width={48}
                    heigth={48}
                    loading="lazy"
                    src={quality}
                    className="self-center"
                  />
                  <p className="mt-12 max-md:mt-10">Quality Assurance</p>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow justify-center px-14 text-lg font-semibold tracking-tight text-center text-black max-md:px-5 max-md:mt-10">
                  <Image
                    alt="footer img"
                    width={48}
                    heigth={48}
                    loading="lazy"
                    src={local_shipping}
                    className="self-center"
                  />
                  <p className="mt-12 max-md:mt-10">Free Shipping</p>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow justify-center px-12 text-lg font-semibold tracking-tight text-center text-black max-md:px-5 max-md:mt-10">
                  <Image
                    alt="footer img"
                    width={48}
                    heigth={48}
                    loading="lazy"
                    src={security}
                    className="self-center"
                  />
                  <p className="mt-12 max-md:mt-10">Secure Payment</p>
                </div>
              </div>
              <div className="flex flex-col ml-5 w-3/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow justify-center px-10 text-lg font-semibold tracking-tight text-center text-black max-md:px-5 max-md:mt-10">
                  <Image
                    alt="footer img"
                    width={48}
                    heigth={48}
                    loading="lazy"
                    src={support_agent}
                    className="self-center"
                  />
                  <p className="mt-12 max-md:mt-10">Customer Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center px-16 py-16 w-full bg-slate-800 max-md:px-5 max-md:max-w-full">
        <div className="flex justify-center items-center px-16 w-full max-md:px-5 max-md:max-w-full">
          <div className="flex flex-col grow mt-2.5 max-md:mt-10">
            <Image
              alt="footer logo"
              width="100%"
              heigth="100%"
              loading="lazy"
              src={logoBig}
            />
            <Image
              alt="Bank cards"
              width="100%"
              heigth="100%"
              loading="lazy"
              src={cardFrame}
            />
          </div>
          <div className="flex flex-col ml-5 w-[71%] max-md:ml-0 max-md:w-full">
            <div className="max-md:mt-10 max-md:max-w-full">
              <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                <div className="flex flex-col w-[21%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col grow text-sm tracking-tight text-white max-md:mt-10">
                    <div>About Us</div>
                    <div className="mt-4">FAQs</div>
                    <div className="mt-4">Size Guild</div>
                    <div className="mt-4">Customer feedback</div>
                    <div className="mt-4">Customer care</div>
                  </div>
                </div>
                <div className="flex flex-col ml-5 w-[27%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col grow text-sm tracking-tight text-white max-md:mt-10">
                    <div>Pay on delivery notice</div>
                    <div className="mt-4">Delivery Information</div>
                    <div className="mt-4">Refund and Return policy</div>
                    <div className="mt-4">Terms & Conditions</div>
                    <div className="mt-4">Privacy Policy</div>
                  </div>
                </div>
                <div className="flex flex-col ml-5 w-[35%] max-md:ml-0 max-md:w-full">
                  <div className="flex flex-col text-sm tracking-tight text-white max-md:mt-10">
                    <div className="text-white">
                      30A Oseni Street, Anthony Village
                      <br />
                      Oposite GTB, Lagos
                    </div>
                    <div className="mt-1.5 text-xs text-neutral-300">
                      Monday - Saturday from 8am - 8pm
                    </div>
                    <div className="flex gap-2 mt-4 whitespace-nowrap">
                      <Image
                        alt="footer img"
                        width="100%"
                        heigth="100%"
                        loading="lazy"
                        src={call}
                        className="shrink-0 my-auto w-3 aspect-square"
                      />
                      <div>+2348023024687</div>
                    </div>
                    <div className="flex gap-2 mt-1.5 whitespace-nowrap">
                      <Image
                        alt="footer img"
                        width="100%"
                        heigth="100%"
                        loading="lazy"
                        src={call}
                        className="shrink-0 my-auto w-3 aspect-square"
                      />
                      <div>+2348064737122</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 max-md:mt-10">
                  <Image
                    alt="facebook icon"
                    width="100%"
                    heigth="100%"
                    loading="lazy"
                    src={facebook}
                    className="shrink-0 self-start"
                  />
                  <Image
                    alt="Instagram icon"
                    width="100%"
                    heigth="100%"
                    loading="lazy"
                    src={instagram}
                    className="shrink-0 self-start"
                  />
                  <Image
                    alt="whatsapp icon"
                    width="100%"
                    heigth="100%"
                    loading="lazy"
                    src={whatsapp}
                    className="shrink-0 self-start"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0 mt-6 max-w-full h-0.5 border border-solid bg-slate-900 border-neutral-400 w-[1087px] max-md:mt-10" />
        <div className="mt-8 text-sm text-center text-white">
          © 2023 business.ng | All Rights Reserved
        </div>
      </div>
    </div>
  );
}
