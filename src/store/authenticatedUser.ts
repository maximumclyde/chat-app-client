import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserType = {
  _id: string;
  userName: string;
  userEmail: string;
  friendList: string[];
  friendRequests: string[];
  requestsMade: string[];
  groupList: string[];
  userBlock: string[];
  groupBlock: string[];
  blockedBy: string[];
  createdAt: number;
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
