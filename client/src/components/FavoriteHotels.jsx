import useFetch from "../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import { StarRating } from "./StarsRating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faLocationDot,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { Loading } from "./Loading";

export const FavoriteHotels = ({ id }) => {
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useFetch(
    `https://itravel-apis.vercel.app/api/hotels/find/${id}`
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
    const Favorite = async () => {
      setFavorite(id);
    };
    Favorite();
    if (data) {
      const fetchData = async () => {
        try {
          const reviewsData = await Promise.all(
            data?.reviews.map(async (item) => {
              const Reviews = await axios.get(
                `https://itravel-apis.vercel.app/api/reviews/review/${item}`
              );
              return { review: Reviews.data };
            })
          );
          setReviewData(reviewsData);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, [data]);
  axios.defaults.withCredentials = true;
  const addFavorite = async () => {
    const res = await axios.put(
      `https://itravel-apis.vercel.app/api/user/favorite/${user._id}/${data._id}`
    );
    if (res.data.msg === "Added to Favorites") {
      setFavorite(true);
    } else if (res.data.msg === "removed from Favorites") {
      setFavorite(false);
      window.location.reload();
    } else {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex items-center">
      {loading ? (
        <Loading />
      ) : (
        <div className=" min-w-[650px] flex  shadow-md shadow-[gray] gap-4 border-2 border-gray-500 max-md:flex max-md:flex-col max-md:gap-0 max-md:min-w-full">
          <img
            crossorigin="anonymous"
            src={getImageSource(data?.photos?.[0])}
            alt={data.HotelName}
            className="w-[300px] h-[220px] object-cover p-2 max-md:w-full"
          />
          <div className="flex flex-col gap-2 p-1 w-[330px] max-md:p-2">
            <h3 className=" font-semibold text-xl">{data.HotelName}</h3>
            <span className="flex gap-1 text-sm">
              {<StarRating rating={data.rating} />} {data.rating} Stars{" "}
              {data.type}
            </span>
            <p>
              <FontAwesomeIcon icon={faLocationDot} /> {data.city},{" "}
              {data.country}
            </p>
            {openReview && (
              <span>
                {reviewData.map((reviewData, index) => (
                  <div key={index} className="flex gap-1 items-center">
                    <span className="text-md">
                      {reviewData.review?.user?.firstName}
                      {reviewData.review?.user?.lastName}:
                    </span>
                    <p className="text-sm">
                      "{reviewData.review?.review?.content}"
                    </p>
                    <p className="text-sm">
                      {reviewData.review?.review?.rating}
                    </p>
                    {/*                 <div className="flex gap-1 items-center">
                <StarRating rating={reviewData.review?.rating} />
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
                  {data.cheapestPrice}$/night
                </span>
              </div>
            </div>
            <div className="w-full flex flex-col gap-3 mt-5">
              <FontAwesomeIcon
                icon={faHeart}
                className={
                  !favorite
                    ? "w-[20px] px-2 py-1 border-[1px] border-gray-500 cursor-pointer hover:scale-[1.1] transition-all "
                    : "w-[20px] px-2 py-1 border-[1px] border-gray-500 cursor-pointer hover:scale-[1.1] transition-all text-red-700 "
                }
                onClick={() => addFavorite()}
              />

              {/*               <Link
                to={`/hotels/${data._id}/1`}
                className="w-[90%] bg-blue-700 text-white p-[2px] hover:bg-blue-600 hover:scale-[1.04] transition-all text-center gap-3"
              >
                <button>View Details</button>
              </Link> */}
            </div>{" "}
            <p className=" cursor-pointer">Add Review</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoriteHotels;
