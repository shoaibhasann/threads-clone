import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../store/slices/AuthSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.username || !loginData.password) {
      toast.error("Please fill all the details.");
    }

    const response = await dispatch(login(loginData));

    if (response?.payload?.success) {
      navigate("/");
    }

    setLoginData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex overflow-x-auto items-center justify-center h-[100vh] bg-dark-secondary">
      <form
        noValidate
        onSubmit={handleLogin}
        className="flex flex-col justify-center gap-3 p-6 mx-4 sm:mx-0 text-white w-96 shadow-[0_0_10px_#4d4d4d] rounded-lg"
      >
        <h1 className="text-center text-2xl font-bold">Log In</h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="font-semibold">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            name="username"
            id="username"
            placeholder="Enter your username.."
            className="bg-transparent px-2 py-1 sm:py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
            onChange={handleUserInput}
            value={loginData.username}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-semibold">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            required
            name="password"
            id="password"
            placeholder="Enter your password.."
            className="bg-transparent px-2 py-1 sm:py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
            onChange={handleUserInput}
            value={loginData.password}
          />
        </div>

        <div className="text-right">
          <a href="/forgot-password" className="text-xs text-accent underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-500 rounded-md transition-all ease-in-out duration-300 py-2 font-semibold text-lg cursor-pointer"
        >
          Log In
        </button>

        <p className="flex items-center justify-center gap-2">
          Don&apos;t have an account?
          <Link to="/signup" className="text-accent cursor-pointer underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
