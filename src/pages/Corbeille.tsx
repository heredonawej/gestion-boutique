import { useEffect, useState } from "react";

interface ElementCorbeille {
  id: number;
  type: string;
  element_id: number;
  description: string;
  date_originale: string | null;
  date_suppression: string;
}

function Corbeille() {
  const [elements, setElements] = useState<ElementCorbeille[]>([]);
  const [chargement, setChargement] = useState(true);

  // Recherche
  const [recherche, setRecherche] = useState("");

  // Filtre
  const [filtre, setFiltre] = useState("tous");

  // ==========================================
  // CHARGER LA CORBEILLE
  // ==========================================

  const chargerCorbeille = async () => {
    try {
      const response = await fetch(
        "https://gestion-boutique-2qu3.onrender.com/api/corbeille"
      );

      const data: ElementCorbeille[] =
        await response.json();

      setElements(data);
    } catch (error) {
      console.error(
        "Erreur chargement corbeille :",
        error
      );
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerCorbeille();
  }, []);

  // ==========================================
  // ICONES
  // ==========================================

  const obtenirIcone = (type: string) => {
    switch (type) {
      case "commande":
        return "📦";

      case "vente":
        return "🛒";

      case "produit":
        return "👕";

      default:
        return "📄";
    }
  };

  // ==========================================
  // NOM DU TYPE
  // ==========================================

  const obtenirNomType = (type: string) => {
    switch (type) {
      case "commande":
        return "Commande";

      case "vente":
        return "Vente";

      case "produit":
        return "Produit";

      default:
        return type;
    }
  };

  // ==========================================
  // SUPPRESSION DEFINITIVE
  // ==========================================

  const supprimerDefinitivement = async (
    id: number
  ) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer définitivement cet élément ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(
        `https://gestion-boutique-2qu3.onrender.com/api/corbeille/${id}`,
        {
          method: "DELETE",
        }
      );

      const data: { message?: string } =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de la suppression."
        );
      }

      setElements((anciensElements) =>
        anciensElements.filter(
          (element) => element.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Erreur suppression définitive :",
        error
      );

      alert(
        "Impossible de supprimer cet élément."
      );
    }
  };

  // ==========================================
  // FILTRAGE + RECHERCHE
  // ==========================================

  const elementsFiltres = elements.filter(
    (element) => {
      // Filtre par type
      const correspondAuFiltre =
        filtre === "tous" ||
        element.type === filtre;

      // Recherche
      const texteRecherche =
        recherche.toLowerCase().trim();

      const correspondAlaRecherche =
        texteRecherche === "" ||
        element.description
          .toLowerCase()
          .includes(texteRecherche) ||
        element.type
          .toLowerCase()
          .includes(texteRecherche) ||
        element.element_id
          .toString()
          .includes(texteRecherche);

      return (
        correspondAuFiltre &&
        correspondAlaRecherche
      );
    }
  );

  // ==========================================
  // AFFICHAGE
  // ==========================================
const restaurerElement = async (id: number) => {
  const confirmation = window.confirm(
    "Voulez-vous restaurer cet élément ?"
  );

  if (!confirmation) {
    return;
  }

  try {
    const response = await fetch(
      `https://gestion-boutique-2qu3.onrender.com/api/corbeille/${id}/restaurer`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: { message?: string } =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Erreur lors de la restauration."
      );
    }

    // Retirer l'élément de la corbeille
    setElements((anciensElements) =>
      anciensElements.filter(
        (element) => element.id !== id
      )
    );

    alert(
      data.message ||
        "Élément restauré avec succès."
    );

  } catch (error) {
    console.error(
      "Erreur restauration :",
      error
    );

    alert(
      "Impossible de restaurer cet élément."
    );
  }
};
  return (
    <div className="p-6">

      {/* EN-TÊTE */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold">
            🗑️ Corbeille
          </h1>

          <p className="text-gray-500 mt-1">
            Historique des éléments envoyés dans
            la corbeille.
          </p>
        </div>

        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <span className="font-semibold">
            {elementsFiltres.length}
          </span>{" "}
          élément(s)
        </div>

      </div>

      {/* ========================================
          RECHERCHE
      ======================================== */}

      {!chargement && elements.length > 0 && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">

          <div className="flex flex-col lg:flex-row gap-4">

            {/* Recherche */}
            <div className="flex-1">

              <label className="block text-sm font-semibold text-gray-600 mb-2">
                🔎 Rechercher
              </label>

              <input
                type="text"
                value={recherche}
                onChange={(e) =>
                  setRecherche(e.target.value)
                }
                placeholder="Commande, vente, produit, client..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

          </div>

          {/* FILTRES */}

          <div className="flex flex-wrap gap-3 mt-4">

            <button
              onClick={() => setFiltre("tous")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filtre === "tous"
                  ? "bg-slate-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📋 Tous
            </button>

            <button
              onClick={() => setFiltre("commande")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filtre === "commande"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              📦 Commandes
            </button>

            <button
              onClick={() => setFiltre("vente")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filtre === "vente"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              🛒 Ventes
            </button>

            <button
              onClick={() => setFiltre("produit")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filtre === "produit"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              👕 Produits
            </button>

          </div>

        </div>
      )}

      {/* ========================================
          CHARGEMENT
      ======================================== */}

      {chargement && (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          Chargement de la corbeille...
        </div>
      )}

      {/* ========================================
          CORBEILLE VIDE
      ======================================== */}

      {!chargement &&
        elements.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">

            <div className="text-6xl mb-4">
              🗑️
            </div>

            <h2 className="text-xl font-bold">
              La corbeille est vide
            </h2>

            <p className="text-gray-500 mt-2">
              Les éléments supprimés apparaîtront
              ici.
            </p>

          </div>
        )}

      {/* ========================================
          AUCUN RESULTAT
      ======================================== */}

      {!chargement &&
        elements.length > 0 &&
        elementsFiltres.length === 0 && (
          <div className="bg-white rounded-xl shadow p-12 text-center">

            <div className="text-5xl mb-4">
              🔎
            </div>

            <h2 className="text-xl font-bold">
              Aucun résultat
            </h2>

            <p className="text-gray-500 mt-2">
              Aucun élément ne correspond à votre
              recherche.
            </p>

          </div>
        )}

      {/* ========================================
          TABLEAU
      ======================================== */}

      {!chargement &&
        elementsFiltres.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100">

                  <tr>

                    <th className="text-left px-6 py-4">
                      Type
                    </th>

                    <th className="text-left px-6 py-4">
                      Élément
                    </th>

                    <th className="text-left px-6 py-4">
                      Date originale
                    </th>

                    <th className="text-left px-6 py-4">
                      Date de suppression
                    </th>

                    <th className="text-center px-6 py-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {elementsFiltres.map(
                    (element) => (

                      <tr
                        key={element.id}
                        className="border-t hover:bg-gray-50"
                      >

                        {/* TYPE */}

                        <td className="px-6 py-4">

                          <span className="font-semibold">

                            {obtenirIcone(
                              element.type
                            )}{" "}

                            {obtenirNomType(
                              element.type
                            )}

                          </span>

                        </td>

                        {/* DESCRIPTION */}

                        <td className="px-6 py-4">

                          <span className="font-medium">
                            {element.description}
                          </span>

                        </td>

                        {/* DATE ORIGINALE */}

                        <td className="px-6 py-4 text-gray-500">

                          {element.date_originale
                            ? new Date(
                                element.date_originale
                              ).toLocaleString()
                            : "-"}

                        </td>

                        {/* DATE SUPPRESSION */}

                        <td className="px-6 py-4 text-gray-500">

                          {new Date(
                            element.date_suppression
                          ).toLocaleString()}

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-4">

                          <div className="flex justify-center gap-2">

                            {/* RESTAURER */}

                            <button
  onClick={() =>
    restaurerElement(element.id)
  }
  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
>
  ↩️ Restaurer
</button>

                            {/* SUPPRIMER */}

                            <button
                              onClick={() =>
                                supprimerDefinitivement(
                                  element.id
                                )
                              }
                              className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                            >
                              🗑️ Supprimer
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

    </div>
  );
}

export default Corbeille;