import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type GroupType = {
  groupName: string;
  groupMembers: string[];
  groupAdmins: string[];
  createdAt: string;
  avatar?: Blob;
  createdBy: {
    name: string;
    id: string;
  };
};

const initialState = [] as GroupType[];

const groupList = createSlice({
  name: "groupList",
  initialState,
  reducers: {
    setupGroups(_, action: PayloadAction<GroupType[]>) {
      return action.payload;
    },
  },
});

export const groupListActions = groupList.actions;
export default groupList;
