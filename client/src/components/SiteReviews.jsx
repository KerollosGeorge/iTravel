import { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import axios from "axios";
import { StarRating } from "./StarsRating";
import { darkModeContext } from "../context/DarkMoodContext";

export const SiteReviews = () => {
  const { data, loading, error } = useFetch(
    `https://itravel-apis.vercel.app/api/reviews/site?limit=3`
  );

  const [reviewData, setReviewData] = useState([]);
  const { darkMode } = useContext(darkModeContext);
  useEffect(() => {
    if (data) {
      const fetchData = async () => {
        try {
          const reviewsData = await Promise.all(
            data.map(async (item) => {
              const userResponse = await axios.get(
                `https://itravel-apis.vercel.app/api/reviews/${item._id}`
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
  return (
    <div className="w-[70%]">
      {loading ? (
        "Loading"
      ) : (
        <div className="flex flex-col gap-2 mt-9 mb-9">
          <h1 className="text-3xl p-1">Reviews</h1>
          <div className="grid grid-cols-3 gap-4 max-xl:flex max-xl:flex-col">
            {reviewData.map((reviewItem, index) => (
              <div
                key={index}
                className="w-full flex gap-3 flex-col shadow-md shadow-[gray] p-2"
              >
                <div className="flex gap-3 items-center ">
                  <button
                    className={
                      darkMode
                        ? "p-4 text-xl shadow-md rounded-[50%] bg-[rgb(32,32,32)] text-[rgb(210, 210, 210)] transition-all font-semibold uppercase"
                        : "p-4 text-xl shadow-md rounded-[50%] bg-indigo-700 bg-clip-text text-transparent transition-all font-semibold uppercase"
                    }
                  >
                    {reviewItem.user?.firstName[0]}
                    {reviewItem.user?.lastName[0]}
                  </button>
                  <span className="font-bold text-xl">
                    {reviewItem.user?.firstName} {reviewItem.user?.lastName}
                  </span>
                </div>
                <div className="flex flex-col ml-[75px] gap-4">
                  <p className="text-lg">{reviewItem.review.content}</p>
                  <div className=" flex gap-1 items-center">
                    <StarRating rating={reviewItem.review?.rating} />
                    <p className="text-lg">({reviewItem.review?.rating})</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
