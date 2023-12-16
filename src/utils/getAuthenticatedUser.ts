import axios from "axios";

import { UserType, PreferenceStateType } from "@types";

type ProfileResponse = {
  user: UserType;
  userPreferences: PreferenceStateType;
};

async function getAuthenticatedUser(): Promise<ProfileResponse> {
  const token = window.localStorage.getItem("authenticationToken");
  if (!token) {
    return Promise.reject("No authentication token");
  }

  try {
    const user = await axios.get<ProfileResponse>("/users/profile");
    return user.data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default getAuthenticatedUser;
