import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/user/forgot-password", { email });
     console.log(res);
     
      Swal.fire("Success", res.data.message, "success");
    } catch (error) {
      Swal.fire("Error", error.response.data.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded w-full max-w-md">
        <h2 className="text-2xl mb-4">Forgot Password</h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 mb-4 rounded bg-zinc-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};
