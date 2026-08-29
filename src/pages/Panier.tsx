import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaTrash,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

import { usePanier } from "../context/PanierContext";
import { creerCommande } from "../services/commandeService";

function Panier() {
  const {
    panier,
    augmenterQuantite,
    diminuerQuantite,
    supprimerDuPanier,
    viderPanier,
    total,
  } = usePanier();

  const [nomClient, setNomClient] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [commentaire, setCommentaire] = useState("");

  const [chargement, setChargement] = useState(false);

  const passerCommande = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (panier.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    try {
      setChargement(true);

      const produits = panier.map((article) => ({
        produit_id: article.produit.id,
        quantite: article.quantite,
      }));

      const data = await creerCommande({
        nom_client: nomClient,
        telephone: telephone,
        adresse: adresse,
        commentaire: commentaire,
        produits: produits,
        total: total,
      });

      localStorage.setItem(
  "telephoneClient",
  telephone
);

      alert(
        `✅ ${data.message}\n\nNuméro de commande : #${data.commande_id}`
      );

      // Vider le panier après une commande réussie
      viderPanier();

      // Réinitialiser le formulaire
      setNomClient("");
      setTelephone("");
      setAdresse("");
      setCommentaire("");

    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(`❌ ${error.message}`);
      } else {
        alert("❌ Une erreur est survenue.");
      }

    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-slate-900 text-white px-8 py-5">

        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <Link
            to="/boutique"
            className="flex items-center gap-2 hover:text-blue-400"
          >
            <FaArrowLeft />
            Retour à la boutique
          </Link>

          <h1 className="text-2xl font-bold">
            🛒 Mon panier
          </h1>

        </div>

      </header>

      {/* Contenu */}
      <main className="max-w-7xl mx-auto p-8">

        {panier.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-12 text-center">

            <div className="text-6xl mb-5">
              🛒
            </div>

            <h2 className="text-2xl font-bold">
              Votre panier est vide
            </h2>

            <p className="text-gray-500 mt-2">
              Ajoutez des produits pour commencer votre commande.
            </p>

            <Link
              to="/boutique"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Voir les produits
            </Link>

          </div>

        ) : (

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Produits */}
            <div className="lg:col-span-2 space-y-4">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-2xl font-bold">
                  Produits sélectionnés
                </h2>

                <button
                  onClick={viderPanier}
                  className="text-red-600 hover:text-red-800 flex items-center gap-2"
                >
                  <FaTrash />
                  Vider le panier
                </button>

              </div>

              {panier.map((article) => (

                <div
                  key={article.produit.id}
                  className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row gap-5 items-center"
                >

                  {/* Image */}
                  {article.produit.image ? (

                    <img
                      src={`http://https://gestion-boutique-2qu3.onrender.com/uploads/${article.produit.image}`}
                      alt={article.produit.nom}
                      className="w-28 h-28 object-cover rounded-xl"
                    />

                  ) : (

                    <div className="w-28 h-28 bg-gray-200 rounded-xl flex items-center justify-center text-4xl">
                      📦
                    </div>

                  )}

                  {/* Informations */}
                  <div className="flex-1">

                    <p className="text-sm text-gray-500">
                      {article.produit.categorie}
                    </p>

                    <h3 className="text-xl font-bold">
                      {article.produit.nom}
                    </h3>

                    <p className="text-blue-600 font-bold mt-2">
                      {Number(
                        article.produit.prix
                      ).toLocaleString()} FC
                    </p>

                  </div>

                  {/* Quantité */}
                  <div className="flex items-center gap-3">

                    <button
                      onClick={() =>
                        diminuerQuantite(
                          article.produit.id
                        )
                      }
                      className="w-9 h-9 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center"
                    >
                      <FaMinus />
                    </button>

                    <span className="font-bold text-lg w-8 text-center">
                      {article.quantite}
                    </span>

                    <button
                      onClick={() =>
                        augmenterQuantite(
                          article.produit.id
                        )
                      }
                      className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
                    >
                      <FaPlus />
                    </button>

                  </div>

                  {/* Sous-total */}
                  <div className="text-right">

                    <p className="font-bold text-lg">
                      {(
                        Number(article.produit.prix) *
                        article.quantite
                      ).toLocaleString()} FC
                    </p>

                    <button
                      onClick={() =>
                        supprimerDuPanier(
                          article.produit.id
                        )
                      }
                      className="text-red-500 hover:text-red-700 text-sm mt-2"
                    >
                      🗑️ Supprimer
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* Résumé + formulaire */}
            <div>

              <div className="bg-white rounded-2xl shadow p-6 sticky top-6">

                <h2 className="text-2xl font-bold mb-6">
                  📦 Passer la commande
                </h2>

                {/* Total */}
                <div className="flex justify-between border-b pb-4 mb-6">

                  <span>
                    Total
                  </span>

                  <span className="text-2xl font-bold text-blue-600">
                    {total.toLocaleString()} FC
                  </span>

                </div>

                {/* Formulaire */}
                <form
                  onSubmit={passerCommande}
                  className="space-y-4"
                >

                  <div>

                    <label className="block font-semibold mb-1">
                      Nom complet
                    </label>

                    <input
                      type="text"
                      value={nomClient}
                      onChange={(e) =>
                        setNomClient(e.target.value)
                      }
                      placeholder="Ex : Jean Mukendi"
                      className="w-full border rounded-lg p-3"
                      required
                    />

                  </div>

                  <div>

                    <label className="block font-semibold mb-1">
                      Téléphone
                    </label>

                    <input
                      type="tel"
                      value={telephone}
                      onChange={(e) =>
                        setTelephone(e.target.value)
                      }
                      placeholder="Ex : 0990000000"
                      className="w-full border rounded-lg p-3"
                      required
                    />

                  </div>

                  <div>

                    <label className="block font-semibold mb-1">
                      Adresse
                    </label>

                    <textarea
                      value={adresse}
                      onChange={(e) =>
                        setAdresse(e.target.value)
                      }
                      placeholder="Adresse de livraison"
                      className="w-full border rounded-lg p-3"
                      rows={3}
                      required
                    />

                  </div>

                  <div>

                    <label className="block font-semibold mb-1">
                      Commentaire
                    </label>

                    <textarea
                      value={commentaire}
                      onChange={(e) =>
                        setCommentaire(e.target.value)
                      }
                      placeholder="Informations supplémentaires..."
                      className="w-full border rounded-lg p-3"
                      rows={2}
                    />

                  </div>

                  <button
                    type="submit"
                    disabled={chargement}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold"
                  >
                    {chargement
                      ? "⏳ Enregistrement..."
                      : "✅ Confirmer la commande"}
                  </button>

                </form>

                <Link
                  to="/boutique"
                  className="block text-center mt-4 text-blue-600 hover:underline"
                >
                  Continuer mes achats
                </Link>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default Panier;