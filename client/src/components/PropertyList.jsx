import React, { useContext } from "react";
import useFetch from "../hooks/useFetch";
import { darkModeContext } from "../context/DarkMoodContext";

export const PropertyList = () => {
  const { data, loading } = useFetch(
    "http://localhost:8000/api/hotels/countByType"
  );
  const images = [
    "../images/propertyList/hotel.jpg",
    "../images/propertyList/apartment.jpg",
    "../images/propertyList/resort.jpg",
    "../images/propertyList/villa.jpg",
    "../images/propertyList/cabine.jpg",
  ];
  const { darkMode } = useContext(darkModeContext);
  return (
    <div className="w-[70%] mt-[30px]">
      {loading
        ? "Loading..."
        : data.length > 0 && (
            <div className="flex flex-col gap-2 mt-9">
              <h1 className="text-3xl p-1">Property List</h1>
              <div className="flex gap-4 p-2 max-md:flex max-md:flex-col ">
                {data &&
                  images.map((img, i) => (
                    <div
                      className={
                        darkMode
                          ? " bg-[rgb(31,31,31)] text-[rgb(210, 210, 210)] shadow-lg min-w-[100px] "
                          : "shadow-lg min-w-[100px] "
                      }
                      key={i}
                    >
                      <img
                        src={img}
                        className="w-[200px] h-[200px] object-cover rounded-md max-md:h-[200px] max-md:w-full"
                      />
                      <div className="p-1">
                        <h1>{data[i]?.type}</h1>
                        <h2 className="lowercase">
                          {data[i]?.count} {data[i]?.type}s
                        </h2>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
    </div>
  );
};
