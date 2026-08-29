import type { Vente } from "../types/Vente";

interface Props {
  ventes: Vente[];
}

function SalesTable({ ventes }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* En-tête */}
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            📋 Historique des ventes
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Consultez les ventes enregistrées dans la boutique.
          </p>
        </div>

        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold">
          {ventes.length} vente{ventes.length > 1 ? "s" : ""}
        </div>

      </div>

      {/* Tableau */}
      {ventes.length > 0 ? (

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr className="text-left text-sm text-gray-600">

                <th className="px-6 py-4 font-semibold">
                  N°
                </th>

                <th className="px-6 py-4 font-semibold">
                  Produit
                </th>

                <th className="px-6 py-4 font-semibold text-center">
                  Quantité
                </th>

                <th className="px-6 py-4 font-semibold">
                  Montant
                </th>

                <th className="px-6 py-4 font-semibold">
                  Type
                </th>

                <th className="px-6 py-4 font-semibold">
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

                  {/* Numéro */}
                  <td className="px-6 py-4">

                    <span className="font-bold text-gray-700">
                      #{vente.id}
                    </span>

                  </td>

                  {/* Produit */}
                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        🛍️
                      </div>

                      <span className="font-semibold text-gray-800">
                        {vente.nom}
                      </span>

                    </div>

                  </td>

                  {/* Quantité */}
                  <td className="px-6 py-4 text-center">

                    <span className="bg-gray-100 px-3 py-1 rounded-full font-semibold">
                      {vente.quantite}
                    </span>

                  </td>

                  {/* Montant */}
                  <td className="px-6 py-4">

                    <span className="font-bold text-green-600">
                      {Number(vente.montant).toLocaleString()} FC
                    </span>

                  </td>

                  {/* Type */}
                  <td className="px-6 py-4">

                    {vente.origine === "en_ligne" ? (

                      <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                        🌐 En ligne
                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                        🏪 Sur place
                      </span>

                    )}

                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-gray-500 text-sm">

                    {new Date(
                      vente.date_vente
                    ).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      ) : (

        /* Aucune vente */
        <div className="py-16 text-center">

          <div className="text-6xl mb-4">
            🛒
          </div>

          <h3 className="text-xl font-bold text-gray-700">
            Aucune vente trouvée
          </h3>

          <p className="text-gray-500 mt-2">
            Les ventes apparaîtront ici lorsqu'elles seront enregistrées.
          </p>

        </div>

      )}

    </div>
  );
}

export default SalesTable;