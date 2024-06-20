import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

export const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("user");

  const [seePassword, setSeePassword] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleClick = async (e) => {
    e.preventDefault();
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      phone === "" ||
      country === "" ||
      city === ""
    ) {
      setErr("Please Fill all Fields");
      const errorTime = setTimeout(() => {
        setErr("");
      }, 2000);
      return () => clearTimeout(errorTime);
    } else {
      try {
        const res = await axios.post(
          "https://itravel-apis.vercel.app/api/auth/register",
          {
            firstName,
            lastName,
            email,
            password,
            phone,
            country,
            city,
            role,
          }
        );
        if ((res.data.msg = "user has been created")) {
          navigate("/login");
        }
      } catch (err) {
        setErr(err.response.data.message);
        const errorTime = setTimeout(() => {
          setErr("");
        }, 3000);
        return () => clearTimeout(errorTime);
      }
    }
  };
  return (
    <div className='flex justify-center items-center w-[100%] h-[100vh] bg-gray-300 max-sm:flex max-sm:flex-col gap-1 bg-[url("https://digital.ihg.com/is/image/ihg/ihgor-member-rate-web-offers-1440x720")] bg-cover'>
      <form className="relative flex flex-col min-w-[400px] h-[620px] max-sm:h-[600px] bg-white shadow-gray-800 space-y-[30px] max-sm:space-y-[25px] p-5 rounded-md">
        <h2 className="text-center text-3xl text-black">Sign Up</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col w-full ">
            <label htmlFor="firstName" className="text-black ml-1">
              Full Name
            </label>
            <div className="flex gap-2 text-black">
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="First Name"
                className="w-[120px] h-9 border-b-2 border-blue-900 outline-none  indent-[7px]"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              ></input>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Last Name"
                className="w-[120px] h-9 border-b-2 border-blue-900 outline-none  indent-[7px]"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              ></input>
            </div>
          </div>
          <div className="flex flex-col w-full ">
            <label htmlFor="email" className="text-black ml-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Enter Your Email"
              className="w-[250px] text-black h-9 border-b-2 border-blue-900 outline-none  indent-[7px]"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></input>
          </div>
          <div className="relative flex flex-col w-[250px]">
            <label htmlFor="password" className="text-black ml-1">
              Password
            </label>
            <input
              type={seePassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Enter Your Password"
              className="w-[250px] text-black h-9 border-b-2 border-blue-900 outline-none  indent-[7px]"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></input>
            <FontAwesomeIcon
              icon={faEye}
              className="absolute right-0 text-blue-800 bottom-2 cursor-pointer hover:scale-110"
              onClick={() => setSeePassword((prev) => !prev)}
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="phone" className="text-black ml-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder="Enter Your Phone Number"
              className="w-[250px] text-black h-9 border-b-2 border-blue-900 outline-none  indent-[7px]"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            ></input>
          </div>
          <div className="w-full flex gap-2">
            <div className="flex flex-col ">
              <label htmlFor="country" className="text-black ml-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                placeholder="Your Country"
                className="w-[150px] h-9 border-b-2 text-black border-blue-900 outline-none  indent-[7px]"
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
              ></input>
            </div>
            <div className="flex flex-col">
              <label htmlFor="city" className="text-black ml-1">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="Your City"
                className="w-[150px] h-9 border-b-2 text-black border-blue-900 outline-none  indent-[7px]"
                onChange={(e) => {
                  setCity(e.target.value);
                }}
              ></input>
            </div>
          </div>
          <div className="flex gap-2">
            <label htmlFor="role">You Are</label>
            <select
              id="role"
              className=" h-8 rounded-sm outline-none indent-1 bg-transparent border-[2px] border-[gray]"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="owner">Owner</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <button
            onClick={handleClick}
            className="w-50 bg-green-700 text-lg px-3 py-1 rounded-md text-white cursor-pointer self-center hover:bg-green-500 hover:scale-105"
          >
            Sign up
          </button>
          {err && (
            <span className="w-full text-center text-red-600 text-sm">
              {err}
            </span>
          )}
        </div>
        <div className="absolute bottom-5 left-0 w-full flex justify-around text-black">
          <p>
            already have acount{" "}
            <Link className="text-sm text-blue-700" to="/login">
              login
            </Link>
          </p>
        </div>
      </form>

      <div className="w-[400px] h-[620px] max-md:w-[300px] bg-blue-700 flex flex-col justify-center items-center text-white sm:block  max-sm:hidden space-y-[90px] rounded-md p-5">
        <h1 className="text-center text-3xl text white">Welcome to</h1>
        <div className="flex items-center justify-center flex-col gap-1">
          <img
            alt="logo"
            src="../images/logo.png"
            className="w-[300px] h-[120px] text-center rounded-[100%]"
          />
          <p className="texte-center text-3xl">iTravel</p>
        </div>
        <div className="flex flex-wrap w-full items-center justify-center">
          <p className="text-center w-[200px] text-lg">
            Discover and Find Your Perfect Healing Place
          </p>
        </div>
      </div>
    </div>
  );
};
