import type { FC } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  // useLocation,
} from "react-router-dom";

import { ROUTE_CONSTANTS } from "@shared/config/routes";
import { Home } from "@pages/Home";
import { SignIn } from "@pages/SignIn";
import { NotFound } from "@pages/NotFound";
import { ServerError } from "@pages/ServerError";
import { Layout } from "@widgets/Layout";
import { DashboardPage } from "./Dashboard/ui";
import { Profile } from "./Profile";
import { SignUp } from "./SignUp";
import { UploadAwards } from "@pages/UploadAwards";
import { Candidates } from "@pages/Candidates";
import { Protocol } from "@pages/Protocol";
import { Certificates } from "@pages/Certificates";
import { TemplateLibrary } from "@pages/TemplateLibrary";

// const ProtectedRoute: FC<{ children: ReactNode }> = observer(({ children }) => {
//   const location = useLocation();

//   if (!authStore.isAuthChecked) {
//     return <Loader />;
//   }

//   if (!authStore.isAuthenticated) {
//     // Сохраняем информацию о том, куда перенаправлять после авторизации
//     return (
//       <Navigate
//         to={ROUTE_CONSTANTS.SIGNIN}
//         state={{ from: location }}
//         replace
//       />
//     );
//   }

//   return <>{children}</>;
// });

export const Router: FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Публичные маршруты */}
          <Route path={ROUTE_CONSTANTS.SIGNIN} element={<SignIn />} />
          <Route path={ROUTE_CONSTANTS.SIGNUP} element={<SignUp />} />
          {/* Защищенные маршруты */}
          <Route path={ROUTE_CONSTANTS.HOME} element={<Home />} />
          {/* Открытые маршруты */}
          <Route path={ROUTE_CONSTANTS.NOTFOUND} element={<NotFound />} />
          <Route path={ROUTE_CONSTANTS.SERVERERROR} element={<ServerError />} />
          <Route path={ROUTE_CONSTANTS.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTE_CONSTANTS.PROFILE} element={<Profile />} />

          {/* Добавленные маршруты */}
          <Route path={ROUTE_CONSTANTS.UPLOADAWARDS} element={<UploadAwards />} />
          <Route path={ROUTE_CONSTANTS.CANDIDATES} element={<Candidates />} />
          <Route path={ROUTE_CONSTANTS.PROTOCOL} element={<Protocol />} />
          <Route path={ROUTE_CONSTANTS.CERTIFICATES} element={<Certificates />} />
          <Route
            path={ROUTE_CONSTANTS.TEMPLATELIBRARY}
            element={<TemplateLibrary />}
          />

          {/* Редирект для несуществующих путей */}
          <Route
            path="*"
            element={<Navigate to={ROUTE_CONSTANTS.NOTFOUND} replace />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};
