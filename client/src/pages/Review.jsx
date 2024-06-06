import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export const Review = () => {
  const { user } = useContext(AuthContext);
  const { hotelId } = useParams();

  const [review, setReview] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleClick = async (e) => {
    e.preventDefault();
    if (review === "") {
      setErr("please write your reviwe first");
      const errorTime = setTimeout(() => {
        setErr("");
      }, 3000);
      return () => clearTimeout(errorTime);
    } else {
      try {
        const res = await axios.post(
          `http://localhost:8000/api/reviews/${user._id}/${hotelId}`,
          review
        );
        if (res.data.msg === "Success") {
          setMsg("thank you for your review");
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
    <div className="flex flex-col w-full justify-center items-center">
      <textarea
        name="review"
        id="review"
        cols="30"
        rows="10"
        placeholder="Write your Review here"
        onChange={(e) => setReview(e.target.value)}
      ></textarea>
      <button onClick={handleClick}>Submit</button>
    </div>
  );
};
