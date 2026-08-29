import SwitchUserModal from "../components/SwitchUserModal";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import {
  FaUser,
  FaExchangeAlt,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";

function MainLayout() {
  const navigate = useNavigate();

  const utilisateur = JSON.parse(
    localStorage.getItem("utilisateur") || "{}"
  );

  const [menuOuvert, setMenuOuvert] = useState(false);
  const [modalUtilisateur, setModalUtilisateur] = useState(false);

  const deconnexion = () => {
    if (!window.confirm("Voulez-vous vous déconnecter ?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("utilisateur");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ========================================= */}
      {/* SIDEBAR */}
      {/* ========================================= */}

      <Sidebar />

      {/* ========================================= */}
      {/* ZONE PRINCIPALE */}
      {/* ========================================= */}

      <div className="ml-24 min-h-screen flex flex-col">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <header className="bg-white/90 backdrop-blur-md shadow-sm px-8 py-4 flex justify-between items-center">

          {/* Logo / titre */}

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Gestion Boutique
            </h1>

            <p className="text-gray-500 text-sm">
              Tableau de bord
            </p>
          </div>

          {/* ===================================== */}
          {/* PROFIL */}
          {/* ===================================== */}

          <div className="relative">

            <button
              onClick={() => setMenuOuvert(!menuOuvert)}
              className="
                flex
                items-center
                gap-4
                rounded-xl
                px-3
                py-2
                hover:bg-gray-100
                transition
              "
            >

              <div className="text-right">

                <p className="font-semibold text-gray-800">
                  {utilisateur.nom || "Utilisateur"}
                </p>

                <p className="text-sm text-gray-500">
                  {utilisateur.email || ""}
                </p>

              </div>

              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  utilisateur.nom || "Utilisateur"
                )}&background=2563eb&color=fff`}
                className="w-12 h-12 rounded-full shadow"
                alt="avatar"
              />

            </button>

            {/* ================================= */}
            {/* MENU PROFIL */}
            {/* ================================= */}

            {menuOuvert && (

              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-64
                  bg-white
                  rounded-2xl
                  shadow-2xl
                  border
                  overflow-hidden
                  z-[100]
                "
              >

                <button
                  className="
                    flex
                    items-center
                    gap-3
                    w-full
                    px-5
                    py-3
                    hover:bg-gray-100
                    transition
                  "
                >
                  <FaUser />
                  Mon profil
                </button>

                <button
                  onClick={() => {
                    setMenuOuvert(false);
                    setModalUtilisateur(true);
                  }}
                  className="
                    flex
                    items-center
                    gap-3
                    w-full
                    px-5
                    py-3
                    hover:bg-gray-100
                    transition
                  "
                >
                  <FaExchangeAlt />
                  Changer d'utilisateur
                </button>

                <button
                  className="
                    flex
                    items-center
                    gap-3
                    w-full
                    px-5
                    py-3
                    hover:bg-gray-100
                    transition
                  "
                >
                  <FaKey />
                  Modifier le mot de passe
                </button>

                <button
                  onClick={deconnexion}
                  className="
                    flex
                    items-center
                    gap-3
                    w-full
                    px-5
                    py-3
                    text-red-600
                    hover:bg-red-50
                    transition
                  "
                >
                  <FaSignOutAlt />
                  Déconnexion
                </button>

              </div>

            )}

          </div>

        </header>

        {/* ========================================= */}
        {/* CONTENU DES PAGES */}
        {/* ========================================= */}

        <main className="flex-1 p-8 overflow-auto">

          <Outlet />

        </main>

      </div>

      {/* ========================================= */}
      {/* MODAL CHANGEMENT UTILISATEUR */}
      {/* ========================================= */}

      {modalUtilisateur && (
        <SwitchUserModal
          onClose={() => setModalUtilisateur(false)}
        />
      )}

    </div>
  );
}

export default MainLayout;