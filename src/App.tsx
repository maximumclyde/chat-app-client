import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConfigProvider, theme } from "antd";

import { getAuthenticatedUser } from "@utils";
import { authenticatedUserActions } from "./store/authenticatedUser";
import { Loading } from "@ui-components";
import RoutesConfig from "./Routes";

import { GlobalStoreType } from "@types";

function App() {
  const preferences = useSelector(
    (state: GlobalStoreType) => state.preferences
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    getAuthenticatedUser()
      .then((user) => {
        setIsAuthenticated(true);
        dispatch(authenticatedUserActions.setAuthenticatedUser(user));
        setLoading(false);
      })
      .catch((err) => {
        setIsAuthenticated(false);
        setLoading(false);
        console.log("Error getting user: ", err?.message || err);
      });
  }, [dispatch]);

  return (
    <Loading loading={loading}>
      <ConfigProvider
        theme={{
          algorithm:
            preferences.colorTheme === "light"
              ? theme.defaultAlgorithm
              : theme.darkAlgorithm,
        }}
      >
        <RoutesConfig
          {...{
            isAuthenticated,
            preferences,
          }}
        />
      </ConfigProvider>
    </Loading>
  );
}

export default App;
