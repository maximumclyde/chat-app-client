import axios from "axios";
import { message } from "antd";

import store from "../store";
import { UserType, FriendType } from "@types";
import { userActions } from "@store-actions";

async function acceptRequest(friend: FriendType) {
    await axios
      .post<UserType>(`/users/decline/${friend._id}`)
      .then((res) => {
        store.dispatch(
          userActions.updateUserProperties({
            friendList: res.data.friendList,
            friendRequests: res.data.friendRequests,
          })
        );

      })
      .catch((err) => {
        void message.error({
          content: `Something went wrong while trying to decline the request`,
          key: "userAcceptError",
        });
        console.log("Error declining the request: ", err);
        throw err;
      });
}

export default acceptRequest;