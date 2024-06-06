import { useContext, useEffect, useState } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StarRatingInput } from "../components/StarsToRating";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export const ReviewUs = ({ open, setOpen }) => {
  const { user } = useContext(AuthContext);
  const [isReview, setIsReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) {
      //i need if the user has already reviewd before then this message willnot appear to him
      const checkReview = async () => {
        const SiteReviews = await axios.get(
          `http://localhost:8000/api/user/site/reviews/${user._id}`
        );
        if (SiteReviews.data?.length === 0 && open === false) {
          const Review = setTimeout(() => {
            setOpen(true);
          }, 1000 * 60 * 10);
          return () => clearTimeout(Review);
        }
      };
      checkReview();
    }
  }, [user]);
  const handleSubmit = async () => {
    if (!review) {
      setMsg("Please Add Review");
      const errorTime = setTimeout(() => {
        setMsg("");
      }, 2000);
      return () => clearTimeout(errorTime);
    } else if (rating === 0) {
      setMsg("Please Rate Us");
      const errorTime = setTimeout(() => {
        setMsg("");
      }, 2000);
      return () => clearTimeout(errorTime);
    } else {
      await axios.post(`http://localhost:8000/api/reviews/${user._id}`, {
        content: review,
        rating,
      });
      setIsReview(true);
      const Done = setTimeout(() => {
        setReview("");
        setRating(0);
        setIsReview(false);
        setOpen(false);
      }, 3000);
      return () => clearTimeout(Done);
    }
  };
  return (
    <>
      {open && !isReview ? (
        <div className="fixed top-[18%] w-[40%] bg-gray-700 z-50 flex flex-col rounded-xl items-center gap-5 min-w-[400px] max-md:top-[12%]">
          <FontAwesomeIcon
            className=" self-end p-2 bg-red-400 rounded-bl-xl rounded-tr-xl text-xl text-white cursor-pointer hover:bg-red-500"
            onClick={() => {
              setReview("");
              setRating(0);
              setOpen(false);
            }}
            icon={faXmark}
          />
          <h1 className="text-center text-3xl font-semibold text-white">
            Review Us
          </h1>
          <textarea
            name=""
            id=""
            rows="10"
            className=" bg-transparent text-white text-lg p-1 outline-none border-[1px] border-gray-400 w-[80%] resize-none"
            placeholder="Write Your Review and Thoughts here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          ></textarea>
          <StarRatingInput rating={rating} setRating={setRating} />
          <button
            className=" bg-red-400 py-2 px-4 mb-2 text-lg text-white rounded-md hover:bg-red-500"
            onClick={handleSubmit}
          >
            Submit
          </button>
          {msg && (
            <span className=" text-center text-red-500 text-lg">{msg}</span>
          )}
        </div>
      ) : (
        open && (
          <div className="fixed top-[18%] w-[40%] bg-gray-700 z-50 opacity-90 flex flex-col rounded-xl items-center gap-5 min-w-[400px] text-white text-center text-3xl p-4">
            Thanks For Reviewing Us
          </div>
        )
      )}
    </>
  );
};
