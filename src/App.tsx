import { useState, useEffect, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";

import socket from "@socket";
import { getAuthenticatedUser, toArrayBuffer } from "@utils";
import {
  preferenceActions,
  userActions,
  friendListActions,
  groupListActions,
} from "@store-actions";
import { Loading } from "@ui-components";
import { GlobalStoreType } from "@types";

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
  const authenticatedUser = useSelector(
    (state: GlobalStoreType) => state.authenticatedUser
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    getAuthenticatedUser()
      .then((res) => {
        const { user, userPreferences, friends, userGroups } = res;

        let avatar = undefined;
        if (user?.avatar) {
          avatar = window.URL.createObjectURL(toArrayBuffer(user?.avatar));
        }

        const fList = [];
        for (const friend of friends) {
          let fa = undefined;
          if (friend?.avatar) {
            fa = URL.createObjectURL(toArrayBuffer(friend?.avatar || ""));
          }

          fList.push({ ...friend, avatar: fa });
        }

        const gList = [];
        for (const group of userGroups) {
          let ga = undefined;
          if (group?.avatar) {
            ga = URL.createObjectURL(toArrayBuffer(group?.avatar || ""));
          }
          gList.push({ ...group, avatar: ga });
        }

        dispatch(userActions.setAuthenticatedUser({ ...user, avatar }));
        dispatch(preferenceActions.preferencesSetup(userPreferences));
        dispatch(friendListActions.setupFriends(fList));
        dispatch(groupListActions.setupGroups(gList));
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error getting user: ", err?.message || err);
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && authenticatedUser._id) {
      socket.send(
        JSON.stringify({
          request: "create-session",
          body: {
            userId: authenticatedUser._id,
          },
        })
      );

      socket.onclose = function () {
        void message.error({
          content: "Something went wrong! Connection was lost.",
          key: "socketClose",
        });
      };
    }
  }, [isAuthenticated, authenticatedUser?._id]);

  const RouteProvider = providers[isAuthenticated ? "auth" : "noAuth"];

  return (
    <Loading loading={loading}>
      <RouteProvider />
    </Loading>
  );
}

export default App;
