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

type UserArrayActionType = Omit<
  UpdateActionType,
  "_id" | "userName" | "userEmail" | "createdAt" | "avatar"
>;

type ArrayPayloadProperty = {
  friendList?: string;
  friendRequests?: string;
  requestsMade?: string;
  groupList?: string;
  userBlock?: string;
  groupBlock?: string;
  blockedBy?: string;
};

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
      return {
        ...state,
        ...action.payload,
      };
    },
    addIdToUserProperties(
      state: UserType,
      action: PayloadAction<ArrayPayloadProperty>
    ) {
      const tmp = {} as UserArrayActionType;
      for (const property in action.payload) {
        const p = property as keyof UserArrayActionType;
        tmp[p] = [...state[p], action.payload?.[p] || ""];
      }

      return {
        ...state,
        ...tmp,
      };
    },
    removeIdFromUserProperties(
      state: UserType,
      action: PayloadAction<ArrayPayloadProperty>
    ) {
      const tmp = {} as UserArrayActionType;
      for (const property in action.payload) {
        const p = property as keyof UserArrayActionType;
        tmp[p] = state[p].filter((e) => e !== action.payload[p]);
      }

      return {
        ...state,
        ...tmp,
      };
    },
    userLogout() {
      localStorage.removeItem("authenticationToken");
      location.replace(`${location.protocol}//${location.host}/`);
      return {} as UserType;
    },
  },
});

export const userActions = authenticatedUser.actions;

export default authenticatedUser;
