import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  role?: string;
}

function ProtectedRoute({ children, role }: Props) {
  const utilisateur = JSON.parse(
    localStorage.getItem("utilisateur") || "{}"
  );

  // Pas connecté
  if (!utilisateur.token && !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  // Vérification du rôle
  if (role && utilisateur.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;