import { useContext, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import useFetch from "../hooks/useFetch";
import { Hotels } from "../components/Hotels";
import { Footer } from "../components/Footer";
import { darkModeContext } from "../context/DarkMoodContext";
import { Loading } from "../components/Loading";
import axios from "axios";

export const AllHotels = () => {
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });

  const { darkMode } = useContext(darkModeContext);

  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);
  const [showMore, setshowMore] = useState(false);
  const [type, setType] = useState("Hotel");
  const { data, loading, error, reFetch } = useFetch(
    `https://itravel-apis.vercel.app/api/hotels?type=${type}&min=${
      min || 0
    }&max=${max || 99999}`
  );

  const [dataSet, setDataSet] = useState([]);

  useEffect(() => {
    if (destination.length > 0) {
      axios
        .get(
          `https://itravel-apis.vercel.app/api/hotels?city=${destination}&type=${type}&min=${
            min || 0
          }&max=${max || 999}`
        )
        .then((res) => setDataSet(res.data));
    } else {
      setDataSet(data);
    }
  }, [destination, min, max, type, data]);
  const handleClick = async () => {
    reFetch();
  };

  return (
    <div className="flex flex-col gap-[50px] w-full items-center min-w-max">
      <Navbar />

      <div className="flex w-[90%] gap-[150px] max-xl:gap-[50px] justify-start max-lg:flex max-lg:flex-col max-lg:gap-7 max-lg:items-center max-lg:w-full">
        <div
          className={
            darkMode
              ? " bg-slate-800 rounded-lg flex flex-col p-4 gap-4 h-full mt-6  mb-3 ml-[5%] max-md:mt-0 max-md:ml-0"
              : " bg-yellow-500 rounded-lg flex flex-col p-4 gap-4 h-full mt-6  mb-3 ml-[5%] max-md:mt-0 max-md:ml-0"
          }
        >
          <h1 className="text-2xl font-semibold">Search</h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="dest" className="text-sm">
              Destination
            </label>
            <input
              type="text"
              name="dest"
              id="dset"
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where You want to go!"
              className={
                darkMode
                  ? "w-[250px] h-8 rounded-sm outline-none indent-1 !text-black !bg-slate-300 placeholder-black"
                  : "w-[250px] h-8 rounded-sm outline-none indent-1 !text-black !bg-white"
              }
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="type" className="text-sm">
              Type
            </label>
            <select
              id="type"
              name="type"
              className={
                darkMode
                  ? "w-[250px] h-8 rounded-sm outline-none indent-1 !text-black !bg-slate-300"
                  : "w-[250px] h-8 rounded-sm outline-none indent-1 !text-black !bg-white"
              }
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Hotel">Hotel</option>
              <option value="Apartment">Apartment</option>
              <option value="Resort">Resort</option>
              <option value="Villa">Villa</option>
              <option value="Cabin">Cabin</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="dest" className="text-sm">
              Check-in-Date
            </label>
            <span
              onClick={() => setOpenDate(!openDate)}
              className={
                darkMode
                  ? " cursor-pointer !bg-slate-300 p-2 !text-black"
                  : " cursor-pointer bg-white p-2 !text-gray-500 "
              }
            >
              {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
                date[0].endDate,
                "MM/dd/yyyy"
              )}`}
            </span>
            {openDate && (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDate([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={date}
                minDate={new Date()}
                className="top-[40px] left-0 z-10bg-white shadow-lg max-md:absolute max-md:left-[-30%]"
              />
            )}
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-sm">Options:</label>
            <div className="w-90% flex justify-between ">
              <p className="text-sm flex items-center gap-1">
                Min Price <span className=" text-[12px]"> per nights</span>
              </p>
              <input
                type="number"
                onChange={(e) => setMin(e.target.value)}
                placeholder="100"
                className="w-[60px] border-gray-700 border indent-1"
              />
            </div>
            <div className="w-90% flex justify-between ">
              <p className="text-sm flex items-center gap-1">
                Max Price <span className=" text-[12px]"> per nights</span>
              </p>
              <input
                type="number"
                onChange={(e) => setMax(e.target.value)}
                placeholder="999"
                className="w-[60px] border-gray-700 border indent-1"
              />
            </div>
            <div className="w-90% flex justify-between ">
              <span className="text-sm">Adult</span>
              <input
                type="number"
                min={1}
                placeholder={options.adult}
                onChange={(e) =>
                  e.target.value === ""
                    ? setOptions({
                        children: options.children,
                        adult: options.adult,
                        room: options.room,
                      })
                    : e.target.value <= 0
                    ? (e.target.value = 0)
                    : setOptions({
                        adult: parseInt(e.target.value),
                        children: options.children,
                        room: options.room,
                      })
                }
                className="w-[60px] border-gray-700 border indent-1"
              />
            </div>
            <div className="w-90% flex justify-between ">
              <span className="text-sm">Children</span>
              <input
                type="number"
                min={0}
                placeholder={options.children}
                onChange={(e) =>
                  e.target.value === ""
                    ? setOptions({
                        children: options.children,
                        adult: options.adult,
                        room: options.room,
                      })
                    : e.target.value <= 0
                    ? (e.target.value = 0)
                    : setOptions({
                        children: parseInt(e.target.value),
                        adult: options.adult,
                        room: options.room,
                      })
                }
                className="w-[60px] border-gray-700 border indent-1"
              />
            </div>
            <div className="w-90% flex justify-between ">
              <span className="text-sm">Room</span>
              <input
                type="number"
                min={1}
                placeholder={options.room}
                onChange={(e) =>
                  e.target.value === ""
                    ? setOptions({
                        children: options.children,
                        adult: options.adult,
                        room: options.room,
                      })
                    : e.target.value <= 1
                    ? (e.target.value = 1)
                    : setOptions({
                        room: parseInt(e.target.value),
                        adult: options.adult,
                        children: options.children,
                      })
                }
                className="w-[60px] border-gray-700 border indent-1"
              />
            </div>
            <button
              onClick={handleClick}
              className="text-white p-2 rounded-sm bg-blue-600 hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </div>
        <div>
          {dataSet?.length === 0 && !error ? (
            <div className="text-2xl p-4">No Result Found</div>
          ) : loading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-5 p-4">
              <p className="font-semibold text-lg">
                Showing{" "}
                {!showMore
                  ? dataSet?.length < 4
                    ? dataSet?.length
                    : 4
                  : dataSet?.length}{" "}
                of {dataSet?.length}
              </p>

              {!showMore
                ? dataSet
                    .slice(0, 4)
                    .map((item) => (
                      <Hotels
                        item={item}
                        key={item._id}
                        options={options}
                        city={destination}
                        dates={date}
                      />
                    ))
                : dataSet.map((item) => (
                    <Hotels
                      item={item}
                      key={item._id}
                      options={options}
                      city={destination}
                      dates={date}
                    />
                  ))}
              <button
                onClick={() => {
                  setshowMore(!showMore);
                  showMore && window.scrollTo(0, 0);
                }}
                className="w-full bg-blue-700 text-white p-1 text-lg hover:bg-blue-600"
              >
                Show More Results
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};
