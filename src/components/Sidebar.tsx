import { NavLink, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaBoxOpen,
  FaShoppingCart,
  FaHistory,
  FaCog,
  FaUsers,
  FaTruck,
  FaSignOutAlt,
  FaClipboardList,
  FaTrash,
  FaStore,
} from "react-icons/fa";
import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();

  const [ouvert, setOuvert] = useState(false);

  const utilisateur = JSON.parse(
    localStorage.getItem("utilisateur") || "{}"
  );

  const deconnexion = () => {
    if (!window.confirm("Voulez-vous vous déconnecter ?")) return;

    localStorage.removeItem("token");
    localStorage.removeItem("utilisateur");

    navigate("/login");
  };

  const menu = [
    {
      nom: "Dashboard",
      chemin: "/dashboard",
      icone: <FaChartBar />,
    },
    {
      nom: "Produits",
      chemin: "/produits",
      icone: <FaBoxOpen />,
    },
    {
      nom: "Achats",
      chemin: "/achats",
      icone: <FaTruck />,
    },
    {
      nom: "Commandes",
      chemin: "/commandes",
      icone: <FaClipboardList />,
    },
    {
      nom: "Boutique",
      chemin: "/boutique",
      icone: <FaStore />,
    },
    {
      nom: "Ventes",
      chemin: "/ventes",
      icone: <FaShoppingCart />,
    },
    {
      nom: "Historique",
      chemin: "/historique",
      icone: <FaHistory />,
    },
  ];

  return (
    <aside
      onMouseEnter={() => setOuvert(true)}
      onMouseLeave={() => setOuvert(false)}
      className={`
        fixed
        left-4
        top-1/2
        -translate-y-1/2
        z-50
        ${ouvert ? "w-64" : "w-20"}
        min-h-[520px]
        max-h-[90vh]
        flex
        flex-col
        rounded-3xl
        border
        border-white/30
        bg-white/20
        backdrop-blur-xl
        shadow-2xl
        transition-all
        duration-300
        overflow-hidden
      `}
    >
      {/* ================================= */}
      {/* LOGO */}
      {/* ================================= */}

      <div className="flex items-center justify-center h-20 border-b border-white/20">

        <div
          className="
            w-12
            h-12
            rounded-2xl
            bg-blue-600
            text-white
            flex
            items-center
            justify-center
            text-2xl
            shadow-lg
          "
        >
          🛍️
        </div>

        {ouvert && (
          <div className="ml-3 whitespace-nowrap">
            <h1 className="font-bold text-gray-800">
              Gestion Boutique
            </h1>

            <p className="text-xs text-gray-500">
              Administration
            </p>
          </div>
        )}

      </div>

      {/* ================================= */}
      {/* UTILISATEUR */}
      {/* ================================= */}

      <div className="px-3 py-5">

        <div
          className={`
            flex
            items-center
            ${ouvert ? "justify-start" : "justify-center"}
            gap-3
            p-2
            rounded-2xl
            bg-white/30
          `}
        >

          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              utilisateur.nom || "Utilisateur"
            )}&background=2563eb&color=fff`}
            alt="Avatar"
            className="w-11 h-11 rounded-full shadow"
          />

          {ouvert && (
            <div className="min-w-0">

              <h3 className="font-bold text-gray-800 truncate">
                {utilisateur.nom || "Utilisateur"}
              </h3>

              <p className="text-xs text-gray-500">
                {utilisateur.role || ""}
              </p>

            </div>
          )}

        </div>

      </div>

      {/* ================================= */}
      {/* MENU */}
      {/* ================================= */}

      <nav className="flex-1 px-3 space-y-2 overflow-y-auto">

        {menu.map((item) => (

          <NavLink
            key={item.chemin}
            to={item.chemin}
            className={({ isActive }) =>
              `
              group
              flex
              items-center
              ${ouvert ? "justify-start" : "justify-center"}
              gap-4
              px-3
              py-3
              rounded-2xl
              transition-all
              duration-200

              ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-white/50 hover:text-blue-600"
              }
              `
            }
          >

            <span className="text-xl min-w-[24px] flex justify-center">
              {item.icone}
            </span>

            {ouvert && (
              <span className="font-medium whitespace-nowrap">
                {item.nom}
              </span>
            )}

          </NavLink>

        ))}

        {/* ================================= */}
        {/* MENU ADMIN */}
        {/* ================================= */}

        {utilisateur.role === "admin" && (
          <>

            <NavLink
              to="/fournisseurs"
              className={({ isActive }) =>
                `
                flex
                items-center
                ${ouvert ? "justify-start" : "justify-center"}
                gap-4
                px-3
                py-3
                rounded-2xl
                transition-all

                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/50 hover:text-blue-600"
                }
                `
              }
            >

              <span className="text-xl min-w-[24px] flex justify-center">
                <FaTruck />
              </span>

              {ouvert && (
                <span className="font-medium">
                  Fournisseurs
                </span>
              )}

            </NavLink>

            <NavLink
              to="/utilisateurs"
              className={({ isActive }) =>
                `
                flex
                items-center
                ${ouvert ? "justify-start" : "justify-center"}
                gap-4
                px-3
                py-3
                rounded-2xl
                transition-all

                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/50 hover:text-blue-600"
                }
                `
              }
            >

              <span className="text-xl min-w-[24px] flex justify-center">
                <FaUsers />
              </span>

              {ouvert && (
                <span className="font-medium">
                  Utilisateurs
                </span>
              )}

            </NavLink>

            <NavLink
              to="/parametres"
              className={({ isActive }) =>
                `
                flex
                items-center
                ${ouvert ? "justify-start" : "justify-center"}
                gap-4
                px-3
                py-3
                rounded-2xl
                transition-all

                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/50 hover:text-blue-600"
                }
                `
              }
            >

              <span className="text-xl min-w-[24px] flex justify-center">
                <FaCog />
              </span>

              {ouvert && (
                <span className="font-medium">
                  Paramètres
                </span>
              )}

            </NavLink>

            <NavLink
              to="/corbeille"
              className={({ isActive }) =>
                `
                flex
                items-center
                ${ouvert ? "justify-start" : "justify-center"}
                gap-4
                px-3
                py-3
                rounded-2xl
                transition-all

                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-white/50 hover:text-blue-600"
                }
                `
              }
            >

              <span className="text-xl min-w-[24px] flex justify-center">
                <FaTrash />
              </span>

              {ouvert && (
                <span className="font-medium">
                  Corbeille
                </span>
              )}

            </NavLink>

          </>
        )}

      </nav>

      {/* ================================= */}
      {/* DÉCONNEXION */}
      {/* ================================= */}

      <div className="p-3 border-t border-white/20">

        <button
          onClick={deconnexion}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-3
            px-3
            py-3
            rounded-2xl
            bg-red-500/80
            hover:bg-red-600
            text-white
            transition
            shadow
          "
        >

          <FaSignOutAlt className="text-lg" />

          {ouvert && (
            <span className="font-medium">
              Déconnexion
            </span>
          )}

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;