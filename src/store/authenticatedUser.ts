import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  userId: string;
  fullName: string;
  userAlias: string;
  email: string;
};

const initUser = {} as UserType;

const authenticatedUser = createSlice({
  name: "authenticatedUser",
  initialState: initUser,
  reducers: {
    setAuthenticatedUser(_, action: PayloadAction<UserType>) {
      return action.payload;
    },
    userLogout() {
      window.localStorage.removeItem("authenticationToken");
      return {} as UserType;
    },
  },
});

export const authenticatedUserActions = authenticatedUser.actions;

export default authenticatedUser;
