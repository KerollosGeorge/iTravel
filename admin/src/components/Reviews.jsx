import useFetch from "../hooks/useFetch";
import { Loading } from "./Loading";
import { StarRating } from "./StarsRating";

export const Reviews = ({ reviewId }) => {
  const { data, loading, error } = useFetch(
    `https://itravel-apis.vercel.app/api/reviews/review/${reviewId}`
  );
  return (
    <div>
      {loading ? (
        <Loading />
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <div className="w-full flex gap-5 flex-col shadow-md shadow-[gray] p-2">
          {
            <span>
              User: {data?.user?.firstName} {data?.user?.lastName}
            </span>
          }
          <span>Comment: {data?.review?.content}</span>
          <span className="flex gap-1 items-center">
            Rating:
            <StarRating rating={data?.review?.rating} /> ({" "}
            <span className=" text-sm">{data?.review?.rating}</span>)
          </span>
        </div>
      )}
    </div>
  );
};
