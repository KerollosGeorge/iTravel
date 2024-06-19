import axios from "axios";
import { format } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const Payment = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const currentDate = new Date();
  let formattedDate =
    currentDate.toISOString().split("T")[0] + "T22:00:00.000+00:00";

  const searchData = location?.state?.searchData || {
    item: location?.state?.item,
    dates: [{ startDate: formattedDate, endDate: formattedDate }],
    options: { adult: 1, children: 0, room: 1 },
  };
  const [bookingData, setBookingData] = useState([]);
  let date = new Date();
  date = searchData?.dates || new Date().getDate();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [msg, setMsg] = useState("");
  const [roomNumbers, setRoomNumbers] = useState(false);
  const [notHotel, setNotHotel] = useState(false);
  const paypal = useRef();
  useEffect(() => {
    if (searchData.item.type === "Hotel") {
      axios
        .get(`https://itravel-apis.vercel.app/api/rooms/${id}`)
        .then((response) => setBookingData(response.data))
        .catch((error) => console.log(error));
    }
  }, [id]);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const price =
    searchData?.item.type === "Hotel"
      ? bookingData.price
      : searchData.item.cheapestPrice;

  let totalAmount =
    Math.ceil(
      (searchData?.dates?.[0].endDate - searchData?.dates?.[0].startDate) /
        (24 * 60 * 60 * 1000) +
        1
    ) *
      price *
      (searchData.item.type === "Hotel" ? searchData.options.room : 1) ||
    price * (searchData.item.type === "Hotel" ? searchData.options.room : 1);

  const description =
    searchData.item.type === "Hotel"
      ? bookingData.desc
      : searchData.item.description;

  useEffect(() => {
    if (searchData.item.type === "Hotel") {
      if (selectedRooms.length == searchData.options.room) {
        setRoomNumbers(true);
      } else {
        setRoomNumbers(false);
        setMsg(
          `Please choose ${searchData.options.room} ${
            searchData.options.room > 1 ? "rooms" : "room"
          } `
        );
        const errorTime = setTimeout(() => {
          setMsg("");
        }, 2000);
        return () => clearTimeout(errorTime);
      }
    } else {
      setNotHotel(true);
    }
  }, [selectedRooms, notHotel]);
  useEffect(() => {
    if (paypal.current && totalAmount && description) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  description: description,
                  amount: {
                    currency_code: "USD",
                    value: totalAmount,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            try {
              if (searchData.item.type === "Hotel") {
                await Promise.all(
                  selectedRooms.map(async (roomId) => {
                    const res = await axios.put(
                      `https://itravel-apis.vercel.app/api/rooms/availability/${roomId}`,
                      { date }
                    );
                    return res.data;
                  })
                );
              } else {
                const res = await axios.put(
                  `https://itravel-apis.vercel.app/api/hotels/availability/${id}`,
                  { date }
                );
                return res.data;
              }
              const order = await actions.order.capture();
              console.log(order);

              setNotHotel(false);
              setRoomNumbers(false);
              setMsg(false);
              setSuccess(true);
              const successMsg = setTimeout(() => {
                setSuccess(false);
                navigate("/");
              }, 3000);
              return () => clearTimeout(successMsg);
            } catch (error) {
              console.log(error);
            }
          },
          onError: (err) => {
            console.log(err);
          },
        })
        .render(paypal.current);
    }
  }, [paypal.current, totalAmount, description, roomNumbers, notHotel]);

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  return (
    <div className=" w-full ">
      <Navbar />

      <div className=" relative w-full flex items-center ">
        {msg && notHotel === false && (
          <p className=" absolute top-5 left-[40%]">{msg}</p>
        )}
        <div className="w-[40%] shadow-lg shadow-[gray] mt-[45px] ml-[50px] p-5 rounded-md  flex flex-col gap-5 min-w-max">
          <h1 className="font-bold text-[30px]">Details</h1>
          <p>
            Name:{" "}
            {searchData.item.type === "Hotel"
              ? bookingData.title
              : searchData.item.HotelName}
          </p>
          <p>
            from:{" "}
            {new Date(searchData.dates?.[0].startDate).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}{" "}
            to:{" "}
            {new Date(searchData.dates?.[0].endDate).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
          <p>Price: {price} per day</p>
          {totalAmount && (
            <p>
              Total Amount: {totalAmount}
              {searchData.item.type === "Hotel" && (
                <>
                  {" "}
                  for {searchData.options.room}{" "}
                  {searchData.options.room > 1 ? "rooms" : "room"} ,for{" "}
                  {(Date.parse(searchData.dates?.[0].endDate) -
                    Date.parse(searchData.dates?.[0].startDate)) /
                    (1000 * 3600 * 24) +
                    1}{" "}
                  {(Date.parse(searchData.dates?.[0].endDate) -
                    Date.parse(searchData.dates?.[0].startDate)) /
                    (1000 * 3600 * 24) +
                    1 >
                  1
                    ? "Nights"
                    : "Night"}
                </>
              )}
            </p>
          )}
          {searchData.item.type === "Hotel" && (
            <div className="flex flex-col items-center gap-x-5">
              <p className=" text-start self-start font-semibold text-lg">
                Select your {searchData.options.room > 1 ? "Rooms" : "Room"} :
              </p>
              <ul className="w-[90%] grid grid-cols-4 max-md:grid-cols-2">
                {bookingData.roomNumbers?.map((roomNumber) => {
                  return (
                    <li>
                      <label>{roomNumber.number}</label>
                      <input
                        type="checkbox"
                        value={roomNumber._id}
                        onChange={handleSelect}
                        disabled={roomNumber.unavailableDates?.length > 0}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {(roomNumbers || notHotel === true) && <div ref={paypal}></div>}
        </div>
        {success && (
          <div className="absolute top-6 left-[40%] text-green-600 font-semibold">
            <h2>Congratulations, Your Booking is Confirmed!</h2>
          </div>
        )}
      </div>
    </div>
  );
};
