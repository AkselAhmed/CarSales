import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favouriteItems: localStorage.getItem("favouriteItems")
    ? JSON.parse(localStorage.getItem("favouriteItems"))
    : [],
};

export const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    addToFavourites: (state, action) => {
      const existsItem = state.favouriteItems.find(
        (item) => item._id === action.payload._id
      );

      if (existsItem) {
        action.payload = false;
      } else {
        let buildFavouritesItem = { ...action.payload };

        state.favouriteItems?.push(buildFavouritesItem);

        localStorage.setItem(
          "favouriteItems",
          JSON.stringify(state.favouriteItems)
        );
        action.payload = true;
      }
    },

    removeFromFavorites: (state, action) => {
      state.favouriteItems = state.favouriteItems?.filter(
        (item) => item?._id !== action.payload?._id
      );

      localStorage.setItem(
        "favouriteItems",
        JSON.stringify(state.favouriteItems)
      );
    },
  },
});

export const { addToFavourites, removeFromFavorites } = favouritesSlice.actions;

export default favouritesSlice.reducer;
