import LatestSales from "../components/LatestSales";
import CategoryChart from "../components/CategoryChart";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBoxOpen,
  FaShoppingCart,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaArrowRight,
  FaChartLine,
  FaLock,
  FaUnlock,
  FaTrash,
  FaShieldAlt,
} from "react-icons/fa";

import { getDashboard } from "../services/dashboardService";
import type { Dashboard as DashboardType } from "../types/Dashboard";

function Dashboard() {
  const navigate = useNavigate();
  // ==========================================
// UTILISATEUR CONNECTÉ
// ==========================================

const utilisateurConnecte = JSON.parse(
  localStorage.getItem("utilisateur") || "null"
);

const estAdmin =
  utilisateurConnecte?.role === "admin";

// ==========================================
// VIDER LES DONNÉES
// ==========================================

const viderDonnees = async () => {

  const confirmation =
    window.confirm(
      "⚠️ ATTENTION !\n\n" +
      "Cette action va supprimer définitivement :\n\n" +
      "• Tous les produits\n" +
      "• Toutes les ventes\n" +
      "• Tous les achats\n" +
      "• Tous les fournisseurs\n" +
      "• Toutes les commandes\n" +
      "• Toutes les notifications\n" +
      "• Toute la corbeille\n\n" +
      "Les utilisateurs et le compte administrateur seront conservés.\n\n" +
      "Voulez-vous continuer ?"
    );

  if (!confirmation) {
    return;
  }

  const confirmationFinale =
    window.prompt(
      'Pour confirmer définitivement, tapez : SUPPRIMER'
    );

  if (confirmationFinale !== "SUPPRIMER") {

    alert(
      "Suppression annulée."
    );

    return;
  }

  try {

    const token =
      localStorage.getItem("token");

    if (!token) {

      alert(
        "Votre session a expiré. Veuillez vous reconnecter."
      );

      return;
    }

    const response = await fetch(
      `${import.meta.env.PROD
        ? "https://gestion-boutique-2qu3.onrender.com"
        : "http://localhost:3001"
      }/api/admin/vider-donnees`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.message ||
        "Impossible de vider les données."
      );
    }

    alert(
      data.message
    );

    // Recharger le dashboard
    window.location.reload();

  } catch (error) {

    console.error(
      "Erreur suppression données :",
      error
    );

    alert(
      error instanceof Error
        ? error.message
        : "Une erreur est survenue."
    );
  }
};

  const [dashboard, setDashboard] =
    useState<DashboardType>({
      totalProduits: 0,
      totalVentes: 0,
      chiffreAffaires: 0,
      stockFaible: 0,
    });

  // ==========================================
  // PROTECTION DES RECETTES
  // ==========================================

  const [recettesVisibles, setRecettesVisibles] =
    useState(false);

  const [codeOuvert, setCodeOuvert] =
    useState(false);

  const [code, setCode] = useState("");

  const [erreurCode, setErreurCode] =
    useState("");

  const CODE_RECETTES = "1234";

  // ==========================================
  // CHARGER DASHBOARD
  // ==========================================

  const chargerDashboard = async () => {
    try {
      const data = await getDashboard();

      setDashboard(data);
    } catch (error) {
      console.error(
        "Erreur lors du chargement du dashboard :",
        error
      );
    }
  };

  useEffect(() => {
    chargerDashboard();
  }, []);

  // ==========================================
  // OUVRIR LE CODE
  // ==========================================

  const ouvrirCodeRecettes = () => {
    setCode("");
    setErreurCode("");
    setCodeOuvert(true);
  };

  // ==========================================
  // VERIFIER LE CODE
  // ==========================================

  const verifierCode = () => {
    if (code === CODE_RECETTES) {
      setRecettesVisibles(true);
      setCodeOuvert(false);
      setCode("");
      setErreurCode("");
    } else {
      setErreurCode(
        "Code incorrect. Veuillez réessayer."
      );
    }
  };

  // ==========================================
  // MASQUER LES RECETTES
  // ==========================================

  const masquerRecettes = () => {
    setRecettesVisibles(false);
  };

  // ==========================================
  // CARTE STATISTIQUE
  // ==========================================

  const Statistique = ({
    titre,
    valeur,
    description,
    icone,
    couleur,
    onClick,
    action,
  }: {
    titre: string;
    valeur: string | number;
    description: string;
    icone: React.ReactNode;
    couleur: string;
    onClick?: () => void;
    action?: React.ReactNode;
  }) => {
    return (
      <div
        onClick={onClick}
        className={`
          bg-white
          rounded-2xl
          border
          border-gray-100
          p-5
          shadow-sm
          transition-all
          duration-300
          ${
            onClick
              ? "cursor-pointer hover:-translate-y-1 hover:shadow-xl"
              : ""
          }
        `}
      >
        <div className="flex justify-between items-start">

          {/* Icône */}

          <div
            className={`
              w-12
              h-12
              rounded-xl
              flex
              items-center
              justify-center
              ${couleur}
            `}
          >
            {icone}
          </div>

          {/* Action */}

          {action && (
            <div>
              {action}
            </div>
          )}

        </div>

        {/* Texte */}

        <div className="mt-5">

          <p className="text-gray-500 text-sm font-medium">
            {titre}
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">
            {valeur}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            {description}
          </p>

        </div>

      </div>
    );
  };

  return (
    <div className="space-y-7">

      {/* ==========================================
          EN-TETE
      ========================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <FaChartLine />
            </div>

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Dédicace à maman Ruth ❤️
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                Tableau de bord de votre boutique
              </p>

            </div>

          </div>

        </div>

        {/* DATE + ACTION ADMIN */}

<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

  {/* Date */}

  <div className="bg-white border border-gray-100 shadow-sm rounded-xl px-5 py-3">

    <p className="text-xs text-gray-400">
      Aujourd'hui
    </p>

    <p className="font-semibold text-gray-800">
      {new Date().toLocaleDateString(
        "fr-FR",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )}
    </p>

  </div>

  {/* Bouton ADMIN */}

  {estAdmin && (

    <button
      type="button"
      onClick={viderDonnees}
      className="
        flex
        items-center
        justify-center
        gap-2
        bg-red-50
        hover:bg-red-600
        text-red-600
        hover:text-white
        border
        border-red-200
        hover:border-red-600
        px-4
        py-3
        rounded-xl
        font-semibold
        text-sm
        transition-all
        duration-200
        shadow-sm
      "
      title="Vider toutes les données"
    >

      <FaTrash />

      Vider les données

      <FaShieldAlt className="text-xs" />

    </button>

  )}

</div>

      </div>

      {/* ==========================================
          STATISTIQUES
      ========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* PRODUITS */}

        <Statistique
          titre="Produits"
          valeur={dashboard.totalProduits}
          description="Produits actuellement enregistrés"
          icone={
            <FaBoxOpen className="text-xl text-blue-600" />
          }
          couleur="bg-blue-50"
          onClick={() => navigate("/produits")}
          action={
            <span className="text-xs text-blue-600 font-semibold">
              Voir →
            </span>
          }
        />

        {/* VENTES */}

        <Statistique
          titre="Ventes"
          valeur={dashboard.totalVentes}
          description="Ventes enregistrées"
          icone={
            <FaShoppingCart className="text-xl text-emerald-600" />
          }
          couleur="bg-emerald-50"
          onClick={() => navigate("/historique")}
          action={
            <span className="text-xs text-emerald-600 font-semibold">
              Voir →
            </span>
          }
        />

        {/* RECETTES */}

        <Statistique
          titre="Chiffre d'affaires"
          valeur={
            recettesVisibles
              ? `${dashboard.chiffreAffaires} FC`
              : "•••••• FC"
          }
          description={
            recettesVisibles
              ? "Recettes enregistrées"
              : "Informations protégées"
          }
          icone={
            recettesVisibles ? (
              <FaMoneyBillWave className="text-xl text-orange-600" />
            ) : (
              <FaLock className="text-xl text-orange-600" />
            )
          }
          couleur="bg-orange-50"
          onClick={
            recettesVisibles
              ? masquerRecettes
              : ouvrirCodeRecettes
          }
          action={
            <span className="text-xs text-orange-600 font-semibold">
              {recettesVisibles ? "Masquer" : "Déverrouiller"}
            </span>
          }
        />

        {/* STOCK FAIBLE */}

        <Statistique
          titre="Stock faible"
          valeur={dashboard.stockFaible}
          description={
            dashboard.stockFaible > 0
              ? "Produits nécessitant votre attention"
              : "Tous les stocks sont suffisants"
          }
          icone={
            <FaExclamationTriangle
              className="text-xl text-red-600"
            />
          }
          couleur="bg-red-50"
          action={
            dashboard.stockFaible > 0 ? (
              <span className="text-xs text-red-600 font-semibold">
                Attention
              </span>
            ) : (
              <span className="text-xs text-green-600 font-semibold">
                OK
              </span>
            )
          }
        />

      </div>

      {/* ==========================================
          GRAPHIQUE + INFORMATIONS
      ========================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ========================================
            PRODUITS PAR CATEGORIE
        ======================================== */}

        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* En-tête graphique */}

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                <FaChartLine className="text-blue-600" />

              </div>

              <div>

                <h2 className="text-lg font-bold text-gray-900">
                  Produits par catégorie
                </h2>

                <p className="text-sm text-gray-400">
                  Répartition de votre catalogue
                </p>

              </div>

            </div>

          </div>

          {/* Graphique */}

          <div className="p-5">

            <CategoryChart />

          </div>

        </div>

        {/* ========================================
            RESUME
        ======================================== */}

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">

          <div className="flex items-center gap-3 mb-6">

            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">

              <FaChartLine />

            </div>

            <div>

              <h2 className="font-bold text-lg">
                Résumé
              </h2>

              <p className="text-sm text-slate-400">
                État actuel de la boutique
              </p>

            </div>

          </div>

          <div className="space-y-5">

            {/* Produits */}

            <div>

              <div className="flex justify-between text-sm mb-2">

                <span className="text-slate-300">
                  Produits
                </span>

                <span className="font-bold">
                  {dashboard.totalProduits}
                </span>

              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">

                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      dashboard.totalProduits * 10,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            {/* Ventes */}

            <div>

              <div className="flex justify-between text-sm mb-2">

                <span className="text-slate-300">
                  Ventes
                </span>

                <span className="font-bold">
                  {dashboard.totalVentes}
                </span>

              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">

                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      dashboard.totalVentes * 5,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            {/* Stock */}

            <div>

              <div className="flex justify-between text-sm mb-2">

                <span className="text-slate-300">
                  Stock faible
                </span>

                <span className="font-bold">
                  {dashboard.stockFaible}
                </span>

              </div>

              <div className="h-2 bg-white/10 rounded-full overflow-hidden">

                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      dashboard.stockFaible * 20,
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* Bouton */}

          <button
            onClick={() => navigate("/produits")}
            className="
              mt-8
              w-full
              flex
              items-center
              justify-center
              gap-2
              bg-white
              text-slate-900
              py-3
              rounded-xl
              font-semibold
              hover:bg-slate-100
              transition
            "
          >

            Gérer les produits

            <FaArrowRight />

          </button>

        </div>

      </div>

      {/* ==========================================
          DERNIERES VENTES
      ========================================== */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

          <div>

            <h2 className="text-lg font-bold text-gray-900">
              Dernières ventes
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Activité récente de votre boutique
            </p>

          </div>

          <button
            onClick={() => navigate("/historique")}
            className="
              flex
              items-center
              gap-2
              text-sm
              text-blue-600
              font-semibold
              hover:text-blue-800
            "
          >

            Voir tout

            <FaArrowRight />

          </button>

        </div>

        <div className="p-5">

          <LatestSales />

        </div>

      </div>

      {/* ==========================================
          MESSAGE
      ========================================== */}

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

        <div className="flex gap-4 items-start">

          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
            💡
          </div>

          <div>

            <h3 className="font-bold text-blue-900">
              Gestion Boutique
            </h3>

            <p className="text-sm text-blue-800/70 mt-1">
              Cette application vous permet de gérer
              vos produits, vos ventes, vos commandes,
              votre stock et l'activité de votre boutique
              depuis un seul espace.
            </p>

          </div>

        </div>

      </div>

      {/* ==========================================
          MODALE CODE RECETTES
      ========================================== */}

      {codeOuvert && (

        <div className="
          fixed
          inset-0
          bg-black/50
          backdrop-blur-sm
          flex
          items-center
          justify-center
          z-50
          px-4
        ">

          <div className="
            bg-white
            rounded-3xl
            shadow-2xl
            p-8
            w-full
            max-w-md
          ">

            {/* Icône */}

            <div className="flex justify-center mb-5">

              <div className="
                w-16
                h-16
                rounded-2xl
                bg-orange-50
                flex
                items-center
                justify-center
              ">

                <FaLock className="text-2xl text-orange-500" />

              </div>

            </div>

            <div className="text-center mb-6">

              <h2 className="text-2xl font-bold text-gray-900">
                Recettes protégées
              </h2>

              <p className="text-gray-500 mt-2 text-sm">
                Entrez votre code à 4 chiffres
                pour afficher le chiffre d'affaires.
              </p>

            </div>

            {/* Code */}

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={code}
              onChange={(e) => {

                const valeur =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                setCode(valeur);
                setErreurCode("");

              }}
              onKeyDown={(e) => {

                if (e.key === "Enter") {
                  verifierCode();
                }

              }}
              placeholder="••••"
              className="
                w-full
                border-2
                border-gray-200
                rounded-2xl
                p-4
                text-center
                text-2xl
                tracking-[0.5em]
                focus:outline-none
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-500/10
              "
              autoFocus
            />

            {/* Erreur */}

            {erreurCode && (

              <p className="
                text-red-600
                text-center
                mt-3
                text-sm
                font-semibold
              ">
                {erreurCode}
              </p>

            )}

            {/* Boutons */}

            <div className="flex gap-3 mt-6">

              <button
                onClick={() => {

                  setCodeOuvert(false);
                  setCode("");
                  setErreurCode("");

                }}
                className="
                  flex-1
                  bg-gray-100
                  hover:bg-gray-200
                  text-gray-700
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                "
              >
                Annuler
              </button>

              <button
                onClick={verifierCode}
                disabled={code.length !== 4}
                className="
                  flex-1
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-gray-300
                  disabled:cursor-not-allowed
                  text-white
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                <FaUnlock />

                Déverrouiller

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;