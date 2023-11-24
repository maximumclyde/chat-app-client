import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserType } from "@types";

const initialListState = [] as UserType[];

const friendList = createSlice({
  name: "friendList",
  initialState: initialListState,
  reducers: {
    addFriend(state, action: PayloadAction<UserType>) {
      state.push(action.payload);
      return state;
    },
    addFriends(state, action: PayloadAction<UserType[]>) {
      for (let i = 0; i < action.payload.length; i++) {
        state.push(action.payload[i]);
      }
      return state;
    },
    removeFriend(state, action: PayloadAction<UserType>) {
      const userIndex = state.findIndex(
        (el) => el?.userId === action.payload?.userId
      );
      if (userIndex > -1) {
        state.splice(userIndex, 1);
        return state;
      }
    },
  },
});

export const friendListActions = friendList.actions;

export default friendList;
