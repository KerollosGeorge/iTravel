import { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Hotels } from "../components/Hotels";
import { FavoriteHotels } from "../components/FavoriteHotels";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { darkModeContext } from "../context/DarkMoodContext";
import { Loading } from "../components/Loading";
import AddedHotels from "../components/AddedHotels";

export const Profile = () => {
  let { user, updateUser } = useContext(AuthContext);
  const { data, loading, error } = useFetch(
    `https://itravel-apis.vercel.app/api/user/favorite/${user._id}`
  );
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [country, setCountry] = useState(user.country);
  const [city, setCity] = useState(user.city);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [showMore, setshowMore] = useState(false);
  const [showMorehotels, setshowMoreHotels] = useState(false);
  const [hotelsAdded, setHotelsAdded] = useState(user.hotels);
  const { darkMode } = useContext(darkModeContext);
  const [userInfo, setUserInfo] = useState(user);

  useEffect(() => {
    const updateHotelsAdded = async () => {
      if (hotelsAdded && hotelsAdded.length > 0) {
        const res = await axios.put(
          `https://itravel-apis.vercel.app/api/user/${user._id}`,
          { hotelsAdded }
        );
        updateUser(res.data.updateUser);
      }
    };
    updateHotelsAdded();
  }, [hotelsAdded]);
  useEffect(() => {
    const getUpdatedUser = async () => {
      const res = await axios.get(
        `https://itravel-apis.vercel.app/api/user/${user._id}`
      );
      setUserInfo(res.data);
    };
    getUpdatedUser();
  }, []);
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone);
      setCountry(user.country);
      setCity(user.city);
    }
  }, [user]);
  const HandleUpdate = async () => {
    try {
      if (
        firstName === "" ||
        lastName === "" ||
        email === "" ||
        phone === "" ||
        country === "" ||
        city === ""
      ) {
        setErr("Please fullfill all fields to update");
        const errorTime = setTimeout(() => {
          setErr("");
        }, 2000);
        return () => clearTimeout(errorTime);
      } else if (
        firstName === user.firstName &&
        lastName === user.lastName &&
        email === user.email &&
        phone === user.phone &&
        country === user.country &&
        city === user.city
      ) {
        setErr("No changes in the data detected");
        const errorTime = setTimeout(() => {
          setErr("");
        }, 2000);
        return () => clearTimeout(errorTime);
      } else {
        const res = await axios.put(
          `https://itravel-apis.vercel.app/api/user/${user._id}`,
          { firstName, lastName, email, phone, country, city }
        );
        updateUser(res.data.updateUser);
        setMsg(res.data.msg);
        const errorTime = setTimeout(() => {
          setMsg("");
        }, 2000);
        return () => clearTimeout(errorTime);
      }
    } catch (error) {
      console.log(error.message);
      let errorMessage = error.response
        ? error.response.data.message
        : error.message;
      setErr(errorMessage);
    }
  };
  return (
    <div className=" w-ful flex flex-col">
      {loading ? (
        <Loading />
      ) : (
        <>
          <Navbar />
          <div className="w-full flex justify-center flex-col p-10 gap-5">
            <div className="w-[40%]  flex flex-col self-center shadow-md shadow-[gray] rounded-md border-[1px] border-gray-300 gap-3 min-w-[400px]">
              <div className="w-full bg-red-400 h-[80px] rounded-t-md"></div>
              <div className="p-2 flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <label htmlFor="firstName" className="w-[90px]">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    className="w-[50%] h-[30px] indent-1 rounded-md  border-[1px] border-gray-300 outline-none"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <label htmlFor="lastName" className="w-[90px]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    className="w-[50%] h-[30px] indent-1 rounded-md  border-[1px] border-gray-300"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <label htmlFor="email" className="w-[90px]">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    value={email}
                    className="w-[50%] h-[30px] indent-1 rounded-md  border-[1px] border-gray-300"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <label htmlFor="phone" className="w-[90px]">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    value={phone}
                    className="w-[50%] h-[30px] indent-1 rounded-md  border-[1px] border-gray-300"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <label htmlFor="country" className="w-[90px]">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    value={country}
                    className="w-[50%] h-[30px] indent-1 rounded-md  border-[1px] border-gray-300"
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <label htmlFor="city" className="w-[90px]">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    className="w-[50%] h-[30px] indent-1 rounded-md  border-[1px] border-gray-300"
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <button
                  onClick={HandleUpdate}
                  className="text-white p-1 rounded-md bg-red-400 w-[70px] self-end outline-none hover:bg-red-300 hover:scale-[1.05] transition-all"
                >
                  Edit
                </button>
                {err && (
                  <span className="self-center text-sm text-red-600">
                    {err}
                  </span>
                )}
                {msg && (
                  <span className="self-center text-sm text-green-600">
                    {msg}
                  </span>
                )}
              </div>
            </div>
            <div className="w-[70%] flex flex-col gap-5 p-4 max-md:w-full ml-8 max-md:ml-0 max-md:p-1">
              <h1 className="text-3xl font-bold text-red-400">
                Favorites{" "}
                {data.length <= 2 ? (
                  ""
                ) : (
                  <button
                    onClick={() => {
                      setshowMore(!showMore);
                      /* showMore && window.scrollTo(0, 0); */
                    }}
                  >
                    {!showMore ? (
                      <FontAwesomeIcon icon={faChevronUp} />
                    ) : (
                      <FontAwesomeIcon icon={faChevronDown} />
                    )}
                  </button>
                )}
              </h1>
              <div className="w-full min-w-max grid grid-cols-2 gap-4 place-items-center p-4 max-xl:grid-cols-1 max-md:w-full max-md:ml-2 max-md:p-0">
                {!showMore
                  ? data
                      ?.slice(0, 2)
                      .map((id) => <FavoriteHotels id={id} key={id} />)
                  : data?.map((id) => <FavoriteHotels id={id} key={id} />)}
              </div>
            </div>
            <div className="w-[70%] flex flex-col gap-5 p-4 max-md:w-full ml-8 max-md:ml-0 max-md:p-1">
              <h1 className="text-3xl font-bold text-red-400">
                Hotels Added{" "}
                <button
                  onClick={() => {
                    setshowMoreHotels(!showMorehotels);
                    /* showMore && window.scrollTo(0, 0); */
                  }}
                >
                  {!showMorehotels ? (
                    <FontAwesomeIcon icon={faChevronUp} />
                  ) : (
                    <FontAwesomeIcon icon={faChevronDown} />
                  )}
                </button>
              </h1>
              {userInfo?.hotels.length > 0 && (
                <div className="w-full min-w-max grid grid-cols-2 gap-4 place-items-center p-4 max-xl:grid-cols-1 max-md:w-full max-md:ml-2 max-md:p-0">
                  {!showMorehotels
                    ? userInfo?.hotels
                        ?.slice(0, 2)
                        ?.map((id) => (
                          <AddedHotels
                            id={id}
                            key={id}
                            setHotelsAdded={setHotelsAdded}
                          />
                        ))
                    : userInfo?.hotels?.map((id) => (
                        <AddedHotels
                          id={id}
                          key={id}
                          setHotelsAdded={setHotelsAdded}
                        />
                      ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};
