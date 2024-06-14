import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { Navbar } from "../components/Navbar";
import { darkModeCotext } from "../context/DarkMoodContext";
import { Sidebar } from "../components/Sidebar";

export const NewUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  console.log(isAdmin);

  const { darkMode } = useContext(darkModeCotext);
  const [seePassword, setSeePassword] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
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
      city === "" ||
      isAdmin === ""
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
            isAdmin,
          }
        );
        if ((res.data.msg = "user has been created")) {
          setMsg("user has been created successfully");
          const timeout = setTimeout(() => {
            setMsg("");
            navigate("/user");
          }, 2000);
          return () => clearTimeout(timeout);
        }
      } catch (err) {
        if (err.response.data.message === "you already Signed Up before") {
          setErr("This User has been Signed up before");
        } else {
          setErr(err.response.data.message);
        }
        const errorTime = setTimeout(() => {
          setErr("");
        }, 3000);
        return () => clearTimeout(errorTime);
      }
    }
  };
  return (
    <div className=" w-[100vw] flex min-w-max">
      <Sidebar />
      <div className="flex w-full">
        <div className="w-[.5px] h-full bg-[#999]"></div>
        <div
          className={
            darkMode
              ? " w-full flex flex-col gap-5 items-center bg-[#111]"
              : " w-full flex flex-col gap-5 items-center "
          }
        >
          <Navbar />
          <h2 className="text-3xl w-full flex text-start p-2 pl-5 shadow-md shadow-[gray]">
            Add New User
          </h2>
          <form
            className={
              darkMode
                ? "relative w-[600px] flex flex-col min-w-[400px] h-[550px] ml-6 mb-4 max-sm:h-[600px] bg-[#111] shadow-xl shadow-[gray] space-y-[30px] max-sm:space-y-[25px] p-5 rounded-md"
                : "relative w-[600px] flex flex-col min-w-[400px] h-[550px] ml-6 mb-4 max-sm:h-[600px] bg-white shadow-lg shadow-[gray] space-y-[30px] max-sm:space-y-[25px] p-5 rounded-md"
            }
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col w-full ">
                <label htmlFor="firstName" className=" ml-1">
                  Username
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="Kero"
                    className=" h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]  "
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  ></input>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="George"
                    className=" h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="flex flex-col w-full ">
                <label htmlFor="email" className=" ml-1">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="kero@gmail.com"
                  className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                ></input>
              </div>
              <div className="relative flex flex-col w-[380px]">
                <label htmlFor="password" className=" ml-1">
                  Password
                </label>
                <input
                  type={seePassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Enter Password"
                  className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                ></input>
                <FontAwesomeIcon
                  icon={faEye}
                  className="absolute right-0 text-blue-600 bottom-2 cursor-pointer scale-[1.3] hover:scale-[1.5] transition-all"
                  onClick={() => setSeePassword((prev) => !prev)}
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="phone" className=" ml-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="+201273201722"
                  className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                ></input>
              </div>
              <div className="w-full flex gap-2">
                <div className="flex flex-col ">
                  <label htmlFor="country" className=" ml-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Egypt"
                    className=" h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                    onChange={(e) => {
                      setCountry(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="city" className=" ml-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="Cairo"
                    className="h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="flex gap-5 items-center">
                <label htmlFor="admin">Is Admin?</label>
                <input
                  type="checkbox"
                  name="admin"
                  id="admin"
                  onClick={() => setIsAdmin(!isAdmin)}
                  className=" scale-[1.5] focus:scale-[1.5] border-none "
                />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <button
                onClick={handleClick}
                className="w-50 bg-blue-600 text-lg px-3 py-1 rounded-md text-white cursor-pointer self-center hover:bg-blue-700 hover:scale-105"
              >
                Send
              </button>
              {err && (
                <span className=" absolute text-center text-red-600 text-sm top-0 self-center bg-[#e1e1e1] p-2 rounded-md">
                  {err}
                </span>
              )}
              {msg && (
                <span className=" absolute text-center text-green-600 text-sm top-0 self-center bg-[#e1e1e1] p-2 rounded-md">
                  {msg}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
