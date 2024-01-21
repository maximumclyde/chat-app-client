import axios from "axios";
import { message } from "antd";

import store from "../store";
import { UserType } from "@types";
import {
  userActions,
  friendListActions,
  userMessageActions,
} from "@store-actions";

async function removeFriend(id?: string) {
  if (!id) {
    return;
  }

  await axios
    .post<UserType>(`/users/unfriend/${id}`)
    .then(({ data }) => {
      store.dispatch(
        userActions.updateUserProperties({ friendList: data?.friendList })
      );
      store.dispatch(friendListActions.removeFriend(id));
      store.dispatch(userMessageActions.removeUserMessages(id));
    })
    .catch((err) => {
      void message.error({
        content: "Something went wrong while trying to unfriend",
        key: "unfriendError",
      });
      console.log("Error unfriending user: ", err);
      throw err;
    });
}

export default removeFriend;
