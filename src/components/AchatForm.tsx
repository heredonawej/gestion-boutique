import { useEffect, useState } from "react";
import { getProduits } from "../services/produitService";
import { getFournisseurs } from "../services/fournisseurService";
import { enregistrerAchat } from "../services/achatService";

import type { Produit } from "../types/Produit";
import type { Fournisseur } from "../types/Fournisseur";

interface AchatFormProps {
  onAchatEnregistre: () => void;
}

function AchatForm({ onAchatEnregistre }: AchatFormProps) {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);

  const [fournisseurId, setFournisseurId] = useState("");
  const [produitId, setProduitId] = useState("");
  const [quantite, setQuantite] = useState(1);
  const [prixAchat, setPrixAchat] = useState("");

  const chargerDonnees = async () => {
    const produitsData = await getProduits();
    const fournisseursData = await getFournisseurs();

    setProduits(produitsData);
    setFournisseurs(fournisseursData);
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const produitSelectionne = produits.find(
    (p) => p.id === Number(produitId)
  );

  // Lorsque le produit change, proposer son prix d'achat actuel
  useEffect(() => {
    if (produitSelectionne) {
      setPrixAchat(
        String(produitSelectionne.prix_achat || "")
      );
    } else {
      setPrixAchat("");
    }
  }, [produitSelectionne]);

  const totalAchat =
    Number(prixAchat || 0) * Number(quantite || 0);

  const enregistrer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fournisseurId) {
      alert("Veuillez sélectionner un fournisseur.");
      return;
    }

    if (!produitId) {
      alert("Veuillez sélectionner un produit.");
      return;
    }

    if (quantite <= 0) {
      alert("La quantité doit être supérieure à zéro.");
      return;
    }

    if (Number(prixAchat) <= 0) {
      alert("Veuillez saisir un prix d'achat valide.");
      return;
    }

    const data = await enregistrerAchat(
      Number(fournisseurId),
      Number(produitId),
      Number(quantite),
      Number(prixAchat)
    );

    alert(data.message);

    if (data.message?.includes("succès")) {
      setFournisseurId("");
      setProduitId("");
      setQuantite(1);
      setPrixAchat("");

      onAchatEnregistre();

      chargerDonnees();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        🛒 Enregistrer un achat
      </h2>

      <form
        onSubmit={enregistrer}
        className="space-y-5"
      >

        {/* Fournisseur */}
        <div>
          <label className="block font-semibold mb-2">
            Fournisseur
          </label>

          <select
            value={fournisseurId}
            onChange={(e) =>
              setFournisseurId(e.target.value)
            }
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">
              Sélectionner un fournisseur
            </option>

            {fournisseurs.map((fournisseur) => (
              <option
                key={fournisseur.id}
                value={fournisseur.id}
              >
                {fournisseur.nom}
              </option>
            ))}
          </select>
        </div>

        {/* Produit */}
        <div>
          <label className="block font-semibold mb-2">
            Produit
          </label>

          <select
            value={produitId}
            onChange={(e) =>
              setProduitId(e.target.value)
            }
            className="w-full border rounded-lg p-3"
            required
          >
            <option value="">
              Sélectionner un produit
            </option>

            {produits.map((produit) => (
              <option
                key={produit.id}
                value={produit.id}
              >
                {produit.nom} — Stock : {produit.stock}
              </option>
            ))}
          </select>
        </div>

        {/* Informations produit */}
        {produitSelectionne && (
          <div className="bg-gray-100 rounded-xl p-4">

            <p>
              📦 Stock actuel :
              <strong className="ml-2">
                {produitSelectionne.stock}
              </strong>
            </p>

            <p className="mt-2">
              🏷️ Prix de vente :
              <strong className="ml-2">
                {Number(
                  produitSelectionne.prix
                ).toLocaleString()}{" "}
                FC
              </strong>
            </p>

          </div>
        )}

        {/* Quantité */}
        <div>
          <label className="block font-semibold mb-2">
            Quantité achetée
          </label>

          <input
            type="number"
            min="1"
            value={quantite}
            onChange={(e) =>
              setQuantite(Number(e.target.value))
            }
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Prix achat */}
        <div>
          <label className="block font-semibold mb-2">
            Prix d'achat unitaire
          </label>

          <input
            type="number"
            min="1"
            value={prixAchat}
            onChange={(e) =>
              setPrixAchat(e.target.value)
            }
            placeholder="Ex : 8000"
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        {/* Total */}
        <div className="bg-blue-50 rounded-xl p-4">

          <p className="text-gray-600">
            Montant total de l'achat
          </p>

          <p className="text-2xl font-bold text-blue-600">
            {totalAchat.toLocaleString()} FC
          </p>

        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          ✅ Enregistrer l'achat
        </button>

      </form>

    </div>
  );
}

export default AchatForm;