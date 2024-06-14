import { useContext, useEffect, useState } from "react";
import { StarRating } from "./StarsRating";
import axios from "axios";
import useFetch from "../hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faLocationDot,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const Hotels = ({ item, options, dates, city }) => {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useFetch(
    `https://itravel-apis.vercel.app/api/hotels/reviews/${item?._id}`
  );

  const [reviewData, setReviewData] = useState([]);
  const [openReview, setOpenReviews] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const getImageSource = (photo) => {
    if (!photo) return;
    return photo.startsWith("http")
      ? photo
      : `https://itravel-apis.vercel.app/Images/${photo}`;
  };
  useEffect(() => {
    if (user) {
      const Favorite = async () => {
        const res = await axios.get(
          `https://itravel-apis.vercel.app/api/user/favorite/${user._id}`
        );
        const newFavorite = res.data?.some((id) => item?._id === id);
        setFavorite(newFavorite);
      };
      Favorite();
    }
    if (data) {
      const fetchData = async () => {
        try {
          const reviewsData = await Promise.all(
            data.map(async (item) => {
              const userResponse = await axios.get(
                `https://itravel-apis.vercel.app/api/reviews/${item?._id}`
              );
              return { review: item, user: userResponse.data };
            })
          );
          setReviewData(reviewsData);
        } catch (err) {
          console.error(err.message);
        }
      };
      fetchData();
    }
  }, [data]);

  axios.defaults.withCredentials = true;
  const addFavorite = async (hotelId) => {
    const res = await axios.put(
      `https://itravel-apis.vercel.app/api/user/favorite/${user._id}/${hotelId}`
    );
    if (res.data.msg === "Added to Favorites") {
      setFavorite(true);
    } else if (res.data.msg === "removed from Favorites") {
      setFavorite(false);
    } else {
      console.log(error);
    }
  };

  return (
    <div className=" min-w-[550px] flex gap-4 border-2 border-gray-500 max-md:flex max-md:flex-col max-md:gap-0 max-md:min-w-full">
      <img
        crossorigin="anonymous"
        src={getImageSource(item?.photos?.[0])}
        alt={item?.HotelName}
        className="w-[350px]  max-2xl:w-[280px] h-[220px] object-cover p-2 max-md:w-full"
      />
      <div className="flex flex-col gap-2 p-1 w-[350px] max-2xl:w-[300px] max-md:p-2 max-md:w-[400px]">
        <h3 className=" font-semibold text-xl">{item?.HotelName}</h3>
        <span className="flex gap-1 text-sm">
          {<StarRating rating={item?.rating} />} {item?.rating} Stars{" "}
          {item?.type}
        </span>
        <p>
          <FontAwesomeIcon icon={faLocationDot} /> {item?.city}, {item?.country}
        </p>
        {openReview && (
          <span>
            {reviewData.map((reviewItem, index) => (
              <div key={index} className="flex gap-1 items-center">
                <span className="text-md">
                  {reviewItem.user?.firstName}
                  {reviewItem.user?.lastName}:
                </span>
                <p className="text-sm">"{reviewItem?.review?.content}"</p>
                <p className="text-sm">{reviewItem?.review?.rating}</p>
                {/*                 <div className="flex gap-1 items-center">
                  <StarRating rating={reviewItem.review?.rating} />
                </div> */}
              </div>
            ))}
          </span>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenReviews(!openReview)}
            className="border-[1px] border-gray-500 text-sm py-[1px] px-1"
          >
            {openReview ? (
              <FontAwesomeIcon icon={faArrowUp} />
            ) : (
              <FontAwesomeIcon icon={faArrowDown} />
            )}
          </button>
          <div className="w-full flex items-center gap-28">
            <span> {reviewData.length} reviews</span>
            <span className="text-blue-600  text-xl drop-shadow-lg">
              {item?.cheapestPrice}$/night
            </span>
          </div>
        </div>

        <div className="w-full flex items-center gap-3 mt-8">
          <FontAwesomeIcon
            icon={faHeart}
            className={
              !favorite
                ? "px-2 py-1 border-[1px] border-gray-500 cursor-pointer hover:scale-[1.1] transition-all mt-8"
                : "px-2 py-1 border-[1px] border-gray-500 cursor-pointer hover:scale-[1.1] transition-all text-red-700 mt-8"
            }
            onClick={() => addFavorite(item?._id)}
          />
          <Link
            to={`/hotels/${item?._id}/${options.adult + options.children}`}
            state={{ searchData: { item, options, dates, city } }}
            className="w-[90%] bg-blue-700 text-white p-[2px] hover:bg-blue-600 hover:scale-[1.04] transition-all text-center gap-3 mt-8"
          >
            <button>View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
