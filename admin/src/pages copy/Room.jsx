import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import {
  faCaretLeft,
  faCaretRight,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import "../components/Loading.css";
import { Sidebar } from "../components/Sidebar";
import { Loading } from "../components/Loading";

export const Room = () => {
  const { roomId } = useParams();
  const { data, loading } = useFetch(
    `http://localhost:8000/api/rooms/${roomId}`
  );

  const [start, setStart] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const getImageSource = (photo) => {
    if (!photo) return;
    return photo.startsWith("http")
      ? photo
      : `http://localhost:8000/Images/${photo}`;
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
  return (
    <div className=" w-full ">
      <div className=" flex flex-1 z-50">
        <Sidebar />
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
                  className=" absolute right-[-30px] top-[50%] text-3xl text-red-500 py-[1px] px-[3px] cursor-pointer border-[1px] border-gray-400"
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
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
