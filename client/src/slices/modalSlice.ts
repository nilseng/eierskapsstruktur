import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modalHandler",
  initialState: {
    value: false,
  },
  reducers: {
    open: (state) => {
      state.value = true;
    },
    close: (state) => {
      state.value = false;
    },
  },
});

export const { open, close } = modalSlice.actions;