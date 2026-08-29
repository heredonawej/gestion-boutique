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

      {/* Formulaire */}
      <AchatForm
        onAchatEnregistre={chargerAchats}
      />

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