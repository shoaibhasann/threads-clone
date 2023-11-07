import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiHide, BiShowAlt } from "react-icons/bi";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { createAccount } from "../store/slices/AuthSlice.js";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading: isLoading } = useSelector((state) => state?.auth);

  const [signupData, setSignupData] = useState({
    fullname: "",
    username: "",
    password: "",
    email: ""
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!signupData.username || !signupData.password || !signupData.email || !signupData.fullname) {
      toast.error("Please fill all the details.");
    }

    const response = await dispatch(createAccount(signupData));

    if (response?.payload?.success) {
      navigate("/");
    }

    setSignupData({
      fullname: "",
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="flex overflow-x-auto items-center justify-center h-[100vh] bg-dark-secondary">
      <form
        noValidate
        onSubmit={handleSignup}
        className="flex flex-col justify-center gap-3 p-6 mx-4 sm:mx-0 text-white w-96 shadow-[0_0_10px_#4d4d4d] rounded-lg"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <img className="w-10" src="./favicon.png" alt="Threads" />
          <h1 className="text-center text-2xl font-bold">
            Create your account
          </h1>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="fullname" className="font-semibold">
            Fullname <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            name="fullname"
            id="fullname"
            placeholder="Enter your fullname.."
            className="bg-transparent px-2 py-1 sm:py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
            onChange={handleUserInput}
            value={signupData.fullname}
          />
        </div>

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
            value={signupData.username}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-semibold">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            name="email"
            id="email"
            placeholder="Enter your email.."
            className="bg-transparent px-2 py-1 sm:py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none"
            onChange={handleUserInput}
            value={signupData.email}
          />
        </div>

        <div className="flex flex-col gap-1 relative">
          <label htmlFor="password" className="font-semibold">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              name="password"
              id="password"
              placeholder="Enter your password.."
              className="bg-transparent w-full px-2 py-1 sm:py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none pr-10"
              onChange={handleUserInput}
              value={signupData.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-xl top-1/2 transform -translate-y-1/2 right-2 flex items-center"
            >
              {showPassword ? <BiHide /> : <BiShowAlt />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 bg-blue-600 hover:bg-blue-500 rounded-md transition-all ease-in-out duration-300 py-2 font-semibold text-lg cursor-pointer flex justify-center "
        >
          {isLoading ? (
            <TailSpin
              height="25"
              width="25"
              color="#fff"
              ariaLabel="tail-spin-loading"
              radius="2"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="flex items-center justify-center gap-2">
          Already have an account?
          <Link to="/login" className="text-accent cursor-pointer underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
