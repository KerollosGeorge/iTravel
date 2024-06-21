import { useLocation, useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import "../components/Loading.css";
import { Loading } from "../components/Loading";
import { darkModeContext } from "../context/DarkMoodContext";
import axios from "axios";

export const ViewRoom = () => {
  const location = useLocation();
  const hotelId = location.pathname.split("/")[2];
  const roomId = location.pathname.split("/")[3];
  const { data, loading } = useFetch(
    `https://itravel-apis.vercel.app/api/rooms/${roomId}`
  );

  const [start, setStart] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [err, setErr] = useState();
  const [msg, setMsg] = useState();
  const navigate = useNavigate();
  const { darkMode } = useContext(darkModeContext);
  const getImageSource = (photo) => {
    if (!photo) return;
    return photo.startsWith("http")
      ? photo
      : `https://itravel-apis.vercel.app/Images/${photo}`;
  };
  const Next = () => {
    setStart((start + 1) % data?.photos?.length);
  };

  const Prev = () => {
    if (start === 0) {
      return;
    } else {
      setStart((start - 1) % data?.photos?.length);
      setDisabled(false);
    }
  };
  useEffect(() => {
    if (start === data?.photos?.length) {
      setStart(data?.photos[0]);
    }
    if (start === 0) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [start]);

  axios.defaults.withCredentials = true;
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `https://itravel-apis.vercel.app/api/rooms/${hotelId}/${roomId}`
      );
      setMsg(res.data);
      const msgTime = setTimeout(() => {
        setMsg("");
        setIsOpen(false);
        navigate(`/hotels/${hotelId}`);
      }, 2000);
      return () => clearTimeout(msgTime);
    } catch (err) {
      setErr(err.response.data.message);
      const errTime = setTimeout(() => {
        setErr("");
        setIsOpen(false);
      }, 2000);
      return () => clearTimeout(errTime);
    }
  };
  return (
    <div className=" relative w-full ">
      <div className=" w-full flex flex-col gap-4 ">
        <Navbar />
        {loading ? (
          <Loading />
        ) : (
          <div className="flex flex-col w-[60%] self-center max-lg:w-[350px]">
            <div className=" relative">
              <img
                crossorigin="anonymous"
                src={getImageSource(data?.photos?.[start])}
                alt={data?.title}
                className="w-[800px] h-[450px] rounded-2xl max-lg:h-auto min-h-[450px] max-lg:max-h-[400px]"
              />
              <FontAwesomeIcon
                icon={faCaretRight}
                className=" absolute right-[80px] top-[50%] text-3xl text-red-500 py-[1px] px-[3px] cursor-pointer border-[1px] border-gray-400"
                onClick={Next}
              />
              <FontAwesomeIcon
                icon={faCaretLeft}
                className={
                  !disabled
                    ? "absolute left-[-30px] top-[50%] text-3xl text-red-500 py-[1px] px-[3px] cursor-pointer border-[1px] border-gray-400"
                    : "absolute left-[-30px] top-[50%] text-3xl text-red-300 py-[1px] px-[3px] cursor-not-allowed border-[1px] border-gray-400"
                }
                onClick={Prev}
              />
            </div>

            <div className="flex flex-col gap-1 p-5">
              <h1 className="text-xl">{data?.title} </h1>

              <h1 className="text-2xl text-red-400">Description</h1>
              <p className="pl-2">
                Room for {data?.maxPeople}{" "}
                {data.maxPeople > 1 ? "Presons" : "person"}{" "}
              </p>
              <p className="pl-2">{data?.desc}</p>
              <div className="flex items-center justify-around">
                <button
                  onClick={() => navigate(`/rooms/edit/${roomId}`)}
                  className=" border-dashed border-[1px] border-[#59ff40] rounded-md py-1 px-2 text-green-700 text-center hover:bg-green-700  hover:text-white hover:transition-all transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => setIsOpen(true)}
                  className=" border-dashed border-[1px] border-[#e83737] rounded-md py-1 px-2 text-red-700 text-center hover:bg-red-600 hover:text-white hover:transition-all transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {isOpen && (
          <div className=" absolute top-[50%] left-[32%] z-50 w-[500px] opacity-100 bg-[#cdcdcd] p-2 rounded-lg flex flex-col ">
            <p
              className={
                darkMode
                  ? " w-full text-center mb-[30px] font-semibold text-2xl text-black"
                  : " w-full text-center mb-[30px] font-semibold text-2xl"
              }
            >
              Are You Sure
            </p>
            <div className="w-full flex justify-around">
              <button
                onClick={() => handleDelete()}
                className="  border-[1px] border-[#737373] rounded-md py-1 px-2 text-white text-center bg-red-600 hover:scale-[1.08] hover:transition-all transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className=" border-[1px] border-[#737373] rounded-md py-1 px-2 text-white text-center bg-green-700  hover:scale-[1.08] hover:transition-all transition-all"
              >
                Cancel
              </button>
            </div>
            {err && (
              <span className="w-full text-red-600 text-center self-center mt-5">
                {err}
              </span>
            )}
            {msg && (
              <span className="w-full text-green-600 text-center self-center mt-5">
                {msg}
              </span>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
