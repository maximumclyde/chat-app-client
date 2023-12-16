import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PreferenceStateType = {
  userId: string;
  preferences: any;
};

const preferences = createSlice({
  name: "preferences",
  initialState: {
    userId: "",
    preferences: {},
  },
  reducers: {
    preferencesSetup(_, action: PayloadAction<PreferenceStateType>) {
      return action.payload;
    },
    changePreferences(state, action: PayloadAction<any>) {
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };
    },
  },
});

export const preferenceActions = preferences.actions;

export default preferences;
