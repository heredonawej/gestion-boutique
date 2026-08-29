import { useEffect, useState } from "react";
import SalesTable from "../components/SalesTable";
import type { Vente } from "../types/Vente";
import { getVentes } from "../services/venteService";

type Filtre = "toutes" | "sur_place" | "en_ligne";

function Historique() {
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [recherche, setRecherche] = useState("");
  const [dateRecherche, setDateRecherche] = useState("");
  const [filtre, setFiltre] = useState<Filtre>("toutes");

  const chargerVentes = async () => {
    try {
      const data = await getVentes();
      setVentes(data);
    } catch (error) {
      console.error("Erreur chargement des ventes :", error);
    }
  };

  useEffect(() => {
    chargerVentes();
  }, []);

  // ================================
  // FILTRAGE
  // ================================

  const ventesFiltrees = ventes.filter((vente) => {
    const texte = recherche.toLowerCase().trim();

    const correspondRecherche =
      texte === "" ||
      vente.nom.toLowerCase().includes(texte) ||
      vente.id.toString().includes(texte);

    const correspondDate =
      dateRecherche === "" ||
      vente.date_vente.startsWith(dateRecherche);

    const correspondType =
      filtre === "toutes" ||
      vente.origine === filtre;

    return (
      correspondRecherche &&
      correspondDate &&
      correspondType
    );
  });

  // ================================
  // COMPTEURS
  // ================================

  const totalToutes = ventes.length;

  const totalSurPlace = ventes.filter(
    (vente) => vente.origine === "sur_place"
  ).length;

  const totalEnLigne = ventes.filter(
    (vente) => vente.origine === "en_ligne"
  ).length;

  // ================================
  // CHIFFRE D'AFFAIRES
  // ================================

  const montantTotal = ventesFiltrees.reduce(
    (total, vente) =>
      total + Number(vente.montant),
    0
  );

  return (
    <div className="space-y-6">

      {/* ================================ */}
      {/* EN-TÊTE */}
      {/* ================================ */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              📋 Historique des ventes
            </h1>

            <p className="text-gray-500 mt-2">
              Consultez et recherchez toutes les ventes
              de votre boutique.
            </p>
          </div>

          <div className="bg-green-50 text-green-700 px-5 py-3 rounded-xl">
            <div className="text-sm">
              Chiffre d'affaires
            </div>

            <div className="text-xl font-bold">
              {montantTotal.toLocaleString()} FC
            </div>
          </div>

        </div>

      </div>

      {/* ================================ */}
      {/* CATÉGORIES */}
      {/* ================================ */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Toutes */}
        <button
          onClick={() => setFiltre("toutes")}
          className={`text-left rounded-2xl p-5 border transition ${
            filtre === "toutes"
              ? "bg-blue-600 text-white border-blue-600 shadow-lg"
              : "bg-white hover:bg-blue-50 border-gray-100"
          }`}
        >

          <div className="flex justify-between items-center">

            <div>
              <p className="font-semibold">
                📋 Toutes les ventes
              </p>

              <p className="text-3xl font-bold mt-2">
                {totalToutes}
              </p>
            </div>

            <div className="text-4xl">
              📊
            </div>

          </div>

        </button>

        {/* Sur place */}
        <button
          onClick={() => setFiltre("sur_place")}
          className={`text-left rounded-2xl p-5 border transition ${
            filtre === "sur_place"
              ? "bg-green-600 text-white border-green-600 shadow-lg"
              : "bg-white hover:bg-green-50 border-gray-100"
          }`}
        >

          <div className="flex justify-between items-center">

            <div>
              <p className="font-semibold">
                🏪 Ventes sur place
              </p>

              <p className="text-3xl font-bold mt-2">
                {totalSurPlace}
              </p>
            </div>

            <div className="text-4xl">
              🛒
            </div>

          </div>

        </button>

        {/* En ligne */}
        <button
          onClick={() => setFiltre("en_ligne")}
          className={`text-left rounded-2xl p-5 border transition ${
            filtre === "en_ligne"
              ? "bg-purple-600 text-white border-purple-600 shadow-lg"
              : "bg-white hover:bg-purple-50 border-gray-100"
          }`}
        >

          <div className="flex justify-between items-center">

            <div>
              <p className="font-semibold">
                🌐 Ventes en ligne
              </p>

              <p className="text-3xl font-bold mt-2">
                {totalEnLigne}
              </p>
            </div>

            <div className="text-4xl">
              🌐
            </div>

          </div>

        </button>

      </div>

      {/* ================================ */}
      {/* RECHERCHE */}
      {/* ================================ */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Recherche */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔎 Rechercher une vente
            </label>

            <input
              type="text"
              value={recherche}
              onChange={(e) =>
                setRecherche(e.target.value)
              }
              placeholder="Produit ou numéro de vente..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Date */}
          <div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Rechercher par date
            </label>

            <input
              type="date"
              value={dateRecherche}
              onChange={(e) =>
                setDateRecherche(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* Résultats */}
        <div className="flex flex-wrap items-center gap-4 mt-5">

          <span className="bg-gray-100 px-4 py-2 rounded-lg font-semibold text-gray-700">
            {ventesFiltrees.length} résultat
            {ventesFiltrees.length > 1 ? "s" : ""}
          </span>

          {(recherche || dateRecherche || filtre !== "toutes") && (
            <button
              onClick={() => {
                setRecherche("");
                setDateRecherche("");
                setFiltre("toutes");
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 transition"
            >
              ✖️ Réinitialiser
            </button>
          )}

        </div>

      </div>

      {/* ================================ */}
      {/* TABLEAU */}
      {/* ================================ */}

      <SalesTable ventes={ventesFiltrees} />

    </div>
  );
}

export default Historique;