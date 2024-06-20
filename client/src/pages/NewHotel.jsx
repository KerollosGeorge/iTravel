import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { darkModeContext } from "../context/DarkMoodContext";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { NewRoom } from "./NewRoom";
import { AuthContext } from "../context/AuthContext";

export const NewHotel = () => {
  const [HotelName, setHotelName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState("");
  const [urlImages, setUrlImages] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(undefined);
  const [cheapestPrice, setCheapestPrice] = useState(undefined);
  const [type, setType] = useState("Hotel");
  const [featured, setFeatured] = useState(false);

  const { darkMode } = useContext(darkModeContext);
  const { user } = useContext(AuthContext);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleClick = async (e) => {
    e.preventDefault();
    if (
      HotelName === "" ||
      country === "" ||
      city === "" ||
      address === "" ||
      distance === "" ||
      title === "" ||
      description === "" ||
      rating === "" ||
      cheapestPrice === ""
    ) {
      setErr("Please Fill all Fields");
      const errorTime = setTimeout(() => {
        setErr("");
      }, 2000);
      return () => clearTimeout(errorTime);
    } else {
      try {
        const formData = new FormData();
        if (images) {
          await Promise.all(
            Object.values(images).map((image) => {
              formData.append("image", image);
            })
          );
        }
        formData.append("urlImages", urlImages);
        formData.append("HotelName", HotelName);
        formData.append("country", country);
        formData.append("city", city);
        formData.append("address", address);
        formData.append("distance", distance);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("rating", rating);
        formData.append("cheapestPrice", cheapestPrice);
        formData.append("type", type);
        formData.append("featured", featured);
        formData.append("userId", user._id);

        const res = await axios.post(
          "https://itravel-apis.vercel.app/api/hotels",
          formData,
          {
            headers: { "content-type": "multipart/form-data" },
          }
        );
        setMsg(res.data.msg);
        const timeout = setTimeout(() => {
          setMsg("");
          if (type === "Hotel") {
            <NewRoom HotelName={HotelName} />;
          } else {
            navigate("/");
          }
        }, 2000);
        return () => clearTimeout(timeout);
      } catch (err) {
        setErr(err);
        const errorTime = setTimeout(() => {
          setErr("");
        }, 3000);
        return () => clearTimeout(errorTime);
      }
    }
  };
  return (
    <div className=" w-full flex flex-col min-w-max">
      <Navbar />
      <h2 className="text-3xl  w-[1200px] flex flex-col min-w-[400px] self-center ml-6 mb-[2px] text-start p-2 pl-5 shadow-md shadow-[gray]">
        Add New Hotel
      </h2>
      <form
        className={
          darkMode
            ? "relative w-[1200px] flex flex-col min-w-[400px] self-center  ml-6 mb-4 max-sm:h-[600px] bg-[#111] shadow-xl shadow-[gray] space-y-[30px] max-sm:space-y-[25px] p-5 rounded-md"
            : "relative w-[1200px] flex flex-col min-w-[400px] self-center  ml-6 mb-4 max-sm:h-[600px] bg-white shadow-lg shadow-[gray] space-y-[30px] max-sm:space-y-[25px] p-5 rounded-md"
        }
      >
        <div className="w-full flex justify-around">
          <div className="flex flex-col items-center gap-4">
            <img
              className=" w-[150px] h-[150px] rounded-[50%] border-[2px] border-[gray] text-center"
              src={
                images
                  ? URL.createObjectURL(images?.[0])
                  : urlImages
                  ? urlImages.split(",")?.[0]
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
                setImages(e.target.files);
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
              <label htmlFor="hotelName" className=" ml-1">
                Hotel Name
              </label>
              <input
                type="text"
                name="hotelName"
                id="hotelName"
                placeholder="Luxor Palace"
                className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]  "
                onChange={(e) => {
                  setHotelName(e.target.value);
                }}
              ></input>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="title" className=" ml-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Enjoy the stunning city views"
                className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              ></input>
            </div>
            <div className="relative flex flex-col w-full">
              <label htmlFor="distance" className=" ml-1">
                Distance from City Center
              </label>
              <input
                type="distance"
                name="distance"
                id="distance"
                placeholder="1 km distance from city center"
                className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                onChange={(e) => {
                  setDistance(e.target.value);
                }}
              ></input>
            </div>
            <div className="flex flex-col w-full ">
              <label htmlFor="address" className=" ml-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="789 Nile Street"
                className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              ></input>
            </div>

            <div className="flex flex-col w-full ">
              <label htmlFor="country" className=" ml-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                placeholder="Egypt"
                className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
              ></input>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="city" className=" ml-1">
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="Cairo"
                className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                onChange={(e) => {
                  setCity(e.target.value);
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
                  setCheapestPrice(e.target.value);
                }}
              ></input>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="rating" className=" ml-1">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                id="rating"
                placeholder="4"
                className="w-[380px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] placeholder:text-[#787878]"
                onChange={(e) => {
                  setRating(e.target.value);
                }}
              ></input>
            </div>
            <div className="flex flex-col w-full ">
              <label htmlFor="description" className=" ml-1 mb-1">
                Description
              </label>

              <textarea
                name="description"
                id="description"
                rows="5"
                placeholder="hotel description"
                className=" w-[380px] border-2 border-[gray] focus:scale-[1.01] indent-[7px] placeholder:text-[#787878] bg-transparent"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></textarea>
            </div>

            <div className=" flex w-[380px] justify-around items-center">
              <div className="flex flex-col gap-1">
                <label htmlFor="type" className="text-sm">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  className=" h-8 rounded-sm outline-none indent-1 bg-transparent border-[2px] border-[gray]"
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Hotel" className={darkMode && "bg-[#222]"}>
                    Hotel
                  </option>
                  <option value="Apartment" className={darkMode && "bg-[#222]"}>
                    Apartment
                  </option>
                  <option value="Resort" className={darkMode && "bg-[#222]"}>
                    Resort
                  </option>
                  <option value="Villa" className={darkMode && "bg-[#222]"}>
                    Villa
                  </option>
                  <option value="Cabin" className={darkMode && "bg-[#222]"}>
                    Cabin
                  </option>
                </select>
              </div>
              <div className="flex gap-5 items-center">
                <label htmlFor="featured">Is Featured?</label>
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  onClick={() => setFeatured(!featured)}
                  className=" scale-[1.5] focus:scale-[1.5] border-none "
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <button
            onClick={handleClick}
            className="w-50 bg-blue-600 text-lg px-3 py-1 rounded-md text-white cursor-pointer self-center hover:bg-blue-700 hover:scale-105"
          >
            {type === "Hotel" ? "Add Rooms" : "Send"}
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
  );
};
