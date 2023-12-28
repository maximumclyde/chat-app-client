import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FriendType = {
  _id: string;
  userName: string;
  userEmail: string;
  friendList: string[];
  avatar?: string;
};

const initialListState = [] as FriendType[];

const friendList = createSlice({
  name: "friendList",
  initialState: initialListState,
  reducers: {
    addFriend(state, action: PayloadAction<FriendType>) {
      state.push(action.payload);
      return state;
    },
    addFriends(state, action: PayloadAction<FriendType[]>) {
      for (let i = 0; i < action.payload.length; i++) {
        state.push(action.payload[i]);
      }
      return state;
    },
    removeFriend(state, action: PayloadAction<FriendType>) {
      const userIndex = state.findIndex(
        (el) => el?._id === action.payload?._id
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
