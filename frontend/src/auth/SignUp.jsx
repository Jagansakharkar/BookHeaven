import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/auth/authThunks';

export const SignUp = () => {
  const [showPassword, setShowPassword] = useState(true)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.auth);

  // initial State of user data
  const [userData, setUserData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    address: {
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: ""
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['phone', 'street', 'city', 'state', 'pincode'].includes(name)) {
      setUserData({
        ...userData,
        address: {
          ...userData.address,
          [name]: value
        }
      });
    } else {
      setUserData({
        ...userData,
        [name]: value
      });
    }
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();

    const { fullname, username, email, password, address } = userData;

    if (!fullname || !username || !email || !password || Object.values(address).some(field => !field)) {
      Swal.fire({
        icon: 'error',
        text: "All fields including address are required"
      });
      return;
    }

    const resultAction = await dispatch(registerUser(userData));

    if (registerUser.fulfilled.match(resultAction)) {
      Swal.fire({ icon: "success", text: "Registered Successfully" });
      navigate('/');
    } else {
      Swal.fire({ icon: "error", text: resultAction.payload || "Registration failed" });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="w-full bg-white rounded-lg shadow sm:max-w-md dark:bg-gray-800 dark:border-gray-700 p-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create an account</h1>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmitData} className="space-y-4">
          <input name="fullname" type="text" placeholder="Full Name" value={userData.fullname}
            onChange={handleChange} required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input name="username" type="text" placeholder="Username" value={userData.username}
            onChange={handleChange} required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input name="email" type="email" placeholder="Email" value={userData.email}
            onChange={handleChange} required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input name="password" type={showPassword ? "password" : "text"} placeholder="Password" value={userData.password}
            onChange={handleChange} required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <button type='button' onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"} Password</button>

          {/* Address Fields */}
          <input name="phone" type="text" placeholder="Phone (10 digits)" value={userData.address.phone}
            onChange={handleChange} pattern="[0-9]{10}" required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input name="street" type="text" placeholder="Street" value={userData.address.street}
            onChange={handleChange} required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input name="city" type="text" placeholder="City" value={userData.address.city}
            onChange={handleChange} required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input name="state" type="text" placeholder="State" value={userData.address.state}
            onChange={handleChange} required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input name="pincode" type="text" placeholder="Pincode" value={userData.address.pincode}
            onChange={handleChange} required
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />

          <button type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-2">
            Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </section>
  );
};
