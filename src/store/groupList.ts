import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface GroupType {
  _id: string;
  groupName: string;
  groupMembers: string[];
  groupAdmins: string[];
  createdAt: string;
  avatar?: string;
  createdBy: {
    name: string;
    id: string;
  };
}

const initialState = [] as GroupType[];

interface GroupUpdateProperties extends Partial<Omit<GroupType, "_id">> {
  _id: string;
}

type IdUpdateType = {
  _id: string;
  groupMembers?: string;
  groupAdmins?: string;
};

const groupList = createSlice({
  name: "groupList",
  initialState,
  reducers: {
    setupGroups(_, action: PayloadAction<GroupType[]>) {
      return action.payload;
    },
    addGroup(state, action: PayloadAction<GroupType>) {
      return [...state, action.payload];
    },
    updateGroupProperty(state, action: PayloadAction<GroupUpdateProperties>) {
      const groupIndex = state.findIndex(
        ({ _id }) => _id === action.payload._id
      );
      if (groupIndex === -1) {
        return state;
      }

      const tmp = [...state];
      tmp[groupIndex] = {
        ...tmp[groupIndex],
        ...action.payload,
      };

      return tmp;
    },
    removeGroup(state, action: PayloadAction<string>) {
      return state.filter(({ _id }) => _id !== action.payload);
    },
    addIdToGroup(state, action: PayloadAction<IdUpdateType>) {
      const groupIndex = state.findIndex(
        ({ _id }) => _id === action.payload._id
      );
      if (groupIndex === -1) {
        return state;
      }

      let shouldUpdate = false;

      const tmp = [...state];
      if (action.payload.groupAdmins) {
        if (
          !tmp[groupIndex]["groupAdmins"].includes(action.payload.groupAdmins)
        ) {
          shouldUpdate = true;
          tmp[groupIndex]["groupAdmins"] = [
            ...tmp[groupIndex]["groupAdmins"],
            action.payload.groupAdmins,
          ];
        }
      }

      if (action.payload.groupMembers) {
        if (
          !tmp[groupIndex]["groupMembers"].includes(action.payload.groupMembers)
        ) {
          shouldUpdate = true;
          tmp[groupIndex]["groupMembers"] = [
            ...tmp[groupIndex]["groupMembers"],
            action.payload.groupMembers,
          ];
        }
      }

      if (shouldUpdate) {
        return tmp;
      }

      return state;
    },
    removeIdFromGroup(state, action: PayloadAction<IdUpdateType>) {
      const groupIndex = state.findIndex(
        ({ _id }) => _id === action.payload._id
      );
      if (groupIndex === -1) {
        return state;
      }

      const tmp = [...state];
      if (action.payload.groupAdmins) {
        tmp[groupIndex]["groupAdmins"] = tmp[groupIndex]["groupAdmins"].filter(
          (id) => id !== action.payload.groupAdmins
        );
      }

      if (action.payload.groupMembers) {
        tmp[groupIndex]["groupMembers"] = tmp[groupIndex][
          "groupMembers"
        ].filter((id) => id !== action.payload.groupMembers);
      }

      return tmp;
    },
  },
});

export const groupListActions = groupList.actions;
export default groupList;
