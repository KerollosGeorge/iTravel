import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className=" w-full flex flex-col p-2 pb-9 text-white items-center bg-[rgb(32,32,32)]">
      <img
        src="/images/logo-W.png"
        alt=""
        className="w-[150px] h-[80px] cursor-pointer"
        onClick={() => navigate("/")}
      />
      <div className="h-[1px] w-[80%] self-center bg-gray-100 mb-5"></div>
      <div className="w-full grid grid-cols-4 place-items-center max-xl:grid max-xl:grid-cols-3 max-xl:place-items-center max-lg:grid max-lg:grid-cols-2  max-md:flex max-md:flex-col max-md:justify-center max-md:items-center">
        <div className=" flex flex-col gap-3 h-[150px] w-[250px] ">
          <h1 className=" font-semibold text-xl">Contact us</h1>
          <span className="flex gap-3 items-center">
            <FontAwesomeIcon icon={faPhone} />
            +201273201722
          </span>
          <span className="flex gap-3 items-center">
            <FontAwesomeIcon icon={faEnvelope} /> iTravel.support@gmail.com
          </span>
          <span className="flex gap-3 items-center">
            <FontAwesomeIcon icon={faLocationDot} />{" "}
            <p>
              10<sup>th</sup> of Ramadan
            </p>
          </span>
        </div>
        <div className=" flex flex-col gap-3 h-[150px] w-[350px]">
          <h1 className=" font-semibold text-xl">About us</h1>
          <p>
            We are a hotel booking site that is dedicated to providing our
            customers with the best possible experience. We believe that booking
            a hotel should be easy, convenient, and stress-free, and we strive
            to make that a reality for every one of our customers.
          </p>
        </div>
        <div className=" flex flex-col gap-3 h-[150px] w-[250px]">
          <h1 className=" font-semibold text-xl">Legal</h1>
          <a className=" cursor-pointer " href="/privacy">
            {" "}
            Privacy & Policy{" "}
          </a>
          <a href="/terms&services" className=" cursor-pointer ">
            {" "}
            Terms & Services
          </a>
          <a href="/termsOfUse" className=" cursor-pointer ">
            {" "}
            Terms of Use
          </a>
        </div>
        <div className=" flex flex-col gap-3 h-[200px] bg-[rgb(46,46,46)] p-2 max-xl:ml-[70px]">
          <h1>Join Our Newsletter</h1>
          <div className="flex gap-3">
            <input
              type="text"
              id="email"
              className=" outline-none  border-[2px] border-[gray] rounded-md text-slate-200 text-lg pl-2 "
            />
            <label
              htmlFor="text"
              className=" bg-black p-2 rounded-md cursor-pointer"
            >
              Subscribe
            </label>
          </div>
          <p className="w-[300px]">
            * we will send you weekly updates for your better tool management.
          </p>
        </div>
      </div>
    </div>
  );
};
