import React, { useContext, useState } from "react";
import useFetch from "../hooks/useFetch"; // Importing useFetch custom hook
import { Link, useNavigate } from "react-router-dom";
import { darkModeContext } from "../context/DarkMoodContext";
import { Loading } from "./Loading";
import { SearchContext } from "../context/SearchContext";

// Rooms component receives id and max as props
export const Rooms = ({ id, max, searchData }) => {
  // Initialize state to keep track of whether to show rooms or not
  const [showRooms, setShowRooms] = useState(false);

  const getImageSource = (photo) => {
    if (!photo) return;
    return photo.startsWith("http")
      ? photo
      : `https://itravel-apis.vercel.app/Images/${photo}`;
  };
  // Using useFetch hook to fetch data from the API
  // بدل كده ممكن نجيب الداتا عادي وبعدين نعمل اراي فاضيه و نعمل تشيك علي الماكس ف الداتا ولو اقل او يساوي نضيفه ف الاراي و فالاخر نعرض الاراي دي
  const { data, loading, error } = useFetch(
    `https://itravel-apis.vercel.app/api/hotels/room/${id}?max=${max}&roomNumbers=${searchData?.options?.room}`
  );
  const { darkMode } = useContext(darkModeContext);

  // If the data message is "first", it means that the data has been fetched successfully
  if (data.msg === "first") {
    // If there are no rooms in the sortedRooms array, display a message indicating that there are no rooms available for the given number of people
    if (data.sortedRooms?.length === 0 && max > 0) {
      return (
        <p className=" ml-[14%] mb-2">sorry, there is no available rooms</p>
      );
    }

    // If there are rooms in the sortedRooms array, map through them and display their titles
    return (
      <div className="w-[80%] self-center items-center grid grid-cols-3 gap-4 max-xl:grid max-xl:grid-cols-2 max-lg:w-[85%] max-md:flex max-md:flex-col max-md:justify-center max-md:items-center">
        {loading ? (
          <Loading />
        ) : error ? (
          <p className=" ml-[14%] mb-2">sorry, there is no available rooms</p>
        ) : (
          <>
            {data?.sortedRooms?.map((room) => {
              return (
                <div
                  key={room?._id}
                  className={
                    darkMode
                      ? "w-full bg-[rgb(44,43,43)] flex flex-col min-w-[250px]  p-1 border-[1px] border-gray-500 min-h-[300px] max-md:w-full"
                      : "w-full bg-rose-100 flex flex-col min-w-[250px]  p-1 border-[1px] border-gray-500 min-h-[300px] max-md:w-full"
                  }
                >
                  <img
                    crossorigin="anonymous"
                    src={getImageSource(room?.photos?.[0])}
                    alt={room?.title}
                    className="w-full h-[180px] rounded-md "
                  />
                  <div className="flex flex-col ml-1">
                    <h3>{room?.title}</h3>
                    <div className="flex flex-col">
                      <p className="text-sm">
                        for {room?.maxPeople}{" "}
                        {room?.maxPeople > 1 ? "Persons" : "person"}
                      </p>
                      <span className="text-lg text-blue-500">
                        {room?.price}$
                        <span className=" text-sm ">(Per Night)</span>
                      </span>
                    </div>
                    <Link
                      to={`/room/${room?._id}`}
                      state={{ searchData: searchData }}
                      className=" self-center bg-red-400 text-white rounded-md px-3 py-[4px] cursor-pointer mt-3 hover:bg-red-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  }

  // If the data message is not "first", it means that the data has not been fetched yet
  // Display a message asking the user to select from the rooms
  // and a button to show the rooms
  return (
    <div className="w-full flex flex-col gap-3 mt-[-20px]">
      {loading ? (
        <Loading />
      ) : (
        <>
          <p className="ml-[14%] mb-2">
            Select from our Rooms{" "}
            <span
              className="text-sm cursor-pointer text-blue-700"
              onClick={() => setShowRooms(!showRooms)}
            >
              show rooms...
            </span>
          </p>
          {showRooms && (
            <div className="w-[80%] self-center grid grid-cols-3 gap-3 max-xl:grid max-xl:grid-cols-2 max-lg:w-[85%] max-md:flex max-md:flex-col max-md:justify-center max-md:items-center">
              {data?.map((room) => {
                return (
                  <div
                    key={room?._id}
                    className={
                      darkMode
                        ? "w-full bg-[rgb(44,43,43)] flex flex-col min-w-[250px]  p-1 border-[1px] border-gray-500 min-h-[300px] max-md:w-full"
                        : "w-full bg-rose-100 flex flex-col min-w-[250px]  p-1 border-[1px] border-gray-500 min-h-[300px] max-md:w-full"
                    }
                  >
                    <img
                      crossorigin="anonymous"
                      src={getImageSource(room?.photos?.[0])}
                      alt={room?.title}
                      className="w-full h-[180px] rounded-md "
                    />
                    <div className="flex flex-col ml-1">
                      <h3>{room?.title}</h3>
                      <p className="text-blue-500 text-sm">
                        for {room?.maxPeople}{" "}
                        {room?.maxPeople > 1 ? "Persons" : "person"}
                      </p>
                      <span className="text-lg text-blue-500">
                        {room?.price}$
                        <span className=" text-sm ">(Per Night)</span>
                      </span>
                      <Link
                        to={`/room/${room?._id}`}
                        state={{ searchData: searchData }}
                        className=" self-center bg-red-400 text-white rounded-md px-3 py-[4px] cursor-pointer mt-3 hover:bg-red-500"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
