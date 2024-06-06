import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  axios.defaults.withCredentials = true;
  const handleClick = async (e) => {
    e.preventDefault();
    if (email === "") {
      setErr("Please Fill Email Field");
      const errorTime = setTimeout(() => {
        setErr("");
      }, 3000);
      return () => clearTimeout(errorTime);
    } else {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/auth/forget_password",
          email
        );
        if (response.data.Status === "Success") {
          setMsg("Check Your Email");
          const errorTime = setTimeout(() => {
            setMsg("");
            navigate("/login");
          }, 3000);
          return () => clearTimeout(errorTime);
        }
      } catch (error) {
        setErr("We Can't Find Your Email");
        const errorTime = setTimeout(() => {
          setErr("");
        }, 3000);
        return () => clearTimeout(errorTime);
      }
    }
  };

  return (
    <div className='flex justify-center items-center w-[100%] h-[100vh] bg-gray-300 bg-[url("https://digital.ihg.com/is/image/ihg/ihgor-member-rate-web-offers-1440x720")] bg-cover'>
      <form className="relative flex flex-col min-w-[400px] min-h-[400px]  items-start bg-white shadow-gray-800 gap-10 p-5 rounded-md">
        <h2 className="text-black text-3xl">Forget Password</h2>
        <div className="flex flex-col w-full pt-4 gap-[2px]">
          <label htmlFor="email" className="ml-1 text-black">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Enter Your Email"
            className="w-[250px] text-black h-9 border-b-2 border-blue-900 outline-none  indent-[7px]"
            onChange={handleChange}
          ></input>
        </div>
        {err && (
          <span className="w-full text-center text-red-600 text-sm mt-[-20px]">
            {err}
          </span>
        )}
        {msg && (
          <span className="w-full text-center text-green-600 text-sm mt-[-20px]">
            {msg}
          </span>
        )}
        <div className="absolute bottom-[20px] w-[90%] flex justify-around">
          <button
            onClick={() => navigate("/login")}
            className=" w-50 mt-6 bg-gray-700  text-lg px-3 py-1 rounded-md text-white cursor-pointer self-center hover:bg-gray-500  hover:scale-105"
          >
            Back
          </button>
          <button
            onClick={handleClick}
            className=" w-50 mt-6 bg-green-700  text-lg px-3 py-1 rounded-md text-white cursor-pointer self-center hover:bg-green-500 hover:scale-105"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
