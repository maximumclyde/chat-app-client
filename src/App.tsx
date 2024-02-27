import { useState, useEffect, lazy } from "react";
import { message } from "antd";

import socket from "@socket";
import { Loading } from "@ui-components";
import { getAuthenticatedUser } from "@utils";
import { useAppSelector, useAppDispatch } from "@hooks";
import {
  userActions,
  groupListActions,
  preferenceActions,
  friendListActions,
} from "@store-actions";

const AuthenticatedRoutes = lazy(
  () => import("./components/AuthenticatedRoutes/AuthenticatedRoutes")
);

const UnauthenticatedRoutes = lazy(
  () => import("./components/UnauthenticatedRoutes/UnauthenticatedRoutes")
);

const providers = {
  auth: AuthenticatedRoutes,
  noAuth: UnauthenticatedRoutes,
};

function App() {
  const authenticatedUser = useAppSelector((state) => state.authenticatedUser);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let call = true;

    if (call) {
      getAuthenticatedUser()
        .then((res) => {
          const { user, userPreferences, friends, userGroups } = res;
          dispatch(userActions.setAuthenticatedUser(user));
          dispatch(preferenceActions.preferencesSetup(userPreferences));
          dispatch(friendListActions.setupFriends(friends));
          dispatch(groupListActions.setupGroups(userGroups));
          setIsAuthenticated(true);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Error getting user: ", err?.message || err);
          setIsAuthenticated(false);
          setLoading(false);
        });
    }

    return () => {
      call = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      return;
    }

    function send() {
      socket.send(
        JSON.stringify({
          request: "create-session",
          body: {
            userId: authenticatedUser._id,
          },
        })
      );
    }

    if (isAuthenticated && authenticatedUser._id) {
      if (socket.readyState !== WebSocket.OPEN) {
        socket.onopen = send;
      } else {
        send();
      }

      socket.onclose = function () {
        void message.error({
          content: "Something went wrong! Connection was lost.",
          key: "socketClose",
        });
      };
    } else {
      socket.close();
    }
  }, [isAuthenticated, authenticatedUser?._id, loading]);

  const RouteProvider = providers[isAuthenticated ? "auth" : "noAuth"];

  return (
    <Loading loading={loading}>
      <RouteProvider />
    </Loading>
  );
}

export default App;
