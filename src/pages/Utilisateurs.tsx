import { useEffect, useState } from "react";
import UserForm from "../components/UserForm";
import { supprimerUtilisateur } from "../services/utilisateurService";

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: string;
}

function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [recherche, setRecherche] = useState("");
  const [utilisateurEnEdition, setUtilisateurEnEdition] =
    useState<Utilisateur | null>(null);

  const chargerUtilisateurs = async () => {
    const API = import.meta.env.PROD
  ? "https://gestion-boutique-2qu3.onrender.com"
  : "http://localhost:3001";

const response = await fetch(
  `${API}/api/utilisateurs`
);

    const data = await response.json();

    setUtilisateurs(data);
  };

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  const handleSupprimer = async (id: number) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?"
    );

    if (!confirmation) return;

    const data = await supprimerUtilisateur(id);

    alert(data.message);

    chargerUtilisateurs();
  };

  const handleModifier = (utilisateur: Utilisateur) => {
    setUtilisateurEnEdition(utilisateur);
  };

  const utilisateursFiltres = utilisateurs.filter((u) => {
    return (
      u.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      u.email.toLowerCase().includes(recherche.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-6">
        Gestion des utilisateurs
      </h1>

      <UserForm
        onAjouter={chargerUtilisateurs}
        utilisateurEnEdition={utilisateurEnEdition}
        onAnnulerEdition={() => setUtilisateurEnEdition(null)}
      />

      <div className="bg-white rounded-xl shadow p-4 mb-6">

        <input
          type="text"
          placeholder="🔍 Rechercher un utilisateur..."
          className="w-full border rounded-lg p-3"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />

      </div>

      <div className="bg-white shadow rounded-xl p-6">

        <table className="w-full border-collapse">

          <thead className="bg-gray-100">

            <tr>
              <th className="border p-3">ID</th>
              <th className="border p-3">Nom</th>
              <th className="border p-3">Email</th>
              <th className="border p-3">Rôle</th>
              <th className="border p-3">Actions</th>
            </tr>

          </thead>

          <tbody>

            {utilisateursFiltres.length === 0 ? (

              <tr>
                <td
                  colSpan={5}
                  className="text-center p-6 text-gray-500"
                >
                  Aucun utilisateur trouvé.
                </td>
              </tr>

            ) : (

              utilisateursFiltres.map((u) => (

                <tr key={u.id} className="text-center">

                  <td className="border p-3">{u.id}</td>

                  <td className="border p-3">
                    {u.nom}
                  </td>

                  <td className="border p-3">
                    {u.email}
                  </td>

                  <td className="border p-3">

                    <span
                      className={
                        u.role === "admin"
                          ? "bg-green-100 text-green-700 px-3 py-1 rounded-full"
                          : "bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                      }
                    >
                      {u.role}
                    </span>

                  </td>

                  <td className="border p-3">

                    <button
                      onClick={() => handleModifier(u)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded mr-2"
                    >
                      Modifier
                    </button>

                    <button
                      onClick={() => handleSupprimer(u.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
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

    </div>
  );
}

export default Utilisateurs;