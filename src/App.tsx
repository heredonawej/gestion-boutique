import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Produits from "./pages/Produits";
import Ventes from "./pages/Ventes";
import Historique from "./pages/Historique";
import Parametres from "./pages/Parametres";
import Utilisateurs from "./pages/Utilisateurs";
import Fournisseurs from "./pages/Fournisseurs";
import Achats from "./pages/Achats";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Boutique from "./pages/Boutique";
import Panier from "./pages/Panier";
import Commandes from "./pages/Commandes";
import SuiviCommande from "./pages/SuiviCommande";
import ProduitDetail from "./pages/ProduitDetail";
import Accueil from "./pages/Accueil";
import Corbeille from "./pages/Corbeille";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            ESPACE PUBLIC / CLIENT
        ========================= */}

        <Route
          path="/"
          element={<Accueil />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/boutique"
          element={<Boutique />}
        />

        <Route
          path="/boutique/produit/:id"
          element={<ProduitDetail />}
        />

        <Route
          path="/panier"
          element={<Panier />}
        />

        <Route
          path="/suivi-commande"
          element={<SuiviCommande />}
        />


        {/* =========================
            ESPACE CONNECTÉ
        ========================= */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/produits"
            element={<Produits />}
          />

          <Route
            path="/ventes"
            element={<Ventes />}
          />

          <Route
            path="/historique"
            element={<Historique />}
          />

          <Route
            path="/fournisseurs"
            element={<Fournisseurs />}
          />

          <Route
            path="/commandes"
            element={<Commandes />}
          />

          {/* Corbeille : maintenant protégée */}
          <Route
            path="/corbeille"
            element={<Corbeille />}
          />

        </Route>


        {/* =========================
            ADMIN UNIQUEMENT
        ========================= */}

        <Route
          element={
            <ProtectedRoute role="admin">
              <MainLayout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/utilisateurs"
            element={<Utilisateurs />}
          />

          <Route
            path="/achats"
            element={<Achats />}
          />

          <Route
            path="/parametres"
            element={<Parametres />}
          />

        </Route>


        {/* =========================
            URL INCONNUE
        ========================= */}

        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;