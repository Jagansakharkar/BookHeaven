import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { loginUser } from '../store/auth/authThunks';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(true)
  const { loading, error, role } = useSelector(state => state.auth);

  const [credential, setCredential] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredential(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = credential;

    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Credentials',
        text: 'Username and password are required for login.'
      });
      return;
    }

    try {
      const resultAction = await dispatch(loginUser(credential));


      if (loginUser.fulfilled.match(resultAction)) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
        });

        { role === 'user' && setTimeout(() => navigate('/'), 3000) }
        { role === 'admin' && setTimeout(() => navigate("/admin/dashboard")) }

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: resultAction.payload?.message || "Invalid credentials."
        });

        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Something went wrong. Please try again.'
      });

      setTimeout(() => navigate('/login'), 3000);
    }
  };


  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 backdrop-blur-none bg-black/50"></div>
      <div className="backdrop-blur-sm flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-2xl shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Login
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your username"
                  value={credential.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input
                  type={showPassword ? "password" : "text"}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={credential.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type='button' onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Show" : "Hide"} Password
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <input id="remember" type="checkbox" className="w-4 h-4 border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-500 dark:text-gray-300">Remember me</label>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Forgot password?</Link>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-400 text-white hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link to="/signUp" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
              </p>
              {error && <p className="text-sm text-red-500 mt-2 text-center">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
