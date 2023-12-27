import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { Loading } from "@ui-components";

const AuthenticatedLayout = lazy(
  () => import("./components/AuthenticatedLayout/AuthenticatedLayout")
);

function AuthenticatedRoutes() {
  return (
    <Suspense fallback={<Loading loading={true} />}>
      <Routes>
        <Route path="/" element={<AuthenticatedLayout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default AuthenticatedRoutes;
