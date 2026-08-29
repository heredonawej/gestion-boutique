import type { Fournisseur } from "../types/Fournisseur";

interface Props {
  fournisseurs: Fournisseur[];
  onSupprimer: (id: number) => void;
}

function FournisseurTable({
  fournisseurs,
  onSupprimer,
}: Props) {
  return (
    <div className="bg-white shadow rounded-xl p-6">

      <h2 className="text-2xl font-bold mb-4">
        Liste des fournisseurs
      </h2>

      <table className="w-full border-collapse">

        <thead className="bg-gray-100">

          <tr>
            <th className="border p-3">ID</th>
            <th className="border p-3">Nom</th>
            <th className="border p-3">Téléphone</th>
            <th className="border p-3">Email</th>
            <th className="border p-3">Adresse</th>
            <th className="border p-3">Actions</th>
          </tr>

        </thead>

        <tbody>

          {fournisseurs.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="text-center p-6 text-gray-500"
              >
                Aucun fournisseur enregistré.
              </td>
            </tr>
          ) : (
            fournisseurs.map((fournisseur) => (
              <tr
                key={fournisseur.id}
                className="text-center"
              >
                <td className="border p-3">
                  {fournisseur.id}
                </td>

                <td className="border p-3">
                  {fournisseur.nom}
                </td>

                <td className="border p-3">
                  {fournisseur.telephone}
                </td>

                <td className="border p-3">
                  {fournisseur.email}
                </td>

                <td className="border p-3">
                  {fournisseur.adresse}
                </td>

                <td className="border p-3">

                  <button
                    onClick={() =>
                      onSupprimer(fournisseur.id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                  >
                    Supprimer
                  </button>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

export default FournisseurTable;