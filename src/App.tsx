import { useState, useEffect, lazy } from "react";
import { useDispatch } from "react-redux";

import { getAuthenticatedUser } from "@utils";
import {
  preferenceActions,
  authenticatedUserActions,
  friendListActions,
  groupListActions,
} from "@store-actions";
import { toArrayBuffer } from "@utils";
import { Loading } from "@ui-components";

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
        dispatch(
          authenticatedUserActions.setAuthenticatedUser({ ...user, avatar })
        );
        dispatch(preferenceActions.preferencesSetup(userPreferences));
        dispatch(friendListActions.addFriends(friends));
        dispatch(groupListActions.setupGroups(userGroups));
        setIsAuthenticated(true);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error getting user: ", err?.message || err);
        setIsAuthenticated(false);
        setLoading(false);
      });
  }, [dispatch]);

  const RouteProvider = providers[isAuthenticated ? "auth" : "noAuth"];

  return (
    <Loading loading={loading}>
      <RouteProvider />
    </Loading>
  );
}

export default App;
