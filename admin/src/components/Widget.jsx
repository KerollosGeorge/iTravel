import useFetch from "../hooks/useFetch";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { darkModeCotext } from "../context/DarkMoodContext";
import axios from "axios";

export const Widget = ({ type }) => {
  const navigate = useNavigate();
  const { darkMode } = useContext(darkModeCotext);
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "https://itravel-apis.vercel.app/api/user/usersCount"
      );
      setCounts(res.data);
    };

    fetchData();
  }, []);
  let data;
  switch (type) {
    case "user":
      {
        data = {
          type: "user",
          title: "USERS",
          isMony: false,
          link: "View all Users",
          icon: (
            <PersonOutlinedIcon
              className={
                darkMode
                  ? " scale-[1.5] p-[5px] rounded-[5px] self-end text-[#ff4343] bg-[#471010] cursor-pointer hover:scale-[1.7] transition-all"
                  : " scale-[1.5] p-[5px] rounded-[5px] self-end text-[crimson] bg-[#ffafbf] cursor-pointer hover:scale-[1.7] transition-all"
              }
            />
          ),
          count: counts,
          diff: 20,
        };
      }
      break;
    case "orders":
      {
        //   const counts = useFetch(`https://itravel-apis.vercel.app/api/user/usersCount`);
        data = {
          type: "orders",
          title: "ORDERS",
          isMony: false,
          link: "View all Booking Orders",
          icon: (
            <ShoppingCartOutlinedIcon
              className={
                darkMode
                  ? " scale-[1.5] p-[5px] rounded-[5px] self-end text-[goldenrod] bg-[#5c4b10] cursor-pointer hover:scale-[1.7] transition-all"
                  : " scale-[1.5] p-[5px] rounded-[5px] self-end text-[goldenrod] bg-[#fddbe2] cursor-pointer hover:scale-[1.7] transition-all"
              }
            />
          ),
          count: 100,
          diff: 20,
        };
      }
      break;
    case "earning":
      {
        //   const counts = useFetch(`https://itravel-apis.vercel.app/api/user/usersCount`);
        data = {
          type: "earning",
          title: "EARNING",
          isMony: true,
          link: "View net earning",
          icon: (
            <MonetizationOnOutlinedIcon
              className={
                darkMode
                  ? " scale-[1.5] p-[5px] rounded-[5px] self-end text-[#41ff41] bg-[#0f460f] cursor-pointer hover:scale-[1.7] transition-all"
                  : " scale-[1.5] p-[5px] rounded-[5px] self-end text-[green] bg-[#a5ffa5] cursor-pointer hover:scale-[1.7] transition-all"
              }
            />
          ),
          count: 100,
          diff: 20,
        };
      }
      break;
    case "balance":
      {
        //   const counts = useFetch(`https://itravel-apis.vercel.app/api/user/usersCount`);
        data = {
          type: "balance",
          title: "BALANCE",
          isMony: true,
          link: "see Details",
          icon: (
            <AccountBalanceWalletOutlinedIcon
              className={
                darkMode
                  ? " scale-[1.5] p-[5px] rounded-[5px] self-end text-[#ff41ff] bg-[#3e093e] cursor-pointer hover:scale-[1.7] transition-all"
                  : " scale-[1.5] p-[5px] rounded-[5px] self-end text-[purple] bg-[#dd92dd] cursor-pointer hover:scale-[1.7] transition-all"
              }
            />
          ),
          count: 100,
          diff: 20,
        };
      }
      break;
    default:
      break;
  }
  return (
    <div className="mt-5 m-3 flex flex-1 justify-between p-3 shadow-lg shadow-[#616161] rounded-lg h-[130px] min-w-[255px]">
      <div className=" flex flex-col justify-between">
        <span className=" font-bold text-[14px] text-[#a0a0a0]">
          {data?.title}
        </span>
        <span
          className={
            darkMode
              ? "text-[28px] text-[#7f7f7f]"
              : "text-[28px] text-[#000000]"
          }
        >
          {data?.isMony && "$"}
          {data?.count}
        </span>
        <span
          className=" w-max text-[12px] border-b-[1px] border-b-[gray] cursor-pointer"
          onClick={() => navigate(`/${data.type}`)}
        >
          {data?.link}
        </span>
      </div>
      <div className=" flex flex-col justify-between">
        <div
          className={
            data?.diff > 0
              ? " flex items-center text-[14px] text-[green]"
              : " flex items-center text-[14px] text-[red]"
          }
        >
          <KeyboardArrowUpIcon className=" scale-[2] p-2 rounded self-end " />
          {data?.diff} %
        </div>
        {data?.icon}
      </div>
    </div>
  );
};
