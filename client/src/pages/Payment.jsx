import axios from "axios";
import { format } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

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
        .get(`http://localhost:8000/api/rooms/${id}`)
        .then((response) => setBookingData(response.data))
        .catch((error) => console.log(error));
    }
  }, [id]);

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
        setMsg(`Please choose ${searchData.options.room} room(s)`);
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
                      `http://localhost:8000/api/rooms/availability/${roomId}`,
                      { date }
                    );
                    console.log(res.data);
                    return res.data;
                  })
                );
              } else {
                const res = await axios.put(
                  `http://localhost:8000/api/hotels/availability/${id}`,
                  { date }
                );
                console.log(res.data);
                return res.data;
              }
              const order = await actions.order.capture();
              console.log(order);
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
  // console.log(searchData);
  return (
    <div className=" relative ">
      {msg && notHotel === false && (
        <p className=" absolute top-5 left-[40%]">{msg}</p>
      )}
      <h1>Details</h1>
      <p>
        Name:{" "}
        {searchData.item.type === "Hotel"
          ? bookingData.title
          : searchData.item.HotelName}
      </p>
      <p>
        from:{" "}
        {new Date(searchData.dates?.[0].startDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        to:{" "}
        {new Date(searchData.dates?.[0].endDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p>Price: {price} per day</p>
      {totalAmount && (
        <p>
          Total Amount: {totalAmount}
          {searchData.item.type === "Hotel" && (
            <> for {searchData.options.room} rooms</>
          )}
        </p>
      )}
      {searchData.item.type === "Hotel" && (
        <div className="flex items-center gap-x-5">
          Select your Room(s)
          {bookingData.roomNumbers?.map((roomNumber) => {
            return (
              <div>
                <label>{roomNumber.number}</label>
                <input
                  type="checkbox"
                  value={roomNumber._id}
                  onChange={handleSelect}
                  disabled={roomNumber.unavailableDates?.length > 0}
                />
              </div>
            );
          })}
        </div>
      )}
      {(roomNumbers || notHotel === true) && <div ref={paypal}></div>}
    </div>
  );
};
