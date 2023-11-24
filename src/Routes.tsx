import React from "react";
import { PreferenceStateType } from "@types";

const AuthenticatedRoutes = React.lazy(
  () => import("./components/AuthenticatedRoutes/AuthenticatedRoutes")
);
const UnauthenticatedRoutes = React.lazy(
  () => import("./components/UnauthenticatedRoutes/UnauthenticatedRoutes")
);

type RoutesProps = {
  isAuthenticated: boolean;
  preferences: PreferenceStateType;
};

const providers = {
  auth: AuthenticatedRoutes,
  noAuth: UnauthenticatedRoutes,
};

function RoutesConfig(props: RoutesProps) {
  const { isAuthenticated, preferences } = props;
  const RouteProvider = providers[isAuthenticated ? "auth" : "noAuth"];

  return <RouteProvider preferences={preferences} />;
}

export default RoutesConfig;
