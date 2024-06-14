import { useLocation } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { Loading } from "../components/Loading";

export const Review = () => {
  const location = useLocation();
  const reviewId = location.pathname.split("/")[2];
  const { data, loading, error } = useFetch(
    `https://itravel-apis.vercel.app/api/reviews/review/${reviewId}`
  );

  return (
    <div className=" w-full flex">
      <Sidebar />
      <div className="flex">
        <div className="w-[.5px] h-full bg-[#999]"></div>
        <div className=" w-full gap-2 min-w-[80vw]">
          <Navbar />
          {loading ? (
            <div className=" w-full flex justify-center">
              <Loading />
            </div>
          ) : !data || data.length === 0 ? (
            <div>There is no Review with this ID {reviewId}</div>
          ) : (
            <div className="w-[80vw]">
              <div className="p-[30px] shadow-lg shadow-[gray] rounded-md min-w-[450px] ml-5 mt-3 flex flex-col gap-4 h-[300px] ">
                <span className="text-3xl font-bold">Review Information</span>
                <div className=" min-w-max pl-7 flex flex-col gap-3">
                  <p className=" text-lg font-normal">
                    User : {data?.user?.firstName} {data?.user?.lastName}
                  </p>
                  <p className=" text-lg font-normal capitalize">
                    Review For :{data?.hotel?.HotelName} {data?.review.type}
                  </p>
                  <p className=" text-lg font-normal">
                    Rating : {data?.review?.rating}
                  </p>
                  <p className=" text-lg font-normal">
                    Comment : {data?.review?.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
