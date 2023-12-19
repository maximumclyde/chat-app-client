import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { Loading } from "@ui-components";

const HomePage = lazy(() => import("./components/HomePage/HomePage"));
const SignUpPage = lazy(() => import("./components/SignUpPage/SignUpPage"));
const LoginPage = lazy(() => import("./components/LoginPage/LoginPage"));
const UnauthenticatedLayout = lazy(
  () => import("./components/UnauthenticatedLayout/UnauthenticatedLayout")
);

function UnauthenticatedRoutes() {
  return (
    <UnauthenticatedLayout>
      <Suspense fallback={<Loading loading={true} />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </UnauthenticatedLayout>
  );
}

export default UnauthenticatedRoutes;
