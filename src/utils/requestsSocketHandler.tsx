import axios from "axios";
import { notification } from "antd";

import store from "../store";
import { userActions, friendListActions } from "@store-actions";
import { FriendType } from "@types";
import { toArrayBuffer } from "@utils";

type RequestBodyType = {
    _id: string
}

type RequestType = {
    request: string,
    body: RequestBodyType
}

/**
 * Function that adds request event handlers to the socket instance
 */
function requestsSocketHandler(event: MessageEvent<string>) {
    const { request, body } = JSON.parse(event.data) as RequestType;

    if (request === "friend-request") {
      store.dispatch(
        userActions.addIdToUserProperties({ friendRequests: body._id })
      );
    } else if (request === "request-removed") {
      store.dispatch(
        userActions.removeIdFromUserProperties({ friendRequests: body._id })
      );
    } else if (request === "request-accept") {
      store.dispatch(
        userActions.removeIdFromUserProperties({ requestsMade: body._id })
      );
      store.dispatch(userActions.addIdToUserProperties({ friendList: body._id }));

      axios
        .get<FriendType>(`/users/${body._id}`)
        .then((res) => {
          let avatar = undefined;
          if (res.data?.avatar) {
            avatar = URL.createObjectURL(toArrayBuffer(res.data.avatar));
          }
          store.dispatch(friendListActions.addFriend({ ...res.data, avatar }));
          notification.success({
            message: (
              <span>
                <b>{res.data.userName}&nbsp;</b>has accepted your request!
              </span>
            ),
            duration: 3,
            placement: "bottomLeft",
          });
        })
        .catch((err) => {
          console.log("Error getting friend: ", err);
        });
    } else if (request === "request-decline") {
      store.dispatch(
        userActions.removeIdFromUserProperties({ requestsMade: body._id })
      );
    }
  
}

export default requestsSocketHandler;