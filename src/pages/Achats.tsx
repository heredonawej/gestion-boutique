import { useEffect, useState } from "react";

import AchatForm from "../components/AchatForm";
import AchatTable from "../components/AchatTable";

import { getAchats } from "../services/achatService";

interface Achat {
  id: number;
  fournisseur: string;
  produit: string;
  quantite: number;
  prix_achat: number;
  montant_total: number;
  date_achat: string;
}

function Achats() {
  const [achats, setAchats] = useState<Achat[]>([]);
  const [chargement, setChargement] = useState(true);

  // Contrôle l'ouverture du formulaire
  const [formOuvert, setFormOuvert] = useState(false);

  const chargerAchats = async () => {
    try {
      setChargement(true);

      const data = await getAchats();

      setAchats(data);
    } catch (error) {
      console.error(error);

      alert(
        "Impossible de charger l'historique des achats."
      );
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerAchats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">

      {/* En-tête */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          📦 Gestion des achats
        </h1>

        <p className="text-gray-500 mt-2">
          Gérez les achats de marchandises et consultez leur historique.
        </p>

      </div>

      {/* Bouton formulaire */}
      <div className="mb-6">

        <button
          type="button"
          onClick={() => setFormOuvert(!formOuvert)}
          className="bg-blue-600/80 hover:bg-blue-700/90 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-lg">
            {formOuvert ? "▲" : "➕"}
          </span>

          {formOuvert
            ? "Fermer le formulaire"
            : "Enregistrer un achat"}
        </button>

      </div>

      {/* Formulaire déroulant */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          formOuvert
            ? "max-h-[2000px] opacity-100 mb-8"
            : "max-h-0 opacity-0 mb-0"
        }`}
      >

        <AchatForm
          onAchatEnregistre={async () => {
            await chargerAchats();
            setFormOuvert(false);
          }}
        />

      </div>

      {/* Historique */}
      {chargement ? (

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 text-center">

          <p className="text-gray-500">
            ⏳ Chargement de l'historique...
          </p>

        </div>

      ) : (

        <AchatTable
          achats={achats}
        />

      )}

    </div>
  );
}

export default Achats;