// AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { roleRoutes } from '../routes/RoleRoutes';
import AppLayout from "../layout/AppLayout";
import NotFound from "../pages/OtherPage/NotFound";
import CustomAppLayout from "../layout/CustomAppLayout";
import SignedOut from "../pages/SignedOut";
import ProtectedRoute from "../routes/ProtectedRoute";
import RoleBasedRoute from '../routes/RoleBasedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signed-out" element={<SignedOut />} />
      <Route path="/" element={<RoleBasedRoute />} />

      <Route element={<ProtectedRoute />}>
        {Object.entries(roleRoutes).map(([role, routes]) => {
          const layout = role === 'attendee' ? <AppLayout /> : <CustomAppLayout />;
          return (
            <Route key={role} path={`/${role}/*`} element={layout}>
              <Route index element={<Navigate to={routes[0].path} replace />} />
              {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Route>
          );
        })}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
