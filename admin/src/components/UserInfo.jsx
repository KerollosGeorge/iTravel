import { useLocation } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Loading } from "./Loading";
import { Chart } from "./Chart";

export const UserInfo = () => {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const { data, loading, error } = useFetch(
    `https://itravel-apis.vercel.app/api/user/${userId}`
  );
  if (loading) {
    return <Loading />;
  } else if (!data) {
    return <div>There is no User with this ID {userId}</div>;
  } else {
    return (
      <div className="w-fit max-w-[1250px]">
        <div className="w-full flex gap-3  mt-4 ">
          {/* max-lg:w-fit max-lg:flex-col */}{" "}
          {/* if there is no user transiction */}
          <div className="p-[30px] shadow-lg shadow-[gray] rounded-md min-w-[520px] m-3 flex flex-col gap-4 h-[400px] max-lg:w-max">
            <span className="text-3xl font-bold">User Information</span>
            <div className=" min-w-max pl-7 flex flex-col gap-3">
              <h1 className="text-2xl font-semibold">
                {data.firstName} {data.lastName}{" "}
              </h1>
              <p className=" text-lg font-normal">Email : {data?.email}</p>
              <p className=" text-lg font-normal">Phone : {data?.phone}</p>
              <p className=" text-lg font-normal">
                Address : {data?.address} {data?.city}
              </p>
              <p className=" text-lg font-normal">Country : {data?.country}</p>
              <p className=" text-lg font-normal">Role : {data?.role}</p>
              <p className=" text-lg font-normal">
                Number of Reviews : {data?.reviews?.length}
              </p>
            </div>
          </div>
          <Chart aspect={3 / 1} title="User Spending (last 6 Months)" />
        </div>
      </div>
    );
  }
};
