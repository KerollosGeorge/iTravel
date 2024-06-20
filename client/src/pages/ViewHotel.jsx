import useFetch from "../hooks/useFetch";
import { useLocation } from "react-router-dom";
import { Rooms } from "../components/Rooms";
import { Navbar } from "../components/Navbar";
import { StarRating } from "../components/StarsRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Reviews } from "../components/Reviews";
import { Loading } from "../components/Loading";

export const ViewHotel = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { data, loading } = useFetch(
    `https://itravel-apis.vercel.app/api/hotels/find/${id}`
  );
  const [disabled, setDisabled] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [start, setStart] = useState(0);

  const getImageSource = (photo) => {
    if (!photo) return;
    return photo.startsWith("http")
      ? photo
      : `https://itravel-apis.vercel.app/Images/${photo}`;
  };
  const Next = () => {
    setStart((start + 1) % data?.photos?.length);
  };

  const Prev = () => {
    if (start === 0) {
      return;
    } else {
      setStart((start - 1) % data?.photos?.length);
      setDisabled(false);
    }
  };
  useEffect(() => {
    if (start === data?.photos?.length) {
      setStart(data?.photos[0]);
    }
    if (start === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [start]);

  return (
    <div className=" w-full">
      <div className=" w-full flex flex-col gap-4 ">
        <Navbar />
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="flex flex-col min-w-[500px] self-center max-lg:w-[350px]">
              <div className=" relative">
                <img
                  crossorigin="anonymous"
                  src={getImageSource(data?.photos?.[start])}
                  alt={data?.HotelName}
                  className="w-[800px] h-[450px] rounded-2xl max-lg:h-auto min-h-[450px] max-lg:max-h-[450px]"
                />
                <FontAwesomeIcon
                  icon={faCaretRight}
                  className=" absolute right-[-30px] top-[50%] text-3xl text-red-500 py-[1px] px-[3px] cursor-pointer border-[1px] border-gray-400"
                  onClick={Next}
                />
                <FontAwesomeIcon
                  icon={faCaretLeft}
                  className={
                    !disabled
                      ? "absolute left-[-30px] top-[50%] text-3xl text-red-500 py-[1px] px-[3px] cursor-pointer border-[1px] border-gray-400"
                      : "absolute left-[-30px] top-[50%] text-3xl text-red-300 py-[1px] px-[3px] cursor-not-allowed border-[1px] border-gray-400"
                  }
                  onClick={Prev}
                />
              </div>

              <div className="flex flex-col gap-2 p-5">
                <h1 className="text-xl mb-3">
                  {data?.HotelName}{" "}
                  <span className="text-blue-800">{data?.title}</span>
                </h1>
                <div className="flex justify-between">
                  <span className="flex gap-3">
                    <StarRating rating={data?.rating} />{" "}
                    {Math.floor(data?.rating)} Stars {data?.type}
                  </span>
                  <span className=" text-xl font-semibold text-red-600">
                    Price: {data?.cheapestPrice}$
                  </span>
                </div>
                <span>
                  <FontAwesomeIcon icon={faLocationDot} /> {data?.country},{" "}
                  {data?.city}, {data?.address}
                </span>
                <div className="mt-5">
                  <h1 className="text-2xl text-red-400">Description</h1>
                  <p className="pl-2">{data?.distance}</p>
                  <p className="pl-2">{data?.description}</p>
                </div>
                {data?.reviews && (
                  <div className="flex flex-col p-2 gap-2">
                    <h1 className=" text-2xl text-red-400 font-bold">
                      Reviews
                    </h1>
                    <div className="grid grid-cols-2 gap-2 max-lg:flex max-lg:flex-col">
                      {!showAll
                        ? data?.reviews.slice(0, 2).map((reviewId) => {
                            return (
                              <Reviews key={reviewId} reviewId={reviewId} />
                            );
                          })
                        : data?.reviews.map((reviewId) => {
                            return (
                              <Reviews key={reviewId} reviewId={reviewId} />
                            );
                          })}
                    </div>
                    {data?.reviews?.length > 0 && (
                      <span
                        className=" text-center cursor-pointer mt-2"
                        onClick={() => setShowAll(!showAll)}
                      >
                        {showAll ? "show less" : "show more"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {data?.type === "Hotel" && (
              <div className="flex flex-col w-[80vw] self-center p-2 gap-9">
                <h1 className=" text-center text-2xl text-red-400 font-bold">
                  Rooms
                </h1>
                {data?.rooms.length > 0 && <Rooms key={id} id={id} />}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};
