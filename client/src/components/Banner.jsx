import { useContext, useEffect, useState } from "react";
import { darkModeContext } from "../context/DarkMoodContext";

export const Banner = () => {
  const textData = [
    "Homes",
    "Apartments",
    "Hotels",
    "Villas",
    "Cabines",
    "Resorts",
  ];
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("homes");
  const { darkMode } = useContext(darkModeContext);
  useEffect(() => {
    const changeText = setTimeout(() => {
      setText(textData[(index + 1) % textData.length]);
      setIndex(index + 1);
    }, 2000);
    return () => clearTimeout(changeText);
  });
  return (
    <div
      className={
        darkMode
          ? "w-[70%] h-[300px] bg-[rgb(32,32,32)] overflow-hidden shadow-lg flex items-center justify-around mt-6 max-md:flex max-md:flex-col max-md:h-[600px] max-md:justify-start max-md:gap-12"
          : "w-[70%] h-[300px] overflow-hidden border-2 border-gray-400 shadow-lg flex items-center justify-around mt-6 max-md:flex max-md:flex-col max-md:h-[600px] max-md:justify-start max-md:gap-12"
      }
    >
      <div className="relative">
        <div
          className={
            darkMode
              ? "w-[550px] h-[550px]  rounded-[50%] bg-[#0c0c1e] max-md:w-[500px] max-md:h-[400px] max-md:mt-[-70px]"
              : "w-[550px] h-[550px]  rounded-[50%] bg-blue-600 max-md:w-[500px] max-md:h-[400px] max-md:mt-[-70px]"
          }
        >
          <div className="absolute z-10 w-[200px] top-[40%]  right-[30%] max-md:top-[30%]">
            <p className=" text-white text-2xl font-semibold">
              Find{" "}
              <span className="w underline underline-offset-4 decoration-yellow-400 font-bold">
                {text}
              </span>{" "}
            </p>
            <p className="text-white text-2xl font-semibold">
              for your next Trip
            </p>
          </div>
        </div>
      </div>
      <img
        src="../images/banner.png"
        alt="banner"
        className="w-[40%] max-md:w-[80%]"
      />
    </div>
  );
};
