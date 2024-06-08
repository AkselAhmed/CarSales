/* eslint-disable react/prop-types */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import Cookies from "js-cookie";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import PageNotFound from "./pages/PageNotFound";
import ResetPassword from "./pages/ResetPassword";
import AppLayout from "./Components/AppLayout";
import useAuth from "./hooks/useAuth.jsx";
import ListCar from "./pages/ListCar.jsx";
import SearchCar from "./pages/SearchCar.jsx";
import Profile from "./pages/Profile.jsx";
import AdvertisementInfo from "./pages/AdvertisementInfo.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import Advertisements from "./pages/admin/Advertisements.jsx";
import AddBrand from "./pages/admin/AddBrand.jsx";
import AddModel from "./pages/admin/AddModel.jsx";
import AllUsers from "./pages/admin/AllUsers.jsx";
import Brands from "./pages/admin/Brands.jsx";
import UserAdvertisements from "./pages/UserAdvertisements.jsx";
import EditAdvertisement from "./pages/EditAdvertisement.jsx";
import Models from "./pages/admin/Models.jsx";
import ReportedAdvertisements from "./pages/admin/ReportedAdvertisements.jsx";
import Favourites from "./pages/Favourites.jsx";

function PrivateRoute({ element }) {
  const { setAuth } = useAuth();

  const token = Cookies.get("token");
  const role = Cookies.get("role");
  const username = Cookies.get("username");

  useEffect(() => {
    if (!token || !role || !username) {
      setAuth({});
      toast.error("You are not authorized to access this page. Please login.");
    }
  }, [role, setAuth, token, username]);

  return username && role ? element : <Navigate to="/" replace />;
}

function AdminRoute({ element }) {
  const { setAuth } = useAuth();

  const token = Cookies.get("token");
  const role = Cookies.get("role");
  const username = Cookies.get("username");

  useEffect(() => {
    if (!token || !role || !username) {
      setAuth({});
    }
  }, [role, setAuth, token, username]);

  return role === "71a*Zl936" ? element : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />

          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route
              path="/listcar"
              element={<PrivateRoute element={<ListCar />} />}
            />
            <Route
              path="/advertisementInfo/:id"
              element={<PrivateRoute element={<AdvertisementInfo />} />}
            />
            <Route
              path="/favourites"
              element={<PrivateRoute element={<Favourites />} />}
            />
            <Route
              path="/profile/:username"
              element={<PrivateRoute element={<Profile />} />}
            />
            <Route
              path="/profile/:username/advertisements"
              element={<PrivateRoute element={<UserAdvertisements />} />}
            />
            <Route
              path="/profile/:username/advertisements/:id"
              element={<PrivateRoute element={<EditAdvertisement />} />}
            />
            <Route
              path="/profile/:username/changePassword"
              element={<PrivateRoute element={<ChangePassword />} />}
            />
            <Route
              path="/searchcar"
              element={<PrivateRoute element={<SearchCar />} />}
            />

            {/* ADMIN ROUTES */}
            <Route
              path="/pendingAdvertisements"
              element={<AdminRoute element={<Advertisements />} />}
            />
            <Route
              path="/reportedAdvertisements"
              element={<AdminRoute element={<ReportedAdvertisements />} />}
            />
            <Route
              path="/editBrands"
              element={<AdminRoute element={<Brands />} />}
            />
            <Route
              path="/addBrand"
              element={<AdminRoute element={<AddBrand />} />}
            />
            <Route
              path="/editModel"
              element={<AdminRoute element={<Models />} />}
            />
            <Route
              path="/addModel"
              element={<AdminRoute element={<AddModel />} />}
            />
            <Route
              path="/allUsers"
              element={<AdminRoute element={<AllUsers />} />}
            />
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  );
}
