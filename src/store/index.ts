import { configureStore } from "@reduxjs/toolkit";

import preferences, { PreferenceStateType } from "./preferences";
import authenticatedUser, { UserType } from "./authenticatedUser";
import userMessages, { MessageType } from "./userMessages";
import friendList, { FriendType } from "./friendList";
import groupList, { GroupType } from "./groupList";

const store = configureStore({
  reducer: {
    preferences: preferences.reducer,
    authenticatedUser: authenticatedUser.reducer,
    userMessages: userMessages.reducer,
    friendList: friendList.reducer,
    groupList: groupList.reducer,
  },
});

export type GlobalStoreType = {
  preferences: PreferenceStateType;
  authenticatedUser: UserType;
  userMessages: MessageType[];
  friendList: FriendType[];
  groupList: GroupType[];
};

export default store;
