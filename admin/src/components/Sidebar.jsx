import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import HotelIcon from "@mui/icons-material/Hotel";
import RateReviewIcon from "@mui/icons-material/RateReview";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { darkModeCotext } from "../context/DarkMoodContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Sidebar = () => {
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);
  const Logout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };
  const { darkMode, dispatchDarkMode } = useContext(darkModeCotext);
  return (
    <div className=" h-ful flex">
      <div className="w-[250px] pl-5 p-2 relative h-[100vh]">
        <img
          src="/logo.png"
          alt="iTravel"
          className=" h-[40px] cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className=" absolute bg-[#999] w-full h-[.5px] left-0 my-2"></div>
        <ul className="flex flex-col gap-2 mt-5">
          <p className={darkMode ? " text-gray-200" : " text-gray-700"}>MAIN</p>
          <Link to="/" className=" text-[#999] font-semibold">
            <li
              className={
                darkMode
                  ? "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#333] cursor-pointer"
                  : "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#ece8ff] cursor-pointer"
              }
            >
              <DashboardIcon
                className={
                  darkMode
                    ? "text-[#999] scale-[.8]"
                    : "text-[#6439ff] scale-[.8]"
                }
              />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className={darkMode ? " text-gray-200" : " text-gray-700"}>
            LISTS
          </p>
          <Link to="/user" className=" text-[#999] font-semibold">
            <li
              className={
                darkMode
                  ? "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#333] cursor-pointer"
                  : "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#ece8ff] cursor-pointer"
              }
            >
              {" "}
              <PersonOutlineIcon
                className={
                  darkMode
                    ? "text-[#999] scale-[.8]"
                    : "text-[#6439ff] scale-[.8]"
                }
              />
              <span>Users</span>
            </li>
          </Link>
          <Link to="/hotels" className=" text-[#999] font-semibold">
            <li
              className={
                darkMode
                  ? "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#333] cursor-pointer"
                  : "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#ece8ff] cursor-pointer"
              }
            >
              {" "}
              <StoreIcon
                className={
                  darkMode
                    ? "text-[#999] scale-[.8]"
                    : "text-[#6439ff] scale-[.8]"
                }
              />
              <span>Hotels</span>
            </li>
          </Link>
          <Link to="/rooms" className=" text-[#999] font-semibold">
            <li
              className={
                darkMode
                  ? "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#333] cursor-pointer"
                  : "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#ece8ff] cursor-pointer"
              }
            >
              {" "}
              <HotelIcon
                className={
                  darkMode
                    ? "text-[#999] scale-[.8]"
                    : "text-[#6439ff] scale-[.8]"
                }
              />
              <span>Rooms</span>
            </li>
          </Link>
          <Link to="/reviews" className=" text-[#999] font-semibold">
            <li
              className={
                darkMode
                  ? "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#333] cursor-pointer"
                  : "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#ece8ff] cursor-pointer"
              }
            >
              {" "}
              <RateReviewIcon
                className={
                  darkMode
                    ? "text-[#999] scale-[.8]"
                    : "text-[#6439ff] scale-[.8]"
                }
              />
              <span>Reviews</span>
            </li>
          </Link>
          <p className={darkMode ? " text-gray-200" : " text-gray-700"}>User</p>
          <Link to="/profile" className=" text-[#999] font-semibold">
            <li
              className={
                darkMode
                  ? "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#333] cursor-pointer"
                  : "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#ece8ff] cursor-pointer"
              }
            >
              {" "}
              <AccountCircleOutlinedIcon
                className={
                  darkMode
                    ? "text-[#999] scale-[.8]"
                    : "text-[#6439ff] scale-[.8]"
                }
              />
              <span>Profile</span>
            </li>
          </Link>
          <Link to="/" className=" text-[#999] font-semibold">
            <li
              className={
                darkMode
                  ? "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#333] cursor-pointer"
                  : "flex gap-2 ml-2 border-[.5px] border-transparent p-1 hover:border-[.5px]  hover:border-[rgb(230, 227, 227)] hover:bg-[#ece8ff] cursor-pointer"
              }
            >
              {" "}
              <ExitToAppIcon
                className={
                  darkMode
                    ? "text-[#999] scale-[.8]"
                    : "text-[#6439ff] scale-[.8]"
                }
              />
              <span onClick={() => Logout()}>Logout</span>
            </li>
          </Link>
          <div className=" flex gap-2">
            <span
              onClick={() => dispatchDarkMode({ type: "LIGHT" })}
              className=" w-[30px] h-[30px] bg-slate-100 border-[2px] border-gray-400 rounded-md cursor-pointer hover:scale-[1.1] hover:transition-all"
            ></span>
            <span
              onClick={() => dispatchDarkMode({ type: "DARK" })}
              className=" w-[30px] h-[30px] bg-gray-800 border-[2px] border-gray-400 rounded-md cursor-pointer hover:scale-[1.1] hover:transition-all"
            ></span>
          </div>
        </ul>
      </div>
      <div className="w-[.5px] h-full min-h-[100vh] z-50 bg-[#999]"></div>
    </div>
  );
};
