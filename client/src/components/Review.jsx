import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { StarRatingInput } from "./StarsToRating";

export const Review = ({ setAddReview, hotelId, name, type }) => {
  const { user } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (review === "") {
      setErr("please write your reviwe first");
      const errorTime = setTimeout(() => {
        setErr("");
      }, 3000);
      return () => clearTimeout(errorTime);
    } else if (rating === 0) {
      setErr("Please Add Your Rating");
      const errorTime = setTimeout(() => {
        setErr("");
      }, 2000);
      return () => clearTimeout(errorTime);
    } else {
      try {
        const res = await axios.post(
          `https://itravel-apis.vercel.app/api/reviews/${user._id}/${hotelId}`,
          {
            content: review,
            rating,
          }
        );
        if (res.data.msg === "Success") {
          setMsg("thanks for your Review");
          const errorTime = setTimeout(() => {
            setMsg("");
            navigate("/");
          }, 3000);
          return () => clearTimeout(errorTime);
        }
      } catch (error) {
        setErr("something went wrong please try again later");
        const errorTime = setTimeout(() => {
          setErr("");
        }, 3000);
        return () => clearTimeout(errorTime);
      }
    }
  };
  return (
    <div className="fixed top-[18%] w-[40%] bg-gray-700 z-50 flex flex-col rounded-xl items-center gap-5 min-w-[400px] max-md:top-[12%]">
      <FontAwesomeIcon
        className=" self-end p-2 bg-red-400 rounded-bl-xl rounded-tr-xl text-xl text-white cursor-pointer hover:bg-red-500"
        onClick={() => {
          setReview("");
          setRating(0);
          setAddReview(false);
        }}
        icon={faXmark}
      />
      {msg && (
        <span className=" text-center text-green-600 text-lg">{msg}</span>
      )}
      <h1 className="text-center text-3xl font-semibold text-white">
        Review For {name} {type}
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
      {err && <span className=" text-center text-red-500 text-lg">{err}</span>}
    </div>
  );
};
