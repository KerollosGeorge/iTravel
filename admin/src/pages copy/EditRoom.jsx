import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { darkModeCotext } from "../context/DarkMoodContext";
import { Sidebar } from "../components/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import useFetch from "../hooks/useFetch";
import { Loading } from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";

export const EditRoom = () => {
  const location = useLocation();
  const roomId = location.pathname.split("/")[3];
  const navigate = useNavigate();

  const [images, setImages] = useState("");
  const [urlImages, setUrlImages] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [maxPeople, setMaxPeople] = useState("");
  const [desc, setDesc] = useState("");
  const [rooms, setRooms] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [start, setStart] = useState(0);
  const { darkMode } = useContext(darkModeCotext);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [imagesArray, setImagesArray] = useState([]);
  const [imagesArrayCheck, setImagesArrayCheck] = useState([]);

  const { data, loading, error } = useFetch(
    `http://localhost:8000/api/rooms/${roomId}`
  );

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setPrice(data.price);
      setMaxPeople(data.maxPeople);
      setDesc(data.desc);
      if (data.roomNumbers) {
        setRooms(data.roomNumbers.map((room) => room.number).join(","));
      }
      setImagesArrayCheck(data.photos);
    }
  }, [data, loading]);

  axios.defaults.withCredentials = true;

  const handleClick = async (e) => {
    e.preventDefault();
    if (
      title === "" ||
      desc === "" ||
      maxPeople === "" ||
      price === "" ||
      rooms === ""
      /* imagesArray.length === 0 */
    ) {
      setErr("Please Fill all Fields or add some images");
      const errorTime = setTimeout(() => {
        setErr("");
      }, 2000);
      return () => clearTimeout(errorTime);
    } else if (
      title === data.title &&
      desc === data.desc &&
      maxPeople === data.maxPeople &&
      price === data.price &&
      rooms === data.roomNumbers.map((room) => room.number).join(",") &&
      imagesArrayCheck === data.photos
    ) {
      setErr("No Changes at data are detected!");
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
        formData.append("maxPeople", maxPeople);
        formData.append("desc", desc);
        formData.append("roomNumbers", JSON.stringify(roomNumbersArray));
        const res = await axios.put(
          `http://localhost:8000/api/rooms/${roomId}`,
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

  const getImageSource = (photo) => {
    if (!photo) return;
    return photo.startsWith("http")
      ? photo
      : `http://localhost:8000/Images/${photo}`;
  };
  const Next = () => {
    if (imagesArray.length > 0) {
      setStart((prevStart) => (prevStart + 1) % imagesArray.length);
    } else {
      setStart((prevStart) => (prevStart + 1) % (data?.photos?.length || 0));
      setDisabled(start === 0);
    }
  };

  const Prev = () => {
    if (start === 0) {
      return;
    } else if (imagesArray.length > 0) {
      setStart(
        (prevStart) => (prevStart - 1 + imagesArray.length) % imagesArray.length
      );
    } else {
      setStart(
        (prevStart) =>
          (prevStart - 1 + (data?.photos?.length || 0)) %
          (data?.photos?.length || 0)
      );
      setDisabled(start === 0);
    }
  };

  useEffect(() => {
    if (imagesArray.length > 0 && start === imagesArray.length) {
      setStart(0);
    }
    if (start === (data?.photos?.length || 0)) {
      setStart(0);
    }
    if (start === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [start, imagesArray, data?.photos?.length]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0 && data) {
      const filesArray = Array.from(e.target.files);
      if (data?.photos) {
        setImagesArray((prev) => [...prev, ...filesArray]);
      } else {
        setImagesArray((prev) => [...filesArray, ...prev]);
      }
    }
    // Set images only if data is not null or undefined
    setImagesArrayCheck([]);
    setImages(e.target.files);
  };

  const handleTextChange = (e) => {
    if (data) {
      if (e.target.value.trim() !== "") {
        const urls = e.target.value
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url.startsWith("http"));
        setImagesArray((prev) => [...urls, ...prev]);
      } else {
        setImagesArray([]);
      }
      setImagesArrayCheck([]);
      setUrlImages(e.target.value.split(","));
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
            Edit {title} Room
          </h2>
          {loading ? (
            <Loading />
          ) : (
            data && (
              <form
                className={
                  darkMode
                    ? "relative w-[1250px] flex flex-col min-w-[400px]  ml-6 mb-4 max-sm:h-[600px] bg-[#111] shadow-xl shadow-[gray] space-y-[30px] max-sm:space-y-[25px] p-2 rounded-md"
                    : "relative w-[1250px] flex flex-col min-w-[400px]  ml-6 mb-4 max-sm:h-[600px] bg-white shadow-lg shadow-[gray] space-y-[30px] max-sm:space-y-[25px] p-2 rounded-md"
                }
              >
                <div className="w-full flex justify-around gap-5 m-2">
                  <div className=" relative flex flex-col items-center gap-3">
                    {imagesArray[start] &&
                    typeof imagesArray[start] === "string" ? (
                      <img
                        crossOrigin="anonymous"
                        src={imagesArray[start]}
                        alt={data?.HotelName}
                        className="w-[400px] h-[315px] rounded-2xl"
                      />
                    ) : (
                      <img
                        crossOrigin="anonymous"
                        src={
                          imagesArray.length > 0
                            ? URL.createObjectURL(imagesArray[start])
                            : getImageSource(data?.photos?.[start])
                        }
                        alt={data?.HotelName}
                        className="w-[400px] h-[315px] rounded-2xl"
                      />
                    )}
                    <label htmlFor="file" className=" ml-1 mb-1">
                      images:{" "}
                      <DriveFolderUploadOutlinedIcon className=" cursor-pointer" />
                    </label>
                    <input
                      type="file"
                      name="file"
                      id="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />

                    <h1>OR</h1>
                    <input
                      type="text"
                      name="text"
                      id="urlImage"
                      placeholder="give a comma between each link"
                      onChange={handleTextChange}
                      className="w-[400px] rounded-md text-center border-[2px] border-[gray] p-2 flex flex-wrap text-nowrap h-max cursor-pointer overflow-wrap break-words"
                    />

                    <FontAwesomeIcon
                      icon={faCaretRight}
                      className=" absolute right-0 top-[30%] text-3xl text-red-500 py-[1px] px-[3px] cursor-pointer border-[1px] border-gray-400"
                      onClick={Next}
                    />

                    <FontAwesomeIcon
                      icon={faCaretLeft}
                      className={
                        !disabled
                          ? "absolute left-0 top-[30%] text-3xl text-red-500 py-[1px] px-[3px] cursor-pointer border-[1px] border-gray-400"
                          : "absolute left-0 top-[30%] text-3xl text-red-300 py-[1px] px-[3px] cursor-not-allowed border-[1px] border-gray-400"
                      }
                      onClick={Prev}
                    />
                  </div>
                  <div className=" w-full grid grid-rows-2 gap-4 place-items-center">
                    <div className=" grid grid-cols-2 gap-4 ">
                      <div className="flex flex-col w-full">
                        <label htmlFor="title" className=" ml-1">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          value={title}
                          className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
                          onChange={(e) => {
                            setTitle(e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label htmlFor="price" className=" ml-1">
                          Price: $
                        </label>
                        <input
                          type="number"
                          name="price"
                          id="price"
                          value={price}
                          className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
                          onChange={(e) => {
                            setPrice(e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label htmlFor="maxpeople" className=" ml-1">
                          MaxPeople
                        </label>
                        <input
                          type="number"
                          name="maxpeople"
                          id="maxpeople"
                          value={maxPeople}
                          className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
                          onChange={(e) => {
                            setMaxPeople(e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex flex-col w-full ">
                        <label htmlFor="rooms" className=" ml-1">
                          Room Numbers
                        </label>
                        <input
                          type="text"
                          name="rooms"
                          id="rooms"
                          value={rooms}
                          className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px]   "
                          onChange={(e) => {
                            setRooms(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col w-[780px] ">
                      <label htmlFor="desc" className=" ml-1 mb-1">
                        Description
                      </label>
                      <textarea
                        name="desc"
                        id="desc"
                        rows="5"
                        value={desc}
                        className=" border-2 border-[gray] focus:scale-[1.01] p-2 bg-transparent"
                        onChange={(e) => {
                          setDesc(e.target.value);
                        }}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <button
                    onClick={handleClick}
                    className="w-50 bg-blue-600 text-lg px-3 py-1 rounded-md text-white cursor-pointer self-center hover:bg-blue-700 hover:scale-105"
                  >
                    Save
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
            )
          )}
        </div>
      </div>
    </div>
  );
};
