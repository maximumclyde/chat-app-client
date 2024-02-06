import store from "../store";
import { userMessageActions } from "@store-actions";
import { MessageType } from "@types";

type RequestType = {
  request: string;
  body: MessageType;
};

type AdditionalParamsType = {
  onMessageReceived: (sender: string) => any;
};

function messageSocketHandler(
  event: MessageEvent<string>,
  additionalParams: AdditionalParamsType
) {
  const { request, body } = JSON.parse(event.data) as RequestType;

  if (request === "message-received" || request === "group-message") {
    store.dispatch(userMessageActions.addMessages([body]));

    const sender = body?.groupId || body?.senderId;
    additionalParams.onMessageReceived(sender);
  }
}

export default messageSocketHandler;