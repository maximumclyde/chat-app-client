import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PreferenceStateType = {
  [preference: string]: any;
};

const preferences = createSlice({
  name: "preferences",
  initialState: {
    colorTheme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  },
  reducers: {
    changePreference(state, action: PayloadAction<PreferenceStateType>) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const preferenceActions = preferences.actions;

export default preferences;
