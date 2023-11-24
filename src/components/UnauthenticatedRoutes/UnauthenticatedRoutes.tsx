import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UnauthenticatedLayout from "./UnauthenticatedLayout";

import { Loading } from "@ui-components";

const HomePage = lazy(() => import("./HomePage/HomePage"));
const SignUpPage = lazy(() => import("./SignUpPage/SignUpPage"));
const LoginPage = lazy(() => import("./LoginPage/LoginPage"));

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
