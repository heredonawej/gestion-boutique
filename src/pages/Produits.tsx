import { useEffect, useState } from "react";

import ProductForm from "../components/ProductForm";
import { modifierProduit } from "../services/produitService";
import ProductTable from "../components/ProductTable";

import type { Produit } from "../types/Produit";

import {
  getProduits,
  supprimerProduit,
} from "../services/produitService";

function Produits() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [produitEnEdition, setProduitEnEdition] = useState<Produit | null>(null);
  const [recherche, setRecherche] = useState("");
  const [categorieFiltre, setCategorieFiltre] = useState("Toutes");

  // Contrôle l'ouverture/fermeture du formulaire
  const [formOuvert, setFormOuvert] = useState(false);

  const chargerProduits = async () => {
    const data = await getProduits();
    setProduits(data);
  };

  useEffect(() => {
    chargerProduits();
  }, []);

  const handleSupprimer = async (id: number) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce produit ?"
    );

    if (!confirmation) return;

    const data = await supprimerProduit(id);

    alert(data.message);

    chargerProduits();
  };

  const handleModifier = (produit: Produit) => {
    setProduitEnEdition(produit);
    setFormOuvert(true);
  };

  const produitsFiltres = produits.filter((produit) => {
    const correspondRecherche = produit.nom
      .toLowerCase()
      .includes(recherche.toLowerCase());

    const correspondCategorie =
      categorieFiltre === "Toutes" ||
      produit.categorie === categorieFiltre;

    return correspondRecherche && correspondCategorie;
  });

  return (
    <div className="max-w-7xl mx-auto">

      {/* BOUTON POUR OUVRIR / FERMER LE FORMULAIRE */}
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
    : "Ajouter un produit"}
</button>
      </div>

      {/* FORMULAIRE DÉROULANT */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          formOuvert
            ? "max-h-[2000px] opacity-100 mb-6"
            : "max-h-0 opacity-0 mb-0"
        }`}
      >
        <ProductForm
          produitEnEdition={produitEnEdition}
          onProduitAjoute={chargerProduits}
          onAnnulerEdition={() => {
            setProduitEnEdition(null);
            setFormOuvert(false);
          }}
          onModifier={async (produit) => {
            const data = await modifierProduit({
              ...produit,
              prix_achat: produit.prix_achat ?? 0,
            });

            alert(data.message);

            setProduitEnEdition(null);
            setFormOuvert(false);

            chargerProduits();
          }}
        />
      </div>

      {/* RECHERCHE + FILTRE */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="🔍 Rechercher un produit..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="flex-1 border rounded-lg p-3"
        />

        <select
          value={categorieFiltre}
          onChange={(e) => setCategorieFiltre(e.target.value)}
          className="border rounded-lg p-3"
        >
          <option>Toutes</option>
          <option>Habits</option>
          <option>Chaussures</option>
          <option>Matelas</option>
        </select>

      </div>

      {/* TABLEAU DES PRODUITS */}
      <ProductTable
        produits={produitsFiltres}
        onSupprimer={handleSupprimer}
        onModifier={handleModifier}
      />

    </div>
  );
}

export default Produits;