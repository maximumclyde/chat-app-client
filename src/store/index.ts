import { configureStore } from "@reduxjs/toolkit";

import preferences from "./preferences";
import authenticatedUser from "./authenticatedUser";
import userMessages from "./userMessages";
import friendList from "./friendList";

import { PreferenceStateType } from "./preferences";
import { UserType } from "./authenticatedUser";
import { MessageType } from "./userMessages";

const store = configureStore({
  reducer: {
    preferences: preferences.reducer,
    authenticatedUser: authenticatedUser.reducer,
    userMessages: userMessages.reducer,
    friendList: friendList.reducer,
  },
});

export type GlobalStoreType = {
  preferences: PreferenceStateType;
  authenticatedUser: UserType;
  userMessages: MessageType[];
  friendList: UserType[];
};

export default store;
