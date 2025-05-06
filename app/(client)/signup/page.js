"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/public/assets/icons/google.svg";
import ViewIcon from "@/public/assets/icons/view.svg";
import ViewOff from "@/public/assets/icons/view-off.svg";
import { InputType } from "@/app/ui/inputType";
import { signIn } from "next-auth/react";
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

    if (result.ok) {
      router.push("/signin");
    }
  };

  return (
    <div className="flex_center mx-auto my-16 max-w-2xl border border-gray-300 bg-white px-20 py-10">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="mt-4 flex w-full flex-col gap-3">
        <div className="item__center flex-1 shrink-0 grow-0 basis-1/2 gap-4">
          <InputType
            name="firstname"
            label="Firstname"
            required={true}
            value={formData.firstname}
            onChange={handleChange}
          />
          <InputType
            name="lastname"
            label="Lastname"
            required={true}
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>

        <InputType
          name="email"
          label="Email"
          type="email"
          required={true}
          value={formData.email}
          onChange={handleChange}
        />

        <InputType
          name="password"
          label="Password"
          type={viewPassword ? "text" : "password"}
          required={true}
          value={formData.password}
          onChange={handleChange}
          icon={viewPassword ? ViewIcon : ViewOff}
          onIconClick={() => setViewPassword(!viewPassword)}
        />

        <InputType
          name="passwordConfirm"
          label="Password Confirm"
          type={viewPassword ? "text" : "password"}
          required={true}
          value={formData.passwordConfirm}
          onChange={handleChange}
          icon={viewPassword ? ViewIcon : ViewOff}
          onIconClick={() => setViewPassword(!viewPassword)}
        />

        <button
          type="submit"
          className="mx-auto mt-4 bg-slate-900 px-16 py-2.5 text-white"
        >
          Sign Up
        </button>
      </form>
      <p className="flex__center mt-4 gap-4 text-center text-gray-500">
        <span className="h-px w-1/2 bg-gray-300"></span>
        <label className="text-nowrap">Or sign in with</label>
        <span className="h-px w-1/2 bg-gray-300"></span>
      </p>
      <div className="flex__center mt-4 gap-5">
        <GoogleIcon
          className="inline-block cursor-pointer text-4xl"
          onClick={() => signIn("google")}
        />
      </div>
    </div>
  );
};

export default SignUp;
