import { useEffect, useState } from "react";
import FournisseurForm from "../components/FournisseurForm";
import FournisseurTable from "../components/FournisseurTable";

import type { Fournisseur } from "../types/Fournisseur";

import {
  getFournisseurs,
  supprimerFournisseur,
} from "../services/fournisseurService";

function Fournisseurs() {
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);

  const chargerFournisseurs = async () => {
    const data = await getFournisseurs();
    setFournisseurs(data);
  };

  useEffect(() => {
    chargerFournisseurs();
  }, []);

  const handleSupprimer = async (id: number) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce fournisseur ?"
    );

    if (!confirmation) return;

    const data = await supprimerFournisseur(id);

    alert(data.message);

    chargerFournisseurs();
  };

  return (
    <div className="max-w-7xl mx-auto">

      <FournisseurForm
        onAjouter={chargerFournisseurs}
      />

      <FournisseurTable
        fournisseurs={fournisseurs}
        onSupprimer={handleSupprimer}
      />

    </div>
  );
}

export default Fournisseurs;