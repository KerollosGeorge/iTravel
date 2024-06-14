import { Navbar } from "../components/Navbar";
import { SearchBar } from "../components/SearchBar";
import { PropertyList } from "../components/PropertyList";
import { PopularCities } from "../components/PopularCities";
import { SiteReviews } from "../components/SiteReviews";
import { Banner } from "../components/Banner";
import { ReviewUs } from "../components/ReviewUs";
import { Footer } from "../components/Footer";
import { useContext, useEffect, useState } from "react";
import { darkModeContext } from "../context/DarkMoodContext";

export const Home = () => {
  const { darkMode } = useContext(darkModeContext);
  const [start, setStart] = useState(0);
  const images = [
    "images/hotels/1.jpg",
    "images/hotels/2.jpg",
    "images/hotels/3.jpg",
    "images/hotels/4.jpg",
    "images/hotels/5.jpg",
    "images/hotels/6.jpg",
    "images/hotels/7.jpg",
  ];
  useEffect(() => {
    const time = setTimeout(() => {
      setStart((start + 1) % images.length);
    }, 5000);
    return () => clearTimeout(time);
  });
  return (
    <div className="w-full flex flex-col justify-center items-center ">
      <div
        className={
          darkMode
            ? "absolute top-0 w-full z-20 bg-[#222]"
            : "absolute top-0 w-full z-20 bg-white"
        }
      >
        <Navbar />
      </div>
      <ReviewUs />
      <img
        src={images[start]}
        alt=""
        className=" relative z-10 w-full self-center top-[80px] h-[615px] grayscale-[10%] brightness-[85%] mb-20 "
      />
      <div className=" absolute top-[25%] left-[10%] flex flex-col text-white z-10">
        <h1 className="text-5xl font-bold mb-9">Enjoy your Stay ...</h1>
        <p className="text-xl">Planning to Travel!</p>
        <p className="text-xl w-[450px]">
          With <span>ITravel</span> Search and book one of the luxury hotel
          rooms in your destination..
        </p>
      </div>
      <div className="w-[80%] absolute bottom-0 max-md:w-full outline-none border-none z-10">
        <SearchBar />
      </div>
      <PropertyList />
      <PopularCities />
      <Banner />
      <SiteReviews />
      <Footer />
    </div>
  );
};
