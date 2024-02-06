import store from "../store";
import {
  userActions,
  friendListActions,
  userMessageActions,
} from "@store-actions";
import { ChatHandle } from "../components/AuthenticatedRoutes/components/ChatPage/ChatPage";

type RequestBodyType = {
  _id: string;
  userName?: string
};

type RequestType = {
  request: string;
  body: RequestBodyType;
};

type AdditionalParamsType = {
  chatRef: React.RefObject<ChatHandle>;
};

function usersSocketHandler(
  event: MessageEvent<string>,
  additionalParams: AdditionalParamsType
) {
  const { request, body } = JSON.parse(event.data) as RequestType;
  const { chatRef } = additionalParams;

  if (request === "unfriended" || request === "blocked") {
    chatRef.current?.removeLiveChatView(body._id);
    store.dispatch(
      userActions.removeIdFromUserProperties({ friendList: body._id })
    );
    store.dispatch(userMessageActions.removeUserMessages(body._id));
    store.dispatch(friendListActions.removeFriend(body._id));
  }

  if (request === "blocked") {
    store.dispatch(userActions.addIdToUserProperties({ blockedBy: body._id }));
    store.dispatch(
      userActions.removeIdFromUserProperties({
        friendRequests: body._id,
        requestsMade: body._id,
      })
    );
  }
}

export default usersSocketHandler;