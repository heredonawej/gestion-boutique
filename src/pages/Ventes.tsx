import { useEffect, useMemo, useState } from "react";
import { getProduits } from "../services/produitService";
import { enregistrerVente } from "../services/venteService";
import { genererFacture } from "../services/factureService";
import type { Produit } from "../types/Produit";

function Ventes() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [produitId, setProduitId] = useState("");
  const [quantite, setQuantite] = useState(1);

  useEffect(() => {
    chargerProduits();
  }, []);

  const chargerProduits = async () => {
    const data = await getProduits();
    setProduits(data);
  };

  const produitSelectionne = useMemo(() => {
    return produits.find(
      (p) => p.id === Number(produitId)
    );
  }, [produitId, produits]);

  const total = produitSelectionne
    ? produitSelectionne.prix * quantite
    : 0;

  const vendre = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!produitId) {
      alert("Sélectionnez un produit");
      return;
    }

    const data = await enregistrerVente(
      Number(produitId),
      quantite
    );

    alert(data.message);

    // Génération automatique de la facture PDF
    if (produitSelectionne) {
      const utilisateur = JSON.parse(
        localStorage.getItem("utilisateur") || "{}"
      );

      genererFacture({
        produit: produitSelectionne.nom,
        quantite: quantite,
        prix: produitSelectionne.prix,
        vendeur: utilisateur.nom,
      });
    }

    await chargerProduits();

    setProduitId("");
    setQuantite(1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* Formulaire */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          🛒 Nouvelle vente
        </h2>

        <form
          onSubmit={vendre}
          className="space-y-5"
        >

          <select
            className="w-full border rounded-lg p-3"
            value={produitId}
            onChange={(e) =>
              setProduitId(e.target.value)
            }
          >
            <option value="">
              Choisir un produit
            </option>

            {produits.map((p) => (
              <option
                key={p.id}
                value={p.id}
              >
                {p.nom}
              </option>
            ))}
          </select>

          {produitSelectionne && (
            <div className="bg-gray-100 rounded-lg p-4 space-y-2">

              <p>
                💰 Prix :
                <strong>
                  {" "}
                  {produitSelectionne.prix.toLocaleString()} FC
                </strong>
              </p>

              <p>
                📦 Stock :
                <strong>
                  {" "}
                  {produitSelectionne.stock}
                </strong>
              </p>

            </div>
          )}

          <input
            type="number"
            min={1}
            className="w-full border rounded-lg p-3"
            placeholder="Quantité"
            value={quantite}
            onChange={(e) =>
              setQuantite(Number(e.target.value))
            }
          />

          <div className="text-xl font-bold text-green-600">
            Total : {total.toLocaleString()} FC
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            Enregistrer la vente
          </button>

        </form>

      </div>

      {/* Informations */}
      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-2xl font-bold mb-6">
          Informations
        </h2>

        <p className="text-gray-600">
          Après chaque vente :
        </p>

        <ul className="mt-4 space-y-3">

          <li>
            ✅ Le stock est mis à jour automatiquement
          </li>

          <li>
            ✅ La vente est enregistrée dans SQLite
          </li>

          <li>
            ✅ Le montant est calculé automatiquement
          </li>

          <li>
            ✅ Une facture PDF est générée automatiquement
          </li>

        </ul>

      </div>

    </div>
  );
}

export default Ventes;