import { createSlice } from '@reduxjs/toolkit';

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
  },
  reducers: {
    addFavorite(state, action) {
      state.items.push(action.payload);
    },
    removeFavorite(state, action) {
      state.items = state.items.filter(item => item.id !== action.payload.id);
    },
    clearFavorites(state) {
      state.items = [];
    },
    setFavorites(state, action) {
      state.items = action.payload;
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites, setFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
