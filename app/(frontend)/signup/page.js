"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FbIcon from "@/public/assets/icons/fb-icon.svg";
import GoogleIcon from "@/public/assets/icons/google.svg";
import ViewIcon from "@/public/assets/icons/view.svg";
import ViewOff from "@/public/assets/icons/view-off.svg";
import { toast } from "react-toastify";

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
        "Sign up successful! Please check your email to verify your account.",
      );
      const data = await result.json();
      console.log(data, "data🚀🚀🚀");
    }
  };

  return (
    <div className="flex_center mx-auto my-16 max-w-2xl rounded-lg border border-gray-300 bg-white px-20 py-10 shadow-md">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="mt-4 flex w-full flex-col gap-3">
        <div className="item__center flex-1 shrink-0 grow-0 basis-1/2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 block" htmlFor="firstname">
              Firstname
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
            />
          </div>
          <div className="flex flex-1 flex-col">
            <label className="mb-1 block" htmlFor="lastname">
              Lastname
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block" htmlFor="password">
            Password
          </label>
          <div className="flex items-center justify-between rounded-md bg-gray-100">
            <input
              type={viewPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
            />
            {viewPassword ? (
              <ViewIcon
                onClick={() => setViewPassword(!viewPassword)}
                className="mr-3 w-5 cursor-pointer"
              />
            ) : (
              <ViewOff
                onClick={() => setViewPassword(!viewPassword)}
                className="mr-3 w-5 cursor-pointer"
              />
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block" htmlFor="passwordConfirm">
            Password Confirm
          </label>
          <div className="flex items-center justify-between rounded-md bg-gray-100">
            <input
              type={viewPassword ? "text" : "password"}
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              className="w-full rounded-md bg-gray-100 p-2.5 text-black outline-none"
            />
            {viewPassword ? (
              <ViewIcon
                onClick={() => setViewPassword(!viewPassword)}
                className="mr-3 w-5 cursor-pointer"
              />
            ) : (
              <ViewOff
                onClick={() => setViewPassword(!viewPassword)}
                className="mr-3 w-5 cursor-pointer"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="mx-auto mt-4 rounded-md bg-slate-900 px-16 py-2.5 text-white"
        >
          Sign Up
        </button>
      </form>
      <p className="flex__center mt-4 gap-4 text-center text-gray-500">
        <span className="h-px w-1/2 bg-gray-300"></span>
        <label className="text-nowrap">Or continue with</label>
        <span className="h-px w-1/2 bg-gray-300"></span>
      </p>
      <div className="flex__center mt-4 gap-5">
        <GoogleIcon className="inline-block text-4xl" />
        <FbIcon className="inline-block text-4xl" />
      </div>
    </div>
  );
};

export default SignUp;
