import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export const Login = () => {
  const [cred, setCred] = useState({
    email: "",
    password: "",
  });
  const { loading, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [seePassword, setSeePassword] = useState(false);

  const handleChange = (e) => {
    setCred((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  axios.defaults.withCredentials = true;
  const handleClick = async (e) => {
    e.preventDefault();
    if (cred.userName === "" || cred.password === "") {
      setErr("Please Fill all Fields");
      const errorTime = setTimeout(() => {
        setErr("");
      }, 2000);
      return () => clearTimeout(errorTime);
    } else {
      dispatch({ type: "LOGIN_StART" });
      try {
        const response = await axios.post(
          "https://itravel-apis.vercel.app/api/auth/adminLogin",
          cred
        );
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: response.data.details, token: response.data.token },
        });
        navigate("/");
      } catch (error) {
        dispatch({ type: "LOGIN_FAILED", payload: error.response.data });
        setErr(error.response.data.message);
        const errorTime = setTimeout(() => {
          setErr("");
        }, 2000);
        return () => clearTimeout(errorTime);
      }
    }
  };
  return (
    <div className='flex justify-center items-center w-[100%] h-[100vh] bg-gray-300 max-sm:flex max-sm:flex-col gap-1 bg-[url("https://digital.ihg.com/is/image/ihg/ihgor-member-rate-web-offers-1440x720")] bg-cover'>
      <div className="w-[400px] h-[500px] max-sm:h-[250px] max-md:w-[300px] bg-blue-700 flex flex-col justify-center items-center text-white sm:block  max-sm:w-[400px] space-y-[60px] max-sm:space-y-4 rounded-md p-5">
        <h1 className="text-center text-3xl text white">Welcome to</h1>
        <div className="flex items-center justify-center flex-col gap-1">
          <img
            alt="logo"
            src="../images/logo.png"
            className="w-[120px] h-[120px] max-sm:w-[80px] max-sm:h-[80px] rounded-[100%] max-md:transition-all"
          />
          <p className="texte-center text-lg">iTravel</p>
        </div>
        <div className="flex flex-wrap w-full items-center justify-center">
          <p className="text-center w-[200px] text-lg">
            Discover and Find Your Perfect Healing Place
          </p>
        </div>
      </div>
      <form className="relative flex flex-col min-w-[400px] h-[500px] max-sm:h-[400px] bg-white shadow-gray-800 space-y-[50px] max-sm:space-y-[40px] p-5 rounded-md">
        <h2 className="text-center text-3xl ">Login now</h2>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col w-full ">
            <label htmlFor="email" className=" ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Your Email"
              className="w-[250px] h-9 border-b-2 border-blue-900 outline-none  indent-[7px]"
              onChange={handleChange}
            ></input>
          </div>
          <div className="relative flex flex-col w-[250px]">
            <label htmlFor="password" className=" ml-1">
              Password
            </label>
            <input
              type={seePassword ? "text" : "password"}
              autoComplete="off"
              name="password"
              id="password"
              placeholder="Enter Your Password"
              className=" w-[250px] h-9 border-b-2 border-blue-900 outline-none  indent-[7px]"
              onChange={handleChange}
            ></input>
            <FontAwesomeIcon
              icon={faEye}
              className="absolute right-0 text-blue-800 bottom-2 cursor-pointer hover:scale-110"
              onClick={() => setSeePassword((prev) => !prev)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <button
            disabled={loading}
            onClick={handleClick}
            className="w-50 bg-green-700 text-lg px-3 py-1 rounded-md text-white cursor-pointer self-center hover:bg-green-500 hover:scale-105"
          >
            Login
          </button>
          {err && (
            <span className="w-full text-center text-red-600 text-sm">
              {err}
            </span>
          )}
        </div>
        <div className="absolute bottom-10 left-0 w-full flex justify-around">
          <Link to="/forget_password" className="cursor-pointer text-blue-800">
            forget password
          </Link>
        </div>
      </form>
    </div>
  );
};
