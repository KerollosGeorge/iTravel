import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { SearchContext } from "../context/SearchContext";
import { darkModeContext } from "../context/DarkMoodContext";

export const SearchBar = () => {
  const [err, setErr] = useState("");
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const { darkMode } = useContext(darkModeContext);
  const navigate = useNavigate();

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const { dispatch } = useContext(SearchContext);
  const handleSearch = () => {
    if (destination === "") {
      setErr("pleasr add your destination");
      const errorTime = setTimeout(() => {
        setErr("");
      }, 2000);
      return () => clearTimeout(errorTime);
    } else {
      dispatch({ type: "New_Search", payload: { destination, date, options } });
      navigate("/hotels", { state: { destination, date, options } });
    }
  };
  return (
    <div
      className={
        darkMode
          ? "w-full flex justify-center items-center mt-3 bg-[rgb(32,32,32)] rounded-md border-none outline-none shadow-md shadow-[gray]"
          : "w-full flex justify-center items-center mt-3 bg-white rounded-md border-none outline-none shadow-md shadow-[gray]"
      }
    >
      <div className=" w-[1000px] flex gap-0 rounded-md p-9 justify-around items-center max-md:w-full max-md:flex max-md:flex-col max-md:gap-6 transition-all ">
        <input
          type="text"
          name="dest"
          placeholder={!err ? "Where are you going?" : "Add Your Destination"}
          className={
            !err
              ? "outline-none indent-1 py-2 px-3 border-[1px] border-gray-800 rounded-sm bg-transparent  max-sm:w-[98%] max-sm:ml-[-4px]"
              : " border-[1px] border-red-600 indent-1 py-2 px-3 placeholder-red-600 max-sm:w-full"
          }
          onChange={(e) => setDestination(e.target.value)}
        />
        <div className="relative">
          <span
            onClick={() => setOpenDate(!openDate)}
            className=" cursor-pointer  text-gray-400 border-[1px] border-gray-800 p-2  max-sm:px-[38px] max-sm:ml-[-4px]"
          >
            {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
              date[0].endDate,
              "MM/dd/yyyy"
            )}`}
          </span>
          {openDate && (
            <DateRange
              editableDateInputs={true}
              onChange={(item) => setDate([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={date}
              minDate={new Date()}
              className="absolute top-[40px] left-0 z-10 bg-white shadow-lg max-md:absolute max-md:left-[-30%] "
            />
          )}
        </div>
        <div className="relative max-sm:w-full">
          <span
            onClick={() => setOpenOptions(!openOptions)}
            className="cursor-pointer text-gray-400 border-[1px] border-gray-800 py-2 px-2 max-sm:px-[35px] max-sm:ml-0"
          >
            {`${options.adult} adult · ${options.children} children · ${options.room} room`}
          </span>
          {openOptions && (
            <div
              className={
                darkMode
                  ? "absolute text-slate-300 top-[40px] z-10 shadow-lg  bg-[#222] w-full flex flex-col gap-9 py-2 px-3"
                  : "absolute top-[40px] z-10 shadow-lg  bg-white w-full flex flex-col gap-9 py-2 px-3 "
              }
            >
              <div className="flex justify-between">
                <span>Adult</span>
                <div className="w-[50%] flex justify-between ">
                  <button
                    disabled={options.adult <= 1}
                    className="w-[30px] h-6 cursor-pointer border-[1px] flex justify-center items-center border-blue-700 disabled:cursor-not-allowed"
                    onClick={() => handleOption("adult", "d")}
                  >
                    -
                  </button>
                  <span>{options.adult}</span>
                  <button
                    className="w-[30px] h-6 cursor-pointer border-[1px] flex justify-center items-center border-blue-700 "
                    onClick={() => handleOption("adult", "i")}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Children</span>
                <div className="w-[50%] flex justify-between ">
                  <button
                    className="w-[30px] h-6 cursor-pointer border-[1px] flex justify-center items-center border-blue-700 disabled:cursor-not-allowed"
                    disabled={options.children <= 0}
                    onClick={() => handleOption("children", "d")}
                  >
                    -
                  </button>
                  <span>{options.children}</span>
                  <button
                    className="w-[30px] h-6 cursor-pointer border-[1px] flex justify-center items-center border-blue-700 "
                    onClick={() => handleOption("children", "i")}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span>Room</span>
                <div className="w-[50%] flex justify-between ">
                  <button
                    className="w-[30px] h-6 cursor-pointer border-[1px] flex justify-center items-center border-blue-700 disabled:cursor-not-allowed"
                    disabled={options.room <= 1}
                    onClick={() => handleOption("room", "d")}
                  >
                    -
                  </button>
                  <span>{options.room}</span>
                  <button
                    className="w-[30px] h-6 cursor-pointer border-[1px] flex justify-center items-center border-blue-700 "
                    onClick={() => handleOption("room", "i")}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-700 text-white py-[8px] px-[12px] rounded-md cursor-pointer hover:bg-blue-600 hover:scale-[1.04]"
        >
          Search
        </button>
      </div>
    </div>
  );
};
