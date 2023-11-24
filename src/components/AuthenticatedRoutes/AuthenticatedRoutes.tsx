import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthenticatedLayout from "./AuthenticatedLayout";
import Settings from "../Settings/Settings";
import { Loading } from "@ui-components";
import { PreferenceStateType } from "@types";

const ChatPage = lazy(() => import("./ChatPage/ChatPage"));

type RoutesProps = {
  preferences: PreferenceStateType;
};

function AuthenticatedRoutes(props: RoutesProps) {
  const { preferences } = props;

  return (
    <AuthenticatedLayout>
      <Suspense fallback={<Loading loading={true} />}>
        <Routes>
          <Route path="/" element={<ChatPage preferences={preferences} />} />
          <Route
            path="/settings"
            element={<Settings preferences={preferences} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </AuthenticatedLayout>
  );
}

export default AuthenticatedRoutes;
