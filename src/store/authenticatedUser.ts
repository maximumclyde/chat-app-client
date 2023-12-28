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
  createdAt: string;
  avatar?: string;
};

type UpdateActionType = Partial<UserType>;

const initUser = {} as UserType;

const authenticatedUser = createSlice({
  name: "authenticatedUser",
  initialState: initUser,
  reducers: {
    setAuthenticatedUser(_, action: PayloadAction<UserType>) {
      return action.payload;
    },
    updateUserProperties(
      state: UserType,
      action: PayloadAction<UpdateActionType>
    ) {
      const updated = { ...state };
      const payload = { ...action.payload };
      Object.assign(updated, payload);
      return updated;
    },
    userLogout() {
      localStorage.removeItem("authenticationToken");
      return {} as UserType;
    },
  },
});

export const authenticatedUserActions = authenticatedUser.actions;

export default authenticatedUser;
