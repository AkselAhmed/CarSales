/* eslint-disable react-refresh/only-export-components */
import { configureStore } from "@reduxjs/toolkit";
import favouritesSlice from "../features/favouritesSlice";

export default configureStore({
  reducer: {
    favourites: favouritesSlice,
  },
});
