import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Loading } from "./Loading";
export const PopularCities = () => {
  const { data, loading } = useFetch(
    "https://itravel-apis.vercel.app/api/hotels"
  );
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(5);
  const [disabled, setDisabled] = useState(true);

  const getImageSource = (photo) => {
    if (!photo) return;
    return photo.startsWith("http")
      ? photo
      : `https://itravel-apis.vercel.app/Images/${photo}`;
  };

  const Next = () => {
    setEnd((end + 1 + data.length) % data.length);
    setStart((start + 1 + data.length) % data.length);
  };

  const Prev = () => {
    if (start === 0) {
      return;
    } else {
      setStart((start - 1 + data.length) % data.length);
      setEnd((end - 1 + data.length) % data.length);
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (end === data.length - 1) {
      setStart(end);
      setEnd(4);
    }
    if (start === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [start]);
  return (
    <div className="w-[70%]">
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-2 mt-9 relative">
          <h1 className="text-3xl p-1">Popular Reservations</h1>
          <div className="flex gap-4 p-2 max-md:flex max-md:flex-col ">
            {data.slice(start, end).map((item, i) => (
              <div
                key={i}
                className="h-[250px] relative shadow-lg min-w-[100px]"
              >
                <img
                  crossorigin="anonymous"
                  src={getImageSource(item?.photos?.[0])}
                  alt={item?.city}
                  className="w-[200px] h-full object-cover rounded-md  max-md:w-full max-md:h-full bg-red-300 brightness-[90%]"
                />
                <div className="absolute bottom-1 flex flex-col w-full">
                  <p className="text-[13px] font-bold text-white bg-black/50 rounded py-1 px-2 text-center">
                    {item?.HotelName}
                  </p>
                  <h1 className="text-[14px] font-bold text-center text-white p-1 max-md:text-2xl">
                    {item?.country}, {item?.city}
                  </h1>
                  <button className="w-[100px] p-1 bg-blue-600 rounded-md  hover:scale-[1.03] transition-all text-white self-center">
                    <Link to={`/hotels/${item?._id}/0`}>View Details</Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <FontAwesomeIcon
            icon={faCaretRight}
            className=" absolute right-[-20px] top-[50%] text-3xl text-red-500 py-[1px] px-[3px] cursor-pointer border-[1px] border-gray-400"
            onClick={Next}
          />
          <FontAwesomeIcon
            icon={faCaretLeft}
            className={
              !disabled
                ? "absolute left-[-20px] top-[50%] text-3xl text-red-500 py-[1px] px-[3px] cursor-pointer border-[1px] border-gray-400"
                : "absolute left-[-20px] top-[50%] text-3xl text-red-300 py-[1px] px-[3px] cursor-not-allowed border-[1px] border-gray-400"
            }
            onClick={Prev}
          />
        </div>
      )}
    </div>
  );
};
