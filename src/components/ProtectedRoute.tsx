import { Navigate, useLocation } from "react-router";
import type { JSX } from "react/jsx-runtime";
import { StorageUsuario } from "../services/storageUsuario";
import type { Usuario } from "../types/index";
import { getDashboardRouteForRole } from "../utils/authValidation";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: Usuario["rol"][];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps): JSX.Element {
  const location = useLocation();
  const usuario = StorageUsuario.getUsuarioSesion();

  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(usuario.rol)) {
    return <Navigate to={getDashboardRouteForRole(usuario.rol)} replace />;
  }

  return children;
}
