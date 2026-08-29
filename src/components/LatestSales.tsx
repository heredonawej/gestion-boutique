import { useEffect, useState } from "react";
import { getLatestSales } from "../services/latestSalesService";

interface Vente {
  id: number;
  nom: string;
  quantite: number;
  montant: number;
  date_vente: string;
}

function LatestSales() {
  const [ventes, setVentes] = useState<Vente[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    charger();
  }, []);

  const charger = async () => {
    try {
      const data = await getLatestSales();
      setVentes(data);
    } catch (error) {
      console.error(
        "Erreur chargement dernières ventes :",
        error
      );
    } finally {
      setChargement(false);
    }
  };

  const formaterDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formaterHeure = (date: string) => {
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-8 overflow-hidden">

      {/* ==============================
          EN-TÊTE
      ============================== */}

      <div className="p-6 border-b border-gray-100">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-xl">
              🕒
            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-800">
                Dernières ventes
              </h2>

              <p className="text-sm text-gray-500">
                Les ventes les plus récentes de votre boutique
              </p>

            </div>

          </div>

          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-semibold">
            {ventes.length} vente(s)
          </div>

        </div>

      </div>


      {/* ==============================
          CHARGEMENT
      ============================== */}

      {chargement && (

        <div className="p-12 text-center">

          <div className="text-4xl mb-3">
            🛒
          </div>

          <p className="text-gray-500">
            Chargement des ventes...
          </p>

        </div>

      )}


      {/* ==============================
          AUCUNE VENTE
      ============================== */}

      {!chargement && ventes.length === 0 && (

        <div className="p-12 text-center">

          <div className="text-5xl mb-4">
            🛒
          </div>

          <h3 className="text-lg font-bold text-gray-700">
            Aucune vente récente
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            Les dernières ventes apparaîtront ici.
          </p>

        </div>

      )}


      {/* ==============================
          TABLEAU
      ============================== */}

      {!chargement && ventes.length > 0 && (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>

                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Produit
                </th>

                <th className="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Quantité
                </th>

                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Montant
                </th>

                <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Date
                </th>

              </tr>

            </thead>

            <tbody>

              {ventes.map((vente) => (

                <tr
                  key={vente.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >

                  {/* Produit */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        📦
                      </div>

                      <div>

                        <p className="font-semibold text-gray-800">
                          {vente.nom}
                        </p>

                        <p className="text-xs text-gray-400">
                          Vente #{vente.id}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* Quantité */}

                  <td className="px-6 py-4 text-center">

                    <span className="inline-flex items-center justify-center min-w-[40px] px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                      {vente.quantite}
                    </span>

                  </td>


                  {/* Montant */}

                  <td className="px-6 py-4 text-right">

                    <span className="font-bold text-green-600">
                      {Number(vente.montant).toLocaleString("fr-FR")} FC
                    </span>

                  </td>


                  {/* Date */}

                  <td className="px-6 py-4 text-right">

                    <p className="text-sm font-medium text-gray-700">
                      {formaterDate(vente.date_vente)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {formaterHeure(vente.date_vente)}
                    </p>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}


      {/* ==============================
          PIED DU TABLEAU
      ============================== */}

      {!chargement && ventes.length > 0 && (

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">

          <div className="flex items-center justify-between">

            <p className="text-sm text-gray-500">
              📋 Affichage des ventes récentes
            </p>

            <p className="text-sm font-semibold text-blue-600">
              Voir l'historique →
            </p>

          </div>

        </div>

      )}

    </div>
  );
}

export default LatestSales;