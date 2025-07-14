import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3000/api/user/reset-password/${id}/${token}`, {
        newPassword,
      });
      Swal.fire("Success", res.data.message, "success").then(() => navigate("/login"));
    } catch (error) {
      Swal.fire("Error", error.response?.data?.error || "Invalid or expired link", "error");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-zinc-800 p-6 rounded w-full max-w-md">
        <h2 className="text-2xl mb-4">Reset Your Password</h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 mb-4 rounded bg-zinc-700"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};
