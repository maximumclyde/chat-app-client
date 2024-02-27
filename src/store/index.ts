import { configureStore } from "@reduxjs/toolkit";

import groupList from "./groupList";
import friendList from "./friendList";
import preferences from "./preferences";
import userMessages from "./userMessages";
import authenticatedUser from "./authenticatedUser";

const store = configureStore({
  reducer: {
    preferences: preferences.reducer,
    authenticatedUser: authenticatedUser.reducer,
    userMessages: userMessages.reducer,
    friendList: friendList.reducer,
    groupList: groupList.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type GlobalStoreType = ReturnType<typeof store.getState>

export default store;
