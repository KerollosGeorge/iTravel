import { Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { ForgetPassword } from "./pages/ForgetPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { Profile } from "./pages/Profile";
import { darkModeCotext } from "./context/DarkMoodContext";
import "./style/dark.scss";
import { List } from "./pages/List";
import {
  hotelColumns,
  reviewsColumns,
  roomsColumns,
  userColumns,
} from "./dataTableSources";
import { Hotel } from "./pages/Hotel";
import { Room } from "./pages/Room";
import { User } from "./pages/User";
import { NewUser } from "./pages/NewUser";
import { NewHotel } from "./pages/NewHotel";
import { NewRoom } from "./pages/NewRoom";
import { EditHotel } from "./pages/EditHotel";
import { EditRoom } from "./pages/EditRoom";
import { Review } from "./pages/Review";
import { TermsServices } from "./pages/Terms&Services";
import { TermsOfUse } from "./pages/TermsOfUse";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
function App() {
  const { darkMode } = useContext(darkModeCotext);
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/user">
          <Route
            index
            element={
              <ProtectedRoute>
                <List columns={userColumns} />
              </ProtectedRoute>
            }
          />
          <Route
            path=":userId"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="new"
            element={
              <ProtectedRoute>
                <NewUser />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/hotels">
          <Route
            index
            element={
              <ProtectedRoute>
                <List columns={hotelColumns} />
              </ProtectedRoute>
            }
          />
          <Route
            path=":hotelId"
            element={
              <ProtectedRoute>
                <Hotel />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:hotelId"
            element={
              <ProtectedRoute>
                <EditHotel />
              </ProtectedRoute>
            }
          />
          <Route
            path="new"
            element={
              <ProtectedRoute>
                <NewHotel />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/rooms">
          <Route
            index
            element={
              <ProtectedRoute>
                <List columns={roomsColumns} />
              </ProtectedRoute>
            }
          />
          <Route
            path=":roomId"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit/:roomId"
            element={
              <ProtectedRoute>
                <EditRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="new"
            element={
              <ProtectedRoute>
                <NewRoom />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/reviews">
          <Route
            index
            element={
              <ProtectedRoute>
                <List columns={reviewsColumns} />
              </ProtectedRoute>
            }
          />
          <Route
            path=":reviewId"
            element={
              <ProtectedRoute>
                <Review />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/forget_password" element={<ForgetPassword />} />
        <Route path="/reset_password/:id/:token" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms&services" element={<TermsServices />} />
        <Route path="/termsOfUse" element={<TermsOfUse />} />
      </Routes>
    </div>
  );
}

export default App;
