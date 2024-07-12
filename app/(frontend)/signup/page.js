"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import fbIcon from "@/public/assets/icons/fb-icon.svg";
import google from "@/public/assets/icons/google.svg";
import viewIcon from "@/public/assets/icons/view.svg";
import viewOff from "@/public/assets/icons/view-off.svg";
import toast from "react-hot-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [viewPassword, setViewPassword] = useState(false);

  const router = useRouter();
  useEffect(() => {
    document.body.classList.add("bg-gray-100");
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(result, "result🚀🚀🚀");

    if (result.ok) {
      router.push("/signin");
      toast.success(
        "Sign up successful! Please check your email to verify your account."
      );
      const data = await result.json();
      console.log(data, "data🚀🚀🚀");
    }
  };

  return (
    <div className="flex_center my-16 mx-auto max-w-2xl px-20 py-10 border border-gray-300 rounded-lg shadow-md bg-white">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="flex flex-col mt-4 w-full gap-3">
        <div className="flex-1 item__center shrink-0 grow-0 basis-1/2 gap-4">
          <div className="flex flex-col">
            <label className="block mb-1" htmlFor="firstname">
              Firstname
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="p-2.5 bg-gray-100 rounded-md w-full text-black outline-none"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <label className="block mb-1" htmlFor="lastname">
              Lastname
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="p-2.5 bg-gray-100 rounded-md w-full text-black outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block mb-1" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-2.5 bg-gray-100 rounded-md w-full text-black outline-none"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="password">
            Password
          </label>
          <div className="flex justify-between items-center bg-gray-100 rounded-md">
            <input
              type={viewPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-2.5 bg-gray-100 rounded-md w-full text-black outline-none"
            />
            <Image
              className="pr-2.5 cursor-pointer"
              src={viewPassword ? viewIcon : viewOff}
              width={30}
              height={30}
              alt="View password"
              onClick={() => setViewPassword(!viewPassword)}
            />
          </div>
        </div>

        <div>
          <label className="block mb-1" htmlFor="passwordConfirm">
            Password Confirm
          </label>
          <div className="flex justify-between items-center bg-gray-100 rounded-md">
            <input
              type={viewPassword ? "text" : "password"}
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="p-2.5 bg-gray-100 rounded-md w-full text-black outline-none"
            />
            <Image
              className="pr-2.5 cursor-pointer"
              src={viewPassword ? viewIcon : viewOff}
              width={30}
              height={30}
              alt="View password"
              onClick={() => setViewPassword(!viewPassword)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-slate-900 text-white py-2.5 px-16 rounded-md mx-auto mt-4"
        >
          Sign Up
        </button>
      </form>
      <p
        className="
       text-gray-500 text-center mt-4 flex__center gap-4
      "
      >
        <span className="w-1/2 bg-gray-300 h-px"></span>
        <label className="text-nowrap">Or continue with</label>
        <span className="w-1/2 bg-gray-300 h-px"></span>
      </p>
      <div className="flex__center gap-5 mt-4">
        <Image src={google} width={52} height={52} alt="Google signin" />
        <Image src={fbIcon} width={48} height={48} alt="Facebook signin" />
      </div>
    </div>
  );
};

export default SignUp;
