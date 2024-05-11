"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

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
      //redirect to /signin
      router.push("/signin");
      const data = await result.json();
      console.log(data, "data🚀🚀🚀");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2>Sign Up</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <label style={{ marginBottom: "8px" }} htmlFor="firstname">
          Firstname
        </label>
        <input
          type="text"
          id="firstname"
          name="firstname"
          value={formData.firstname}
          onChange={handleChange}
          style={{ padding: "10px", marginBottom: "16px" }}
        />

        <label style={{ marginBottom: "8px" }} htmlFor="lastname">
          Lastname
        </label>

        <input
          type="text"
          id="lastname"
          name="lastname"
          value={formData.lastname}
          onChange={handleChange}
          style={{ padding: "10px", marginBottom: "16px" }}
        />
        <label style={{ marginBottom: "8px" }} htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{ padding: "10px", marginBottom: "16px" }}
        />

        <label style={{ marginBottom: "8px" }} htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={{ padding: "10px", marginBottom: "16px" }}
        />
        <label style={{ marginBottom: "8px" }} htmlFor="passwordConfirm">
          Password Confirm
        </label>
        <input
          type="password"
          id="passwordConfirm"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          style={{ padding: "10px", marginBottom: "16px" }}
        />

        <button
          type="submit"
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
