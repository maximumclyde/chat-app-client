import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthenticatedLayout from "./AuthenticatedLayout";
import Settings from "../Settings/Settings";
import { Loading } from "@ui-components";

const ChatPage = lazy(() => import("./ChatPage/ChatPage"));

function AuthenticatedRoutes() {
  return (
    <AuthenticatedLayout>
      <Suspense fallback={<Loading loading={true} />}>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </AuthenticatedLayout>
  );
}

export default AuthenticatedRoutes;
