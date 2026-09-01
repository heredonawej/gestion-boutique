import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

import {
  FaArrowLeft,
  FaTrash,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

import { usePanier } from "../context/PanierContext";
import { creerCommande } from "../services/commandeService";

// =====================================================
// URL DU BACKEND
// =====================================================

const API_URL =
  "https://gestion-boutique-2qu3.onrender.com";

// =====================================================
// COMPOSANT IMAGE AVEC SECOURS
// =====================================================

interface ImageProduitProps {
  image: string;
  alt: string;
  className?: string;
}

function ImageProduit({
  image,
  alt,
  className = "",
}: ImageProduitProps) {
  const [source, setSource] = useState(
    `${API_URL}/uploads/${image}`
  );

  const [imageErreur, setImageErreur] =
    useState(false);

  const utiliserServeurLocal = () => {
    if (
      source !==
      `http://localhost:3001/uploads/${image}`
    ) {
      setSource(
        `http://localhost:3001/uploads/${image}`
      );
    } else {
      setImageErreur(true);
    }
  };

  if (imageErreur) {
    return (
      <div
        className={`${className} bg-gray-200 rounded-xl flex items-center justify-center text-4xl`}
      >
        📦
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={alt}
      className={className}
      onError={utiliserServeurLocal}
    />
  );
}

// =====================================================
// COMPOSANT PRINCIPAL
// =====================================================

function Panier() {
  const {
    panier,
    augmenterQuantite,
    diminuerQuantite,
    supprimerDuPanier,
    viderPanier,
    total,
  } = usePanier();

  // ===================================================
  // INFORMATIONS CLIENT
  // ===================================================

  const [nomClient, setNomClient] =
    useState("");

  const [telephone, setTelephone] =
    useState("");

  const [adresse, setAdresse] =
    useState("");

  const [commentaire, setCommentaire] =
    useState("");

  // ===================================================
  // CHARGEMENT
  // ===================================================

  const [chargement, setChargement] =
    useState(false);

  // ===================================================
  // PASSER LA COMMANDE
  // ===================================================

  const passerCommande = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    // Vérifier que le panier n'est pas vide
    if (panier.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    // Vérifier les informations principales
    if (
      !nomClient.trim() ||
      !telephone.trim() ||
      !adresse.trim()
    ) {
      alert(
        "Veuillez remplir toutes les informations obligatoires."
      );
      return;
    }

    try {
      setChargement(true);

      // ===============================================
      // PRÉPARER LES PRODUITS
      // ===============================================

      const produits = panier.map(
        (article) => ({
          produit_id: article.produit.id,
          quantite: Number(
            article.quantite
          ),
        })
      );

      // ===============================================
      // ENVOYER LA COMMANDE
      // ===============================================

      const data = await creerCommande({
        nom_client: nomClient.trim(),

        telephone: telephone.trim(),

        adresse: adresse.trim(),

        commentaire:
          commentaire.trim(),

        produits,

        total: Number(total),
      });

      // ===============================================
      // MESSAGE DE SUCCÈS
      // ===============================================

      alert(
        `✅ ${data.message}\n\nNuméro de commande : #${data.commande_id}`
      );

      // ===============================================
      // VIDER LE PANIER
      // ===============================================

      viderPanier();

      // ===============================================
      // RÉINITIALISER LE FORMULAIRE
      // ===============================================

      setNomClient("");
      setTelephone("");
      setAdresse("");
      setCommentaire("");

      // Revenir en haut de page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Erreur lors de la commande :",
        error
      );

      if (error instanceof Error) {
        alert(
          `❌ ${error.message}`
        );
      } else {
        alert(
          "❌ Une erreur est survenue lors de l'enregistrement de la commande."
        );
      }
    } finally {
      setChargement(false);
    }
  };

  // ===================================================
  // PANIER VIDE
  // ===================================================

  if (panier.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100">

        {/* HEADER */}
        <header className="bg-slate-900 text-white px-8 py-5">
          <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">

            <Link
              to="/boutique"
              className="flex items-center gap-2 hover:text-blue-400 transition"
            >
              <FaArrowLeft />

              <span>
                Retour à la boutique
              </span>
            </Link>

            <h1 className="text-2xl font-bold">
              🛒 Mon panier
            </h1>

          </div>
        </header>

        {/* CONTENU */}
        <main className="max-w-7xl mx-auto p-8">

          <div className="bg-white rounded-2xl shadow p-12 text-center">

            <div className="text-6xl mb-5">
              🛒
            </div>

            <h2 className="text-2xl font-bold">
              Votre panier est vide
            </h2>

            <p className="text-gray-500 mt-2">
              Ajoutez des produits pour
              commencer votre commande.
            </p>

            <Link
              to="/boutique"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Voir les produits
            </Link>

          </div>

        </main>

      </div>
    );
  }

  // ===================================================
  // AFFICHAGE DU PANIER
  // ===================================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="bg-slate-900 text-white px-8 py-5">

        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">

          <Link
            to="/boutique"
            className="flex items-center gap-2 hover:text-blue-400 transition"
          >
            <FaArrowLeft />

            <span>
              Retour à la boutique
            </span>
          </Link>

          <h1 className="text-2xl font-bold">
            🛒 Mon panier
          </h1>

        </div>

      </header>

      {/* =================================================
          CONTENU
      ================================================= */}

      <main className="max-w-7xl mx-auto p-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* =================================================
              PRODUITS
          ================================================= */}

          <div className="lg:col-span-2 space-y-4">

            {/* TITRE */}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">

              <h2 className="text-2xl font-bold">
                Produits sélectionnés
              </h2>

              <button
                type="button"
                onClick={viderPanier}
                disabled={chargement}
                className="text-red-600 hover:text-red-800 disabled:text-gray-400 flex items-center gap-2 font-semibold"
              >
                <FaTrash />

                Vider le panier
              </button>

            </div>

            {/* =================================================
                LISTE DES PRODUITS
            ================================================= */}

            {panier.map((article) => {

              const produit =
                article.produit;

              const quantite =
                Number(article.quantite);

              const prix =
                Number(produit.prix);

              const sousTotal =
                prix * quantite;

              const stock =
                Number(produit.stock);

              return (
                <div
                  key={produit.id}
                  className="bg-white rounded-2xl shadow p-5 flex flex-col md:flex-row gap-5 items-center"
                >

                  {/* =================================================
                      IMAGE
                  ================================================= */}

                  <div className="w-28 h-28 flex-shrink-0">

                    {produit.image ? (
                      <ImageProduit
                        image={
                          produit.image
                        }
                        alt={
                          produit.nom
                        }
                        className="w-28 h-28 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-28 h-28 bg-gray-200 rounded-xl flex items-center justify-center text-4xl">
                        📦
                      </div>
                    )}

                  </div>

                  {/* =================================================
                      INFORMATIONS
                  ================================================= */}

                  <div className="flex-1 w-full">

                    <p className="text-sm text-gray-500">
                      {produit.categorie}
                    </p>

                    <h3 className="text-xl font-bold mt-1">
                      {produit.nom}
                    </h3>

                    <p className="text-blue-600 font-bold mt-2">
                      {prix.toLocaleString()} FC
                    </p>

                    {stock > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Stock disponible :{" "}
                        {stock}
                      </p>
                    )}

                  </div>

                  {/* =================================================
                      QUANTITÉ
                  ================================================= */}

                  <div className="flex items-center gap-3">

                    {/* MOINS */}

                    <button
                      type="button"
                      onClick={() =>
                        diminuerQuantite(
                          produit.id
                        )
                      }
                      disabled={
                        quantite <= 1 ||
                        chargement
                      }
                      className="w-10 h-10 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg flex items-center justify-center transition"
                      title="Diminuer"
                    >
                      <FaMinus />
                    </button>

                    {/* QUANTITÉ */}

                    <span className="font-bold text-lg w-8 text-center">
                      {quantite}
                    </span>

                    {/* PLUS */}

                    <button
                      type="button"
                      onClick={() =>
                        augmenterQuantite(
                          produit.id
                        )
                      }
                      disabled={
                        chargement ||
                        (stock > 0 &&
                          quantite >= stock)
                      }
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-lg flex items-center justify-center transition"
                      title="Augmenter"
                    >
                      <FaPlus />
                    </button>

                  </div>

                  {/* =================================================
                      SOUS TOTAL
                  ================================================= */}

                  <div className="text-right min-w-[130px]">

                    <p className="font-bold text-lg">
                      {sousTotal.toLocaleString()} FC
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        supprimerDuPanier(
                          produit.id
                        )
                      }
                      disabled={chargement}
                      className="text-red-500 hover:text-red-700 disabled:text-gray-400 text-sm mt-2 flex items-center gap-1 ml-auto"
                    >
                      🗑️ Supprimer
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

          {/* =================================================
              PASSER LA COMMANDE
          ================================================= */}

          <div className="lg:col-span-1">

            <div className="bg-white rounded-2xl shadow p-6 lg:sticky lg:top-6">

              {/* TITRE */}

              <h2 className="text-2xl font-bold mb-5">
                📦 Passer la commande
              </h2>

              {/* =================================================
                  TOTAL
              ================================================= */}

              <div className="border-b border-gray-300 pb-5 mb-5">

                <div className="flex justify-between items-center">

                  <span className="text-gray-700">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-blue-600">
                    {Number(
                      total
                    ).toLocaleString()}{" "}
                    FC
                  </span>

                </div>

              </div>

              {/* =================================================
                  FORMULAIRE
              ================================================= */}

              <form
                onSubmit={
                  passerCommande
                }
                className="space-y-4"
              >

                {/* NOM */}

                <div>

                  <label className="block font-semibold mb-1">
                    Nom complet
                  </label>

                  <input
                    type="text"
                    value={
                      nomClient
                    }
                    onChange={(e) =>
                      setNomClient(
                        e.target.value
                      )
                    }
                    placeholder="Ex : Jean Mukendi"
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={
                      chargement
                    }
                  />

                </div>

                {/* TÉLÉPHONE */}

                <div>

                  <label className="block font-semibold mb-1">
                    Téléphone
                  </label>

                  <input
                    type="tel"
                    value={
                      telephone
                    }
                    onChange={(e) =>
                      setTelephone(
                        e.target.value
                      )
                    }
                    placeholder="Ex : 0990000000"
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={
                      chargement
                    }
                  />

                </div>

                {/* ADRESSE */}

                <div>

                  <label className="block font-semibold mb-1">
                    Adresse
                  </label>

                  <textarea
                    value={
                      adresse
                    }
                    onChange={(e) =>
                      setAdresse(
                        e.target.value
                      )
                    }
                    placeholder="Adresse de livraison"
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={3}
                    required
                    disabled={
                      chargement
                    }
                  />

                </div>

                {/* COMMENTAIRE */}

                <div>

                  <label className="block font-semibold mb-1">
                    Commentaire
                  </label>

                  <textarea
                    value={
                      commentaire
                    }
                    onChange={(e) =>
                      setCommentaire(
                        e.target.value
                      )
                    }
                    placeholder="Informations supplémentaires..."
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    rows={2}
                    disabled={
                      chargement
                    }
                  />

                </div>

                {/* =================================================
                    BOUTON COMMANDER
                ================================================= */}

                <button
                  type="submit"
                  disabled={
                    chargement ||
                    panier.length === 0
                  }
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition"
                >
                  {chargement ? (
                    "⏳ Enregistrement..."
                  ) : (
                    "✅ Confirmer la commande"
                  )}
                </button>

              </form>

              {/* =================================================
                  CONTINUER LES ACHATS
              ================================================= */}

              <Link
                to="/boutique"
                className="block text-center mt-4 text-blue-600 hover:underline"
              >
                ← Continuer mes achats
              </Link>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Panier;