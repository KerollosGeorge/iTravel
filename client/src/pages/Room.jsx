import { Link, useLocation, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import {
  faCaretLeft,
  faCaretRight,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StarRating } from "../components/StarsRating";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Loading } from "../components/Loading";
import axios from "axios";

export const Room = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const { searchData } = location.state;
  const { data, loading } = useFetch(
    `https://itravel-apis.vercel.app/api/rooms/${roomId}`
  );
  const [start, setStart] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [item, setItem] = useState();
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
    axios
      .get(`https://itravel-apis.vercel.app/api/rooms/findHotel/${roomId}`)
      .then((response) => setItem(response.data?.[0]));
    if (start === data?.photos?.length) {
      setStart(data?.photos[0]);
    }
    if (start === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [start, roomId]);

  return (
    <div className="flex flex-col gap-4 ">
      <Navbar />
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col w-[60%] self-center">
          <div className=" relative w-full flex flex-col items-center">
            <img
              crossorigin="anonymous"
              src={getImageSource(data?.photos?.[start])}
              alt={data?.title}
              className="w-[800px] h-[450px] rounded-2xl max-lg:h-auto min-h-[450px] max-lg:max-h-[400px]"
            />
            <FontAwesomeIcon
              icon={faCaretRight}
              className=" absolute right-[30px] top-[50%] text-3xl text-red-500 py-[1px] px-[3px] cursor-pointer border-[1px] border-gray-400"
              onClick={Next}
            />
            <FontAwesomeIcon
              icon={faCaretLeft}
              className={
                !disabled
                  ? "absolute left-[30px] top-[50%] text-3xl text-red-500 py-[1px] px-[3px] cursor-pointer border-[1px] border-gray-400"
                  : "absolute left-[30px] top-[50%] text-3xl text-red-300 py-[1px] px-[3px] cursor-not-allowed border-[1px] border-gray-400"
              }
              onClick={Prev}
            />
          </div>

          <div className="flex flex-col gap-1 p-5">
            <h1 className="text-xl">{data?.title} </h1>
            <div>
              <h1 className="text-2xl text-red-400">Description</h1>
              <p className="pl-2">
                Room for {data.maxPeople}{" "}
                {data.maxPeople > 1 ? "Presons" : "person"}{" "}
              </p>
              <p className="pl-2">{data?.desc}</p>
            </div>
            {item !== undefined && (
              <Link
                to={`/payment/${roomId}`}
                state={{ searchData: searchData, item: item }}
                className="text-white text-lg w-[90%] bg-red-400 py-1 self-center cursor-pointer mt-3 hover:bg-red-500 text-center"
              >
                <button>Book Now</button>
              </Link>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
