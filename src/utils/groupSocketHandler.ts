import axios from "axios";

import store from "../store";
import {
  userActions,
  groupListActions,
  userMessageActions,
} from "@store-actions";
import { GroupType } from "@types";
import { toArrayBuffer } from "@utils";

type RequestBody = {
  groupId: string;
  avatar: string;
  addedUser: string;
  isAdmin?: string;
  removedUser: string;
  newAdmin: string;
  removedAdmin: string;
};

type RequestEvent = {
  request: string;
  body: RequestBody;
};

/**
 * Function that adds group event handlers to the socket instance
 */
async function groupSocketHandler(event: MessageEvent<string>) {
  const { request, body } = JSON.parse(event.data) as RequestEvent;

  if (request === "group-create" || request === "added-to-group") {
    try {
      const newGroup = await axios
        .get<GroupType>(`/groups/${body.groupId}`)
        .then(({ data }) => data);

      store.dispatch(
        userActions.addIdToUserProperties({ groupList: newGroup._id })
      );
      store.dispatch(groupListActions.addGroup(newGroup));
    } catch (err) {
      console.log("Error getting group: ", err);
    }
  } else if (request === "group-avatar-change") {
    const newAvatarUri = URL.createObjectURL(toArrayBuffer(body.avatar));
    store.dispatch(
      groupListActions.updateGroupProperty({
        _id: body.groupId,
        avatar: newAvatarUri,
      })
    );
  } else if (request === "group-delete") {
    store.dispatch(groupListActions.removeGroup(body.groupId));
    store.dispatch(userMessageActions.removeGroupMessages(body.groupId));
  } else if (request === "group-add") {
    store.dispatch(
      groupListActions.addIdToGroup({
        _id: body.groupId,
        groupMembers: body.addedUser,
      })
    );
  } else if (request === "removed-from-group") {
    store.dispatch(
      userActions.removeIdFromUserProperties({ groupList: body.groupId })
    );
    store.dispatch(groupListActions.removeGroup(body.groupId));
    store.dispatch(userMessageActions.removeGroupMessages(body.groupId));
  } else if (request === "group-remove") {
    if (body?.isAdmin) {
      store.dispatch(
        groupListActions.addIdToGroup({
          groupAdmins: body.isAdmin,
          _id: body.groupId,
        })
      );
    }

    store.dispatch(
      groupListActions.removeIdFromGroup({
        groupMembers: body.removedUser,
        groupAdmins: body.removedUser,
        _id: body.groupId,
      })
    );
  } else if (request === "added-admin") {
    store.dispatch(
      groupListActions.addIdToGroup({
        groupAdmins: body.newAdmin,
        _id: body.groupId,
      })
    );
  } else if (request === "removed-admin") {
    store.dispatch(
      groupListActions.removeIdFromGroup({
        groupAdmins: body.removedAdmin,
        _id: body.groupId,
      })
    );
  }
}

export default groupSocketHandler;
