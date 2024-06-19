import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMoon } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { ReviewUs } from "./ReviewUs";
import { darkModeContext } from "../context/DarkMoodContext";

export const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [bars, setBars] = useState(false);
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();
  const Logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };
  const { darkMode, dispatchDarkMode } = useContext(darkModeContext);
  // console.log(user)
  return (
    <nav
      className={
        darkMode
          ? "w-full  flex flex-col justify-around items-center shadow-md shadow-[#333]"
          : "w-full bg-slate-50 flex flex-col justify-around items-center shadow-md shadow-[#333] text-[rgb(32,32,32)] "
      }
    >
      <ReviewUs open={open} setOpen={setOpen} />

      <div className="w-full p-2 flex justify-around items-center gap-3">
        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer justify-center items-center gap-2"
        >
          <img src="/images/logo.png" alt="iTravel" className="w-[150px]" />
        </div>
        <div className="flex items-center justify-around gap-16">
          <FontAwesomeIcon
            icon={faBars}
            className="text-2xl lg:hidden hover:scale-[1.1] transition-all cursor-pointer"
            onClick={() => setBars((prev) => !prev)}
          />
          <ul className="flex gap-10 max-lg:hidden text-lg ">
            {/* <li className="cursor-pointer hover:scale-[1.05] transition-all">
              Popular Cities
            </li> */}
            <li
              className="cursor-pointer hover:scale-[1.05] transition-all"
              onClick={() => {
                navigate("/all_hotels");
              }}
            >
              Hotels
            </li>
            <li className="cursor-pointer hover:scale-[1.05] transition-all">
              <button disabled={!user} onClick={() => setOpen(true)}>
                Review Us
              </button>
            </li>
            <li
              className="cursor-pointer hover:scale-[1.05] transition-all"
              onClick={() => {
                navigate("/aboutUs");
              }}
            >
              About Us
            </li>
            <li
              className="cursor-pointer hover:scale-[1.05] transition-all"
              onClick={() => {
                navigate("/contactUs");
              }}
            >
              Contact Us
            </li>
          </ul>
          {(user?.role === "admin" || user?.role === "owner") && (
            <li
              className="cursor-pointer hover:scale-[1.05] transition-all"
              onClick={() => {
                navigate("/hotel/new");
              }}
            >
              Add Hotel
            </li>
          )}
          {user ? (
            <div className=" relative">
              <button
                className={
                  darkMode
                    ? "p-4 text-xl shadow-md bg-[#333] rounded-[50%]  text-white transition-all font-semibold uppercase"
                    : "p-4 text-xl shadow-md rounded-[50%] text-[rgb(32,32,32)]  bg-clip-text  transition-all font-semibold uppercase"
                }
                onClick={() => setOpenProfile(!openProfile)}
              >
                {user?.firstName[0]}
                {user?.lastName[0]}
              </button>
              {openProfile && (
                <ul className=" absolute bottom-[-80px] left-[-15px] w-[100px] text-lg bg-[rgb(32,32,32)] text-white p-2 space-y-2 z-10 rounded-md">
                  <li
                    className=" cursor-pointer hover:bg-[rgb(48,47,47)] rounded-md hover:scale-[1.1] transition-all text-center"
                    onClick={() => navigate("/Profile")}
                  >
                    Profile
                  </li>
                  <li
                    className=" cursor-pointer hover:bg-[rgb(48,47,47)] rounded-md hover:scale-[1.1] transition-all text-center"
                    onClick={Logout}
                  >
                    Logout
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <div className="flex gap-5 text-lg">
              <button
                className={
                  darkMode
                    ? "text-center font-semibold text-xl w-[100px] bg-[rgb(48,48,48)] p-1"
                    : "text-center font-semibold text-xl w-[100px] bg-red-200 p-1"
                }
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          )}
          <FontAwesomeIcon
            icon={faMoon}
            className=" scale-[1.5] cursor-pointer"
            onClick={() => dispatchDarkMode({ type: "TOGGLE" })}
          />
        </div>
      </div>
      {bars && (
        <ul
          className={
            darkMode
              ? "text-black w-full flex flex-col pl-[10%] gap-9 lg:hidden transition-all p-2 bg-white opacity-[80%] font-semibold"
              : "w-full flex flex-col pl-[10%] gap-9 lg:hidden transition-all p-2 bg-white opacity-[80%] font-semibold"
          }
        >
          {/* <li className="cursor-pointer hover:scale-[1.05] w-[60%] transition-all">
            Popular Cities
          </li> */}
          <li
            className="cursor-pointer hover:scale-[1.05] w-[60%] transition-all"
            onClick={() => {
              navigate("/all_hotels");
            }}
          >
            Hotels
          </li>
          <li className="cursor-pointer hover:scale-[1.05] w-[60%] transition-all">
            <button disabled={!user} onClick={() => setOpen(true)}>
              Review Us
            </button>
          </li>
          <li
            className="cursor-pointer hover:scale-[1.05] w-[60%] transition-all"
            onClick={() => {
              navigate("/aboutUs");
            }}
          >
            About Us
          </li>
          <li
            className="cursor-pointer hover:scale-[1.05] w-[60%] transition-all"
            onClick={() => {
              navigate("/contactUs");
            }}
          >
            Contact Us
          </li>
        </ul>
      )}
    </nav>
  );
};
