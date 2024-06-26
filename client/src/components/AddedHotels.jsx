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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loading } from "./Loading";
import { Review } from "./Review";
import { darkModeContext } from "../context/DarkMoodContext";

export const AddedHotels = ({ id, setHotelsAdded }) => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(darkModeContext);
  const { data, loading, error } = useFetch(
    `https://itravel-apis.vercel.app/api/hotels/find/${id}`
  );
  const [reviewData, setReviewData] = useState([]);
  const [openReview, setOpenReviews] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [err, setErr] = useState();
  const [msg, setMsg] = useState();
  const navigate = useNavigate();
  const getImageSource = (photo) => {
    if (!photo) return;
    return photo.startsWith("http")
      ? photo
      : `https://itravel-apis.vercel.app/Images/${photo}`;
  };
  useEffect(() => {
    if (data && data.length > 0) {
      const fetchData = async () => {
        try {
          const reviewsData = await Promise.all(
            data?.reviews?.map(async (item) => {
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
  }, [data, id, user]);
  axios.defaults.withCredentials = true;
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `https://itravel-apis.vercel.app/api/hotels/${user._id}/${id}`
      );
      setMsg(res.data);
      setHotelsAdded((prev) => prev.filter((item) => item !== id));
      const msgTime = setTimeout(() => {
        setMsg("");
        setIsOpen(false);
        window.location.reload();
      }, 2000);
      return () => clearTimeout(msgTime);
    } catch (err) {
      setErr(err.response.data.message);
      const errTime = setTimeout(() => {
        setErr("");
        setIsOpen(false);
      }, 2000);
      return () => clearTimeout(errTime);
    }
  };
  return (
    <>
      {data && (
        <div className="w-full flex items-center">
          {loading ? (
            <Loading />
          ) : (
            <div className=" min-w-[650px] flex  shadow-md shadow-[gray] gap-4 border-2 border-gray-500 max-md:flex max-md:flex-col max-md:gap-0 max-md:min-w-full">
              <img
                crossorigin="anonymous"
                src={getImageSource(data?.photos?.[0])}
                alt={data?.HotelName}
                className="w-[300px] h-[220px] object-cover p-2 max-md:w-full"
              />
              <div className=" relative flex flex-col gap-2 p-1 w-[330px] max-md:p-2">
                <h3 className=" font-semibold text-xl">{data?.HotelName}</h3>
                <span className="flex gap-1 text-sm">
                  {<StarRating rating={data?.rating} />} {data?.rating} Stars{" "}
                  {data?.type}
                </span>
                <p>
                  <FontAwesomeIcon icon={faLocationDot} /> {data?.city},{" "}
                  {data?.country}
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
                      </div>
                    ))}
                  </span>
                )}
                <div className="flex items-center gap-2 ">
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
                      {data?.cheapestPrice}$/night
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-around mt-8">
                  <button
                    onClick={() => navigate(`/hotels/${id}`)}
                    className=" border-dashed border-[1px] border-[#4040ff] rounded-md py-1 px-2 text-blue-700 text-center hover:bg-blue-700  hover:text-white hover:transition-all transition-all"
                  >
                    View
                  </button>

                  <button
                    onClick={() => navigate(`/hotels/edit/${id}`)}
                    className=" border-dashed border-[1px] border-[#59ff40] rounded-md py-1 px-2 text-green-700 text-center hover:bg-green-700  hover:text-white hover:transition-all transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setIsOpen(true)}
                    className=" border-dashed border-[1px] border-[#e83737] rounded-md py-1 px-2 text-red-700 text-center hover:bg-red-600 hover:text-white hover:transition-all transition-all"
                  >
                    Delete
                  </button>
                </div>
                {isOpen && (
                  <div className=" absolute top-[20%] left-[-70%] z-10 w-[500px] opacity-100 bg-[#cdcdcd] p-2 rounded-lg flex flex-col ">
                    <p
                      className={
                        darkMode
                          ? " w-full text-center mb-[30px] font-semibold text-2xl text-black"
                          : " w-full text-center mb-[30px] font-semibold text-2xl"
                      }
                    >
                      Are You Sure
                    </p>
                    <div className="w-full flex justify-around">
                      <button
                        onClick={() => handleDelete()}
                        className="  border-[1px] border-[#737373] rounded-md py-1 px-2 text-white text-center bg-red-600 hover:scale-[1.08] hover:transition-all transition-all"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setIsOpen(false)}
                        className=" border-[1px] border-[#737373] rounded-md py-1 px-2 text-white text-center bg-green-700  hover:scale-[1.08] hover:transition-all transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                    {err && (
                      <span className="w-full text-red-600 text-center self-center mt-5">
                        {err}
                      </span>
                    )}
                    {msg && (
                      <span className="w-full text-green-600 text-center self-center mt-5">
                        {msg}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}{" "}
    </>
  );
};

export default AddedHotels;
