import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProduits } from "../services/produitService";
import {
  getImagesProduit,
  type ProduitImage,
} from "../services/imageService";

import { usePanier } from "../context/PanierContext";

import type { Produit } from "../types/Produit";

function ProduitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produits, setProduits] = useState<Produit[]>([]);
  const [produit, setProduit] = useState<Produit | null>(null);

  const [images, setImages] = useState<ProduitImage[]>([]);
  const [imagePrincipale, setImagePrincipale] =
    useState<string | null>(null);

  const [chargement, setChargement] =
    useState(true);

  const [quantite, setQuantite] =
    useState(1);

  const {
    ajouterAuPanier,
    nombreArticles,
  } = usePanier();

  useEffect(() => {
    chargerDonnees();
  }, [id]);

  const chargerDonnees = async () => {
    try {
      setChargement(true);

      const data = await getProduits();

      setProduits(data);

      const produitTrouve = data.find(
        (p) => p.id === Number(id)
      );

      setProduit(produitTrouve || null);

      if (produitTrouve) {
        try {
          const photos =
            await getImagesProduit(
              produitTrouve.id
            );

          setImages(photos);

          // Première photo supplémentaire
          if (photos.length > 0) {
            setImagePrincipale(
              photos[0].image
            );
          } else {
            setImagePrincipale(
              produitTrouve.image || null
            );
          }

        } catch (error) {
          console.error(
            "Erreur photos :",
            error
          );

          setImagePrincipale(
            produitTrouve.image || null
          );
        }
      }

    } catch (error) {
      console.error(error);
    } finally {
      setChargement(false);
    }
  };

  // ==========================================
  // CHARGEMENT
  // ==========================================

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <p className="text-gray-500 text-lg">
          ⏳ Chargement du produit...
        </p>

      </div>
    );
  }

  // ==========================================
  // PRODUIT INTROUVABLE
  // ==========================================

  if (!produit) {
    return (
      <div className="min-h-screen bg-gray-100">

        <header className="bg-slate-900 text-white px-8 py-5">

          <div className="max-w-7xl mx-auto flex justify-between items-center">

            <Link
              to="/boutique"
              className="text-2xl font-bold"
            >
              🛍️ Gestion Boutique
            </Link>

            <Link
              to="/panier"
              className="bg-blue-600 px-5 py-3 rounded-lg"
            >
              🛒 Panier ({nombreArticles})
            </Link>

          </div>

        </header>

        <div className="max-w-5xl mx-auto p-10 text-center">

          <div className="text-6xl mb-5">
            📦
          </div>

          <h2 className="text-2xl font-bold">
            Produit introuvable
          </h2>

          <p className="text-gray-500 mt-2">
            Ce produit n'existe plus ou n'est
            pas disponible.
          </p>

          <Link
            to="/boutique"
            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            ← Retour à la boutique
          </Link>

        </div>

      </div>
    );
  }

  // ==========================================
  // IMAGE À AFFICHER
  // ==========================================

  const imageAffichee =
    imagePrincipale ||
    produit.image;

  // ==========================================
  // PRODUITS SIMILAIRES
  // ==========================================

  const produitsSimilaires =
    produits.filter(
      (p) =>
        p.id !== produit.id &&
        p.categorie === produit.categorie &&
        p.stock > 0
    );

  // ==========================================
  // AJOUT PANIER
  // ==========================================

  const ajouterProduit = () => {

    if (produit.stock <= 0) {
      alert(
        "Ce produit est en rupture de stock."
      );
      return;
    }

    if (quantite > produit.stock) {
      alert(
        `Stock disponible : ${produit.stock}`
      );
      return;
    }

    for (
      let i = 0;
      i < quantite;
      i++
    ) {
      ajouterAuPanier(produit);
    }

    alert(
      "Produit ajouté au panier."
    );

    setQuantite(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="bg-slate-900 text-white px-8 py-5">

        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <Link
            to="/boutique"
            className="text-2xl font-bold"
          >
            🛍️ Gestion Boutique
          </Link>

          <Link
            to="/panier"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
          >
            🛒 Panier ({nombreArticles})
          </Link>

        </div>

      </header>

      {/* ======================================
          CONTENU
      ====================================== */}

      <main className="max-w-7xl mx-auto p-8">

        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Retour
        </button>

        {/* ======================================
            PRODUIT
        ====================================== */}

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* =================================
                GALERIE
            ================================= */}

            <div className="bg-gray-100 p-6">

              {/* Grande image */}

              <div className="h-[500px] bg-white rounded-xl flex items-center justify-center overflow-hidden">

                {imageAffichee ? (

                  <img
                    src={`http://https://gestion-boutique-2qu3.onrender.com/uploads/${imageAffichee}`}
                    alt={produit.nom}
                    className="w-full h-full object-contain"
                  />

                ) : (

                  <div className="text-8xl">
                    📦
                  </div>

                )}

              </div>

              {/* Miniatures */}

              {(
                produit.image ||
                images.length > 0
              ) && (

                <div className="flex gap-3 mt-4 overflow-x-auto">

                  {/* Photo principale */}

                  {produit.image && (

                    <button
                      type="button"
                      onClick={() =>
                        setImagePrincipale(
                          produit.image!
                        )
                      }
                      className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                        imageAffichee ===
                        produit.image
                          ? "border-blue-600"
                          : "border-gray-200"
                      }`}
                    >

                      <img
                        src={`http://https://gestion-boutique-2qu3.onrender.com/uploads/${produit.image}`}
                        alt="Photo principale"
                        className="w-full h-full object-cover"
                      />

                    </button>

                  )}

                  {/* Photos supplémentaires */}

                  {images.map(
                    (photo) => (

                      <button
                        key={photo.id}
                        type="button"
                        onClick={() =>
                          setImagePrincipale(
                            photo.image
                          )
                        }
                        className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                          imageAffichee ===
                          photo.image
                            ? "border-blue-600"
                            : "border-gray-200"
                        }`}
                      >

                        <img
                          src={`http://https://gestion-boutique-2qu3.onrender.com/uploads/${photo.image}`}
                          alt={`Photo ${photo.id}`}
                          className="w-full h-full object-cover"
                        />

                      </button>

                    )
                  )}

                </div>

              )}

            </div>

            {/* =================================
                INFORMATIONS
            ================================= */}

            <div className="p-8">

              <p className="text-blue-600 font-semibold">
                {produit.categorie}
              </p>

              <h1 className="text-4xl font-bold mt-2">
                {produit.nom}
              </h1>

              <p className="text-3xl text-blue-600 font-bold mt-6">
                {Number(
                  produit.prix
                ).toLocaleString()} FC
              </p>

              {/* Stock */}

              <div className="mt-5">

                {produit.stock > 0 ? (

                  <span className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                    ✓ Disponible —{" "}
                    {produit.stock} en stock
                  </span>

                ) : (

                  <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                    ✕ Rupture de stock
                  </span>

                )}

              </div>

              {/* Quantité */}

              {produit.stock > 0 && (

                <div className="mt-8">

                  <label className="block font-semibold mb-2">
                    Quantité
                  </label>

                  <div className="flex items-center gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        setQuantite(
                          Math.max(
                            1,
                            quantite - 1
                          )
                        )
                      }
                      className="w-11 h-11 border rounded-lg text-xl hover:bg-gray-100"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={produit.stock}
                      value={quantite}
                      onChange={(e) => {

                        let valeur =
                          Number(
                            e.target.value
                          );

                        if (valeur < 1) {
                          valeur = 1;
                        }

                        if (
                          valeur >
                          produit.stock
                        ) {
                          valeur =
                            produit.stock;
                        }

                        setQuantite(
                          valeur
                        );
                      }}
                      className="w-20 text-center border rounded-lg p-2"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setQuantite(
                          Math.min(
                            produit.stock,
                            quantite + 1
                          )
                        )
                      }
                      className="w-11 h-11 border rounded-lg text-xl hover:bg-gray-100"
                    >
                      +
                    </button>

                  </div>

                </div>

              )}

              {/* Total */}

              {produit.stock > 0 && (

                <div className="bg-gray-50 rounded-xl p-4 mt-6">

                  <div className="flex justify-between">

                    <span>
                      {Number(
                        produit.prix
                      ).toLocaleString()} FC ×{" "}
                      {quantite}
                    </span>

                    <strong className="text-xl">
                      {Number(
                        produit.prix *
                          quantite
                      ).toLocaleString()} FC
                    </strong>

                  </div>

                </div>

              )}

              {/* Boutons */}

              <div className="mt-6 flex flex-col gap-3">

                <button
                  onClick={
                    ajouterProduit
                  }
                  disabled={
                    produit.stock <= 0
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-bold text-lg"
                >
                  🛒 Ajouter au panier
                </button>

                <Link
                  to="/panier"
                  className="w-full text-center border border-blue-600 text-blue-600 hover:bg-blue-50 py-4 rounded-lg font-bold"
                >
                  🛍️ Voir mon panier
                </Link>

              </div>

            </div>

          </div>

        </div>

        {/* ======================================
            PRODUITS SIMILAIRES
        ====================================== */}

        {produitsSimilaires.length > 0 && (

          <section className="mt-12">

            <div className="flex justify-between items-center mb-6">

              <div>

                <h2 className="text-3xl font-bold">
                  🛍️ Vous pourriez aussi aimer
                </h2>

                <p className="text-gray-500 mt-1">
                  Autres produits de la catégorie{" "}
                  <strong>
                    {produit.categorie}
                  </strong>
                </p>

              </div>

              <Link
                to="/boutique"
                className="text-blue-600 font-semibold hover:underline"
              >
                Voir tous les produits →
              </Link>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {produitsSimilaires.map(
                (produitSimilaire) => (

                  <div
                    key={
                      produitSimilaire.id
                    }
                    className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
                  >

                    <Link
                      to={`/boutique/produit/${produitSimilaire.id}`}
                    >

                      {produitSimilaire.image ? (

                        <img
                          src={`http://https://gestion-boutique-2qu3.onrender.com/uploads/${produitSimilaire.image}`}
                          alt={
                            produitSimilaire.nom
                          }
                          className="w-full h-52 object-cover hover:scale-105 transition duration-300"
                        />

                      ) : (

                        <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-5xl">
                          📦
                        </div>

                      )}

                    </Link>

                    <div className="p-4">

                      <p className="text-sm text-gray-500">
                        {
                          produitSimilaire.categorie
                        }
                      </p>

                      <Link
                        to={`/boutique/produit/${produitSimilaire.id}`}
                      >

                        <h3 className="font-bold text-lg hover:text-blue-600">
                          {
                            produitSimilaire.nom
                          }
                        </h3>

                      </Link>

                      <p className="text-blue-600 font-bold text-lg mt-2">
                        {Number(
                          produitSimilaire.prix
                        ).toLocaleString()}{" "}
                        FC
                      </p>

                      <button
                        onClick={() =>
                          ajouterAuPanier(
                            produitSimilaire
                          )
                        }
                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                      >
                        🛒 Ajouter
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default ProduitDetail;