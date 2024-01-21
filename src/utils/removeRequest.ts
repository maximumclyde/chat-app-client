import axios from "axios";
import { message } from "antd";

import store from "../store";
import { UserType } from "@types";
import { userActions } from "@store-actions";

async function removeRequest(id?: string) {
  if (!id) {
    return;
  }

  await axios
    .post<UserType>(`/users/removeRequest/${id}`)
    .then(({ data }) => {
      store.dispatch(
        userActions.updateUserProperties({
          requestsMade: data?.requestsMade,
        })
      );
    })
    .catch((err) => {
      void message.error({
        content: "Something went wrong while processing request",
        key: "requestError",
      });
      console.log("Error making request: ", err);
      throw err;
    });
}

export default removeRequest;
