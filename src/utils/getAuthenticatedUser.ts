import axios from "axios";

import { UserType } from "@types";

async function getAuthenticatedUser(): Promise<UserType> {
  const token = window.localStorage.getItem("authenticationToken");
  if (!token) {
    return Promise.reject("No authentication token");
  }

  try {
    const user = await axios.get<UserType>("/users/profile");
    return user.data;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default getAuthenticatedUser;
