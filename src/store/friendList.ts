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
    setupFriends(_, action: PayloadAction<FriendType[]>) {
      return [...action.payload];
    },
    addFriend(state, action: PayloadAction<FriendType>) {
      const tmp = [...state];
      tmp.push(action.payload);
      return tmp;
    },
    addFriends(state, action: PayloadAction<FriendType[]>) {
      const tmp = [...state];
      for (let i = 0; i < action.payload.length; i++) {
        tmp.push(action.payload[i]);
      }
      return tmp;
    },
    removeFriend(state, action: PayloadAction<FriendType>) {
      const tmp = [...state];
      const userIndex = tmp.findIndex((el) => el?._id === action.payload?._id);
      if (userIndex > -1) {
        tmp.splice(userIndex, 1);
        return tmp;
      }
    },
  },
});

export const friendListActions = friendList.actions;

export default friendList;
