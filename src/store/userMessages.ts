import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

export type MessageType = {
  content: string;
  createdAt: string;
  senderName: string;
  senderId: string;
  receiverId: string;
  groupId: string;
  messageStatus: string;
  _id: string;
};
const initialMessageArray = [] as MessageType[];

const userMessages = createSlice({
  name: "userMessages",
  initialState: initialMessageArray,
  reducers: {
    setupMessages(_, action: PayloadAction<MessageType[]>) {
      return [...action.payload].sort(
        (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
      );
    },
    addMessages(state, action: PayloadAction<MessageType[]>) {
      const tmp = [...state];
      for (let i = 0; i < action.payload.length; i++) {
        tmp.push(action.payload[i]);
      }
      return tmp.sort(
        (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
      );
    },
    removeUserMessages(state, action: PayloadAction<string>) {
      return state.filter(({ senderId, receiverId, groupId }) => {
        if (groupId) {
          return true;
        }

        return senderId !== action.payload && receiverId !== action.payload;
      });
    },
    removeGroupMessages(state, action: PayloadAction<string>) {
      return state.filter(({ groupId }) => {
        if (!groupId) {
          return true;
        }
        return groupId !== action.payload;
      });
    },
  },
});

export const userMessageActions = userMessages.actions;

export default userMessages;
