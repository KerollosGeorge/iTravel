import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import useFetch from "../hooks/useFetch";
import { Loading } from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { darkModeContext } from "../context/DarkMoodContext";

export const EditHotel = () => {
  const location = useLocation();
  const hotelId = location.pathname.split("/")[3];
  const navigate = useNavigate();

  const [HotelName, setHotelName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [distance, setDistance] = useState("");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState();
  const [urlImages, setUrlImages] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState();
  const [cheapestPrice, setCheapestPrice] = useState();
  const [type, setType] = useState("");
  const [featured, setFeatured] = useState();
  const { darkMode } = useContext(darkModeContext);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [start, setStart] = useState(0);
  const [imagesArray, setImagesArray] = useState([]);
  const [imagesArrayCheck, setImagesArrayCheck] = useState([]);

  const { data, loading, error } = useFetch(
    `https://itravel-apis.vercel.app/api/hotels/find/${hotelId}`
  );

  useEffect(() => {
    if (data) {
      setHotelName(data?.HotelName);
      setCountry(data?.country);
      setCity(data?.city);
      setAddress(data?.address);
      setDistance(data?.distance);
      setTitle(data?.title);
      setDescription(data?.description);
      setRating(data?.rating);
      setCheapestPrice(data?.cheapestPrice);
      setType(data?.type);
      setFeatured(data?.featured);
      setImagesArrayCheck(data.photos);
    }
  }, [data, loading]);

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
    } else if (
      HotelName === data.HotelName &&
      country === data.country &&
      city === data.city &&
      address === data.address &&
      distance === data.distance &&
      title === data.title &&
      description === data.description &&
      rating === data.rating &&
      cheapestPrice === data.cheapestPrice &&
      imagesArrayCheck === data.photos
    ) {
      setErr("No Changes at data are detected!");
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
        const res = await axios.put(
          `https://itravel-apis.vercel.app/api/hotels/${hotelId}`,
          formData,
          {
            headers: { "content-type": "multipart/form-data" },
          }
        );
        setMsg(res.data?.msg);
        const timeout = setTimeout(() => {
          setMsg("");
          navigate("/hotels");
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
      : `https://itravel-apis.vercel.app/Images/${photo}`;
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
    if (data) {
      setImagesArrayCheck([]);
      setImages(e.target.files);
    }
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
        <h2 className="text-3xl  w-[1200px] flex flex-col min-w-[400px] self-center ml-6 mb-[2px] text-start p-2 pl-5 shadow-md shadow-[gray]">
          Edit {HotelName} Hotel
        </h2>
        {loading ? (
          <Loading />
        ) : (
          data && (
            <form
              className={
                darkMode
                  ? "relative w-[1200px] flex flex-col min-w-[400px] self-center  ml-6 mb-4 max-sm:h-[600px] bg-[#111] shadow-xl shadow-[gray] space-y-[30px] max-sm:space-y-[25px] p-5 rounded-md"
                  : "relative w-[1200px] flex flex-col min-w-[400px] self-center  ml-6 mb-4 max-sm:h-[600px] bg-white shadow-lg shadow-[gray] space-y-[30px] max-sm:space-y-[25px] p-5 rounded-md"
              }
            >
              <div className="w-full flex justify-around gap-5">
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
                <div className=" grid grid-cols-2 gap-4 ">
                  <div className="flex flex-col w-full">
                    <label htmlFor="hotelName" className=" ml-1">
                      Hotel Name
                    </label>
                    <input
                      type="text"
                      name="hotelName"
                      id="hotelName"
                      value={HotelName}
                      className="w-[350px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px]   "
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
                      value={title}
                      className="w-[350px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
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
                      value={distance}
                      className="w-[350px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
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
                      value={address}
                      className="w-[350px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
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
                      value={country}
                      className="w-[350px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
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
                      value={city}
                      className="w-[350px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
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
                      value={cheapestPrice}
                      className="w-[350px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
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
                      value={rating}
                      className="w-[350px] h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
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
                      rows="4"
                      value={description}
                      className=" w-[350px] border-2 border-[gray] focus:scale-[1.01] p-2  bg-transparent"
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    ></textarea>
                  </div>

                  <div className=" flex w-[350px] justify-around items-center">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="type">Type</label>
                      <input
                        type="text"
                        name="type"
                        id="type"
                        value={type}
                        className=" h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
                        onChange={(e) => {
                          setType(e.target.value);
                        }}
                      ></input>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="featured">Is Featured?</label>
                      <input
                        type="text"
                        name="featured"
                        id="featured"
                        value={featured}
                        className=" h-9 border-b-2 border-[gray] focus:scale-[1.04] indent-[7px] "
                        onChange={(e) => {
                          setFeatured(e.target.value);
                        }}
                      ></input>
                    </div>
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
  );
};
