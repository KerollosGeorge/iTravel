import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { ForgetPassword } from "./pages/ForgetPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Register } from "./pages/Register";
import { HotelsList } from "./pages/HotelsList";
import { Hotel } from "./pages/Hotel";
import { Profile } from "./pages/Profile";
import { Room } from "./pages/Room";
import { Payment } from "./pages/Payment";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { darkModeContext } from "./context/DarkMoodContext";
import "./style/dark.scss";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { TermsServices } from "./pages/Terms&Services";
import { TermsOfUse } from "./pages/TermsOfUse";
import { ContactUs } from "./pages/ContactUs";
import { AboutUs } from "./pages/AboutUs";
import { AllHotels } from "./pages/AllHotels";
import { NewHotel } from "./pages/NewHotel";
import { NewRoom } from "./pages/NewRoom";

function App() {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  const { darkMode } = useContext(darkModeContext);
  const initialOptions = {
    clientId:
      "ASpYg7OcV0SDOjg268HJKIMYPwV4Vsg_PAwZxqN9h9DUfIoZbaFVdMBXrJsXhGuzEviSOsFU-AhswPph",
    currency: "USD",
    intent: "capture",
  };
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className={darkMode ? "app dark" : "app"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget_password" element={<ForgetPassword />} />
          <Route
            path="/reset_password/:id/:token"
            element={<ResetPassword />}
          />
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/all_hotels" element={<AllHotels />} />
          <Route path="/hotels" element={<HotelsList />} />
          <Route path="/hotels/:hotelId/:options" element={<Hotel />} />
          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />
          <Route path="/hotel/new" element={<NewHotel />} />
          <Route path="/room/new" element={<NewRoom />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms&services" element={<TermsServices />} />
          <Route path="/termsOfUse" element={<TermsOfUse />} />
        </Routes>
      </div>
    </PayPalScriptProvider>
  );
}

export default App;
