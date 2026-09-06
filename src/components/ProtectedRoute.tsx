import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  role?: string;
}

function ProtectedRoute({ children, role }: Props) {
  const token = localStorage.getItem("token");
  const utilisateurString = localStorage.getItem("utilisateur");

  let utilisateur: {
    nom?: string;
    email?: string;
    role?: string;
  } | null = null;

  try {
    if (utilisateurString) {
      utilisateur = JSON.parse(utilisateurString);
    }
  } catch (error) {
    console.error("Session utilisateur invalide :", error);
    utilisateur = null;
  }

  // ==========================================
  // PAS DE SESSION
  // ==========================================
  if (!token || !utilisateur) {
    localStorage.removeItem("token");
    localStorage.removeItem("utilisateur");

    return <Navigate to="/login" replace />;
  }

  // ==========================================
  // VÉRIFICATION DU RÔLE
  // ==========================================
  if (role && utilisateur.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  // ==========================================
  // ACCÈS AUTORISÉ
  // ==========================================
  return <>{children}</>;
}

export default ProtectedRoute;