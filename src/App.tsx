import { useState, useEffect, lazy } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConfigProvider, theme } from "antd";

import { getAuthenticatedUser } from "@utils";
import { authenticatedUserActions } from "./store/authenticatedUser";
import { preferenceActions } from "./store/preferences";
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
  const { preferences } = useSelector(
    (state: GlobalStoreType) => state.preferences || {}
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    getAuthenticatedUser()
      .then((res) => {
        const { user, userPreferences } = res;
        dispatch(authenticatedUserActions.setAuthenticatedUser(user));
        dispatch(preferenceActions.preferencesSetup(userPreferences));
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
      <ConfigProvider
        theme={{
          algorithm:
            preferences?.theme === "light"
              ? theme.defaultAlgorithm
              : theme.darkAlgorithm,
        }}
      >
        <RouteProvider />
      </ConfigProvider>
    </Loading>
  );
}

export default App;
