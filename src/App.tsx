import {
  BrowserRouter,
  Routes,
  Route,
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

        {/* Page d'accueil */}
        <Route
          path="/"
          element={<Accueil />}
        />

        {/* Connexion */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Boutique */}
        <Route
          path="/boutique"
          element={<Boutique />}
        />

        {/* Détail d'un produit */}
        <Route
          path="/boutique/produit/:id"
          element={<ProduitDetail />}
        />

        {/* Panier */}
        <Route
          path="/panier"
          element={<Panier />}
        />

        {/* Suivi commande */}
        <Route
          path="/suivi-commande"
          element={<SuiviCommande />}
        />


        {/* =========================
            ESPACE ADMINISTRATEUR
        ========================= */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Produits */}
          <Route
            path="/produits"
            element={<Produits />}
          />

          {/* Ventes */}
          <Route
            path="/ventes"
            element={<Ventes />}
          />

          {/* Historique */}
          <Route
            path="/historique"
            element={<Historique />}
          />

          {/* Fournisseurs */}
          <Route
            path="/fournisseurs"
            element={<Fournisseurs />}
          />

          {/* Commandes */}
          <Route
            path="/commandes"
            element={<Commandes />}
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

          {/* Utilisateurs */}
          <Route
            path="/utilisateurs"
            element={<Utilisateurs />}
          />

          {/* Achats */}
          <Route
            path="/achats"
            element={<Achats />}
          />

          {/* Paramètres */}
          <Route
            path="/parametres"
            element={<Parametres />}
          />

        </Route>
        <Route
  path="/corbeille"
  element={<Corbeille />}
/>

      </Routes>

    </BrowserRouter>
  );
}

export default App;