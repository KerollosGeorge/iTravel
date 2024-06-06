import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { darkModeCotext } from "../context/DarkMoodContext";
import { Sidebar } from "../components/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import useFetch from "../hooks/useFetch";
import { Loading } from "../components/Loading";

export const NewRoom = () => {
  const [images, setImages] = useState("");
  const [urlImages, setUrlImages] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(undefined);
  const [maxpeople, setMaxPeople] = useState(undefined);
  const [desc, setDesc] = useState("");
  const [rooms, setRooms] = useState([]);
  const [HotelName, setHotelName] = useState("");

  const { darkMode } = useContext(darkModeCotext);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const { data, loading, error } = useFetch(
    `http://localhost:8000/api/hotels?type=Hotel`
  );
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleClick = async (e) => {
    e.preventDefault();
    if (
      rooms === "" ||
      title === "" ||
      desc === "" ||
      maxpeople === "" ||
      price === "" ||
      HotelName === ""
    ) {
      setErr("Please Fill all Fields");
      const errorTime = setTimeout(() => {
        setErr("");
      }, 2000);
      return () => clearTimeout(errorTime);
    } else {
      try {
        const roomNumbersArray = Array.isArray(rooms)
          ? rooms
          : rooms?.length > 0
          ? rooms
              .split(",")
              .map((room) => ({ number: room, unavailableDates: [] }))
          : [];

        const formData = new FormData();
        if (images) {
          await Promise.all(
            Object.values(images).map((image) => {
              formData.append("image", image);
            })
          );
        }
        formData.append("urlImages", urlImages);
        formData.append("title", title);
        formData.append("price", price);
        formData.append("maxPeople", maxpeople);
        formData.append("desc", desc);
        formData.append("HotelName", HotelName);
        formData.append("roomNumbers", JSON.stringify(roomNumbersArray));
        const res = await axios.post(
          `http://localhost:8000/api/rooms`,
          formData,
          {
            headers: { "content-type": "multipart/form-data" },
          }
        );
        setMsg(res.data.msg);
        const timeout = setTimeout(() => {
          setMsg("");
          navigate("/rooms");
        }, 2000);
        return () => clearTimeout(timeout);
      } catch (err) {
        setErr(err.message);
        const errorTime = setTimeout(() => {
          setErr("");
        }, 3000);
        return () => clearTimeout(errorTime);
      }
    }
  };

  return (
    <div className=" w-[98vw] flex min-w-max">
      <Sidebar />
      <div className="flex w-full">
        <div className="w-[.5px] h-full bg-[#999]"></div>
        <div
          className={
            darkMode
              ? " w-full flex flex-col gap-5 items-center bg-[#111]"
              : " w-full flex flex-col gap-5 items-center "
          }
        >
          <Navbar />
          <h2 className="text-3xl w-full flex text-start p-2 pl-5 shadow-md shadow-[gray]">
            Add New Room
          </h2>
          <form
            className={
              darkMode
                ? "relative w-[1200px] flex flex-col min-w-[400px]  ml-6 mb-4 max-sm:h-[600px] bg-[#111] shadow-xl shadow-[gray] space-y-[30px] max-sm:space-y-[25px] p-5 rounded-md"
                : "relative w-[1200px] flex flex-col min-w-[400px]  ml-6 mb-4 max-sm:h-[600px] bg-white shadow-lg shadow-[gray] space-y-[30px] max-sm:space-y-[25px] p-5 rounded-md"
            }
          >
            <div className="w-full flex justify-around">
              <div className="flex flex-col items-center gap-4">
                <img
                  className=" w-[150px] h-[150px] rounded-[50%] border-[2px] border-[gray] text-center"
                  src={
                    images && images.length > 0
                      ? URL.createObjectURL(images?.[0])
                      : urlImages && urlImages.length > 0
                      ? urlImages?.split(",")?.[0]
                      : "../images/no_image.jpg"
                  }
                  alt="hotel images"
                  crossorigin="anonymous"
                />
                <label htmlFor="file" className=" ml-1 mb-1">
                  images:{" "}
                  <DriveFolderUploadOutlinedIcon className=" cursor-pointer" />
                </label>
                <input
                  type="file"
                  name="file"
                  id="file"
                  onChange={(e) => {
                    //this is the main problem if we path e.target.files it will be object of objects not array of objects
                    setImages(Array.from(e.target.files));
                  }}
                  multiple
                  style={{ display: "none" }}
                />
                <h1>OR</h1>
                <input
                  type="text"
                  name="text"
                  id="urlImage"
                  placeholder="give a comma between each link"
                  onChange={(e) => {
                    //this is the main problem if we path e.target.files it will be object of objects not array of objects
                    setUrlImages(e.target.value);
                  }}
                  className="w-[200px] border-[2px] border-[gray] p-2 flex flex-wrap text-nowrap h-max cursor-pointer overflow-wrap break-words"
                />
              </div>
              <div className=" grid grid-cols-2 gap-4 ">
                <div className="flex flex-col w-full">
                  <label htmlFor="title" className=" ml-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Efficiency"
                    className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="price" className=" ml-1">
                    Price: $
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    placeholder="1200"
                    className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="maxpeople" className=" ml-1">
                    MaxPeople
                  </label>
                  <input
                    type="number"
                    name="maxpeople"
                    id="maxpeople"
                    placeholder="2"
                    className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                    onChange={(e) => {
                      setMaxPeople(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="rooms" className=" ml-1">
                    Room Numbers
                  </label>
                  <input
                    type="text"
                    name="rooms"
                    id="rooms"
                    placeholder="give comma between room numbers. ex: 3,4...."
                    className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]  "
                    onChange={(e) => {
                      setRooms(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="flex flex-col w-full ">
                  <label htmlFor="desc" className=" ml-1 mb-1">
                    Description
                  </label>
                  <textarea
                    name="desc"
                    id="desc"
                    rows="5"
                    placeholder="room description"
                    className=" w-[380px] border-2 border-[gray] focus:scale-[1.01] indent-[7px] placeholder:text-[#787878] bg-transparent"
                    onChange={(e) => {
                      setDesc(e.target.value);
                    }}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="HotelName" className="text-sm">
                    Hotel Name
                  </label>
                  <select
                    id="HotelName"
                    name="HotelName"
                    className=" h-8 rounded-sm outline-none indent-1 bg-transparent border-[2px] border-[gray]"
                    onChange={(e) => setHotelName(e.target.value)}
                  >
                    {loading ? (
                      <Loading />
                    ) : error ? (
                      setErr(error)
                    ) : (
                      <>
                        <option
                          value="default"
                          className={darkMode && "bg-[#222]"}
                        >
                          Select a hotel...
                        </option>
                        {data.map((hotel, i) => (
                          <option
                            value={hotel.HotelName}
                            key={data._id}
                            className={darkMode && "bg-[#222]"}
                          >
                            {hotel.HotelName}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <button
                onClick={handleClick}
                className="w-50 bg-blue-600 text-lg px-3 py-1 rounded-md text-white cursor-pointer self-center hover:bg-blue-700 hover:scale-105"
              >
                Send
              </button>
              {err && (
                <span className=" absolute text-center text-red-600 text-sm top-0 self-center bg-[#e1e1e1] p-2 rounded-md">
                  {err}
                </span>
              )}
              {msg && (
                <span className=" absolute text-center text-green-600 text-sm top-0 self-center bg-[#e1e1e1] p-2 rounded-md">
                  {msg}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
