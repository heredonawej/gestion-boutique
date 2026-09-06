import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  role?: string;
}

function ProtectedRoute({ children, role }: Props) {
  const token = localStorage.getItem("token");

  let utilisateur: {
    role?: string;
  } = {};

  try {
    utilisateur = JSON.parse(
      localStorage.getItem("utilisateur") || "{}"
    );
  } catch (error) {
    console.error("Erreur lors de la lecture de l'utilisateur :", error);
  }

  // =====================================
  // PAS CONNECTÉ
  // =====================================
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // =====================================
  // VÉRIFICATION DU RÔLE
  // =====================================
  if (role && utilisateur.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  // =====================================
  // ACCÈS AUTORISÉ
  // =====================================
  return <>{children}</>;
}

export default ProtectedRoute;