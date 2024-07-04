"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    document.body.classList.add("bg-gray-100");
  }, []);

  if (session) {
    console.log(session, "session🔥");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.log(result);
    } else {
      console.log("Sign in successful!");
    }
  };

  return (
    <div className="flex_center my-16 mx-auto max-w-2xl px-20 py-10 border border-gray-100 rounded-lg shadow-xl bg-white">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit} className="flex flex-col mt-4 w-full gap-4">
        {/* <label style={{ marginBottom: "10px" }}> */}
        <label style={{ marginBottom: "8px" }} htmlFor="firstname">
          Email:
        </label>
        <input
          type="email"
          value={email}
          id="firstname"
          onChange={(e) => setEmail(e.target.value)}
          className="p-2.5 bg-gray-100 rounded-md w-full text-black outline-none"
        />
        <label style={{ marginBottom: "8px" }} htmlFor="firstname">
          Password:
        </label>

        <input
          type="password"
          value={password}
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          className="p-2.5 bg-gray-100 rounded-md w-full text-black outline-none"
        />
        <button
          type="submit"
          className="bg-slate-900 text-white py-2.5 px-16 rounded-md mx-auto mt-4"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
