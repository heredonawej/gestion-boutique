interface Achat {
  id: number;
  fournisseur: string;
  produit: string;
  quantite: number;
  prix_achat: number;
  montant_total: number;
  date_achat: string;
}

interface AchatTableProps {
  achats: Achat[];
}

function AchatTable({ achats }: AchatTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            📋 Historique des achats
          </h2>

          <p className="text-gray-500 mt-1">
            Liste des marchandises achetées auprès des fournisseurs
          </p>
        </div>

        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-semibold">
          {achats.length} achat(s)
        </div>
      </div>

      {achats.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Aucun achat enregistré pour le moment.
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead className="bg-gray-100">

              <tr>
                <th className="border p-3 text-left">
                  ID
                </th>

                <th className="border p-3 text-left">
                  Date
                </th>

                <th className="border p-3 text-left">
                  Fournisseur
                </th>

                <th className="border p-3 text-left">
                  Produit
                </th>

                <th className="border p-3 text-center">
                  Quantité
                </th>

                <th className="border p-3 text-right">
                  Prix achat
                </th>

                <th className="border p-3 text-right">
                  Total
                </th>
              </tr>

            </thead>

            <tbody>

              {achats.map((achat) => (

                <tr
                  key={achat.id}
                  className="hover:bg-gray-50"
                >

                  <td className="border p-3">
                    {achat.id}
                  </td>

                  <td className="border p-3">
                    {new Date(
                      achat.date_achat
                    ).toLocaleString("fr-FR")}
                  </td>

                  <td className="border p-3 font-medium">
                    {achat.fournisseur}
                  </td>

                  <td className="border p-3">
                    {achat.produit}
                  </td>

                  <td className="border p-3 text-center">
                    {achat.quantite}
                  </td>

                  <td className="border p-3 text-right">
                    {Number(
                      achat.prix_achat
                    ).toLocaleString()} FC
                  </td>

                  <td className="border p-3 text-right font-bold">
                    {Number(
                      achat.montant_total
                    ).toLocaleString()} FC
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default AchatTable;