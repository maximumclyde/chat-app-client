import axios from "axios";
import { message } from "antd";

import store from "../store";
import { UserType } from "@types";
import {
  userActions,
  friendListActions,
  userMessageActions,
} from "@store-actions";

async function blockUser(id?: string, name = "user") {
  if (!id) {
    return;
  }

  await axios
    .post<UserType>(`/users/block/${id}`)
    .then(({ data }) => {
      store.dispatch(
        userActions.updateUserProperties({
          friendList: data.friendList,
          friendRequests: data.friendRequests,
          requestsMade: data.requestsMade,
          userBlock: data.userBlock,
          blockedBy: data.blockedBy,
        })
      );

      store.dispatch(friendListActions.removeFriend(id));
      store.dispatch(userMessageActions.removeUserMessages(id));
    })
    .catch((err) => {
      void message.error({
        content: `Something went wrong while trying to block ${name}`,
        key: "blockError",
      });
      console.log("Error blocking user: ", err);
      throw err;
    });
}

export default blockUser;