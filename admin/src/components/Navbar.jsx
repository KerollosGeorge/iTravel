import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { darkModeCotext } from "../context/DarkMoodContext";

export const Navbar = () => {
  const [openProfile, setOpenProfile] = useState(false);

  const { user, dispatch } = useContext(AuthContext);
  const { darkMode, dispatchDarkMode } = useContext(darkModeCotext);
  const navigate = useNavigate();
  const Logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };
  return (
    <div className=" relative w-full min-w-max flex">
      <nav
        className={
          darkMode
            ? " w-full flex justify-end px-10 items-center flex-1 bg-[#111]"
            : " w-full flex justify-end px-10 items-center flex-1"
        }
      >
        {user && (
          <div className=" relative flex gap-9 items-center">
            <button
              className={
                darkMode
                  ? "p-3 text-xl shadow-md bg-[#333] rounded-[50%]  text-white transition-all font-semibold uppercase"
                  : "p-3 text-xl shadow-md rounded-[50%] text-[rgb(32,32,32)]  bg-clip-text  transition-all font-semibold uppercase"
              }
              onClick={() => setOpenProfile(!openProfile)}
            >
              {user?.firstName[0]}
              {user?.lastName[0]}
            </button>
            <FontAwesomeIcon
              icon={faMoon}
              className=" scale-[1.5] cursor-pointer"
              onClick={() => dispatchDarkMode({ type: "TOGGLE" })}
            />
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
                  onClick={() => Logout()}
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        )}
      </nav>
      <div className=" absolute top-[48px] bg-[#999] w-full h-[.5px] left-0 my-2"></div>
    </div>
  );
};
