import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      return [...action.payload];
    },
    addMessages(state, action: PayloadAction<MessageType[]>) {
      for (let i = 0; i < action.payload.length; i++) {
        state.push(action.payload[i]);
      }
      return state;
    },
  },
});

export const userMessageActions = userMessages.actions;

export default userMessages;
