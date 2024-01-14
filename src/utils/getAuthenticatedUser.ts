import axios from "axios";

import { UserType, PreferenceStateType, FriendType, GroupType } from "@types";
import { toArrayBuffer } from "@utils";

type ProfileResponse = {
  user: UserType;
  userPreferences: PreferenceStateType;
  friends: FriendType[];
  userGroups: GroupType[];
};

async function getAuthenticatedUser(): Promise<ProfileResponse> {
  const token = localStorage.getItem("authenticationToken");
  if (!token) {
    return Promise.reject("No authentication token");
  }

  try {
    const res = await axios.get<ProfileResponse>("/users/profile");

    const { user, userPreferences, friends, userGroups } = res.data;

    let avatar = undefined;
    if (user?.avatar) {
      avatar = window.URL.createObjectURL(toArrayBuffer(user?.avatar));
    }

    const fList = [];
    for (const friend of friends) {
      let fa = undefined;
      if (friend?.avatar) {
        fa = URL.createObjectURL(toArrayBuffer(friend?.avatar || ""));
      }

      fList.push({ ...friend, avatar: fa });
    }

    const gList = [];
    for (const group of userGroups) {
      let ga = undefined;
      if (group?.avatar) {
        ga = URL.createObjectURL(toArrayBuffer(group?.avatar || ""));
      }
      gList.push({ ...group, avatar: ga });
    }

    return {
      userPreferences,
      user: {
        ...user,
        avatar,
      },
      friends: fList,
      userGroups: gList,
    };
  } catch (err) {
    return Promise.reject(err);
  }
}

export default getAuthenticatedUser;
