import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProduits } from "../services/produitService";
import {
  getImagesProduit,
  type ProduitImage,
} from "../services/imageService";

import { usePanier } from "../context/PanierContext";
import type { Produit } from "../types/Produit";

const SERVER_URL = import.meta.env.PROD
  ? "https://gestion-boutique-2qu3.onrender.com"
  : "http://localhost:3001";

function ProduitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produits, setProduits] = useState<Produit[]>([]);
  const [produit, setProduit] = useState<Produit | null>(null);

  const [images, setImages] = useState<ProduitImage[]>([]);
  const [imagePrincipale, setImagePrincipale] = useState<string | null>(null);

  const [chargement, setChargement] = useState(true);
  const [quantite, setQuantite] = useState(1);

  const { ajouterAuPanier, nombreArticles } = usePanier();

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
          const photos = await getImagesProduit(produitTrouve.id);

          setImages(photos);

          if (photos.length > 0) {
            setImagePrincipale(photos[0].image);
          } else {
            setImagePrincipale(produitTrouve.image || null);
          }
        } catch (error) {
          console.error("Erreur photos :", error);
          setImagePrincipale(produitTrouve.image || null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setChargement(false);
    }
  };

  /* ================================
      CHARGEMENT
  ================================= */

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-4xl mb-3">⏳</div>

          <p className="text-gray-500">
            Chargement du produit...
          </p>
        </div>
      </div>
    );
  }

  /* ================================
      PRODUIT INTROUVABLE
  ================================= */

  if (!produit) {
    return (
      <div className="min-h-screen bg-gray-50">

        <header className="bg-slate-950 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

            <div className="flex items-center justify-between gap-4">

              <Link
                to="/boutique"
                className="flex items-center gap-2 font-bold text-lg sm:text-xl"
              >
                <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                  🛍️
                </span>

                <span className="truncate">
                  Gestion Boutique
                </span>
              </Link>

              <Link
                to="/panier"
                className="bg-blue-600 hover:bg-blue-500 px-3 sm:px-5 py-2.5 rounded-xl font-semibold text-sm"
              >
                🛒 Panier ({nombreArticles})
              </Link>

            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-16 text-center">

          <div className="text-6xl mb-5">
            📦
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Produit introuvable
          </h2>

          <p className="text-gray-500 mt-2">
            Ce produit n'existe plus ou n'est pas disponible.
          </p>

          <Link
            to="/boutique"
            className="inline-flex items-center mt-7 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            ← Retour à la boutique
          </Link>

        </div>
      </div>
    );
  }

  /* ================================
      IMAGE
  ================================= */

  const imageAffichee =
    imagePrincipale || produit.image;

  /* ================================
      PRODUITS SIMILAIRES
  ================================= */

  const produitsSimilaires = produits.filter(
    (p) =>
      p.id !== produit.id &&
      p.categorie === produit.categorie &&
      p.stock > 0
  );

  /* ================================
      AJOUT PANIER
  ================================= */

  const ajouterProduit = () => {
    if (produit.stock <= 0) {
      alert("Ce produit est en rupture de stock.");
      return;
    }

    if (quantite > produit.stock) {
      alert(`Stock disponible : ${produit.stock}`);
      return;
    }

    for (let i = 0; i < quantite; i++) {
      ajouterAuPanier(produit);
    }

    alert("Produit ajouté au panier.");

    setQuantite(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================================
          HEADER
      ================================= */}

      <header className="sticky top-0 z-40 bg-slate-950 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-16 flex items-center justify-between gap-4">

            <Link
              to="/boutique"
              className="flex items-center gap-2 min-w-0"
            >

              <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl flex-shrink-0">
                🛍️
              </span>

              <span className="font-bold text-base sm:text-xl truncate">
                Gestion Boutique
              </span>

            </Link>

            <Link
              to="/panier"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 sm:px-5 py-2.5 rounded-xl font-semibold text-sm sm:text-base transition"
            >
              🛒

              <span>
                Panier
              </span>

              <span className="bg-white text-blue-700 min-w-6 h-6 px-1 rounded-full flex items-center justify-center text-xs font-bold">
                {nombreArticles}
              </span>

            </Link>

          </div>

        </div>

      </header>

      {/* ================================
          CONTENU
      ================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

        {/* RETOUR */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base"
        >
          ← Retour à la boutique
        </button>

        {/* ================================
            PRODUIT PRINCIPAL
        ================================= */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* ================================
                GALERIE
            ================================= */}

            <div className="bg-gray-50 p-4 sm:p-6 lg:p-8">

              {/* IMAGE PRINCIPALE */}

              <div className="w-full h-[300px] sm:h-[380px] lg:h-[430px] bg-white rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center">

                {imageAffichee ? (

                  <img
                    src={`${SERVER_URL}/uploads/${imageAffichee}`}
                    alt={produit.nom}
                    className="w-full h-full object-contain p-3 sm:p-5"
                  />

                ) : (

                  <div className="text-7xl sm:text-8xl">
                    📦
                  </div>

                )}

              </div>

              {/* MINIATURES */}

              {(produit.image || images.length > 0) && (

                <div className="flex gap-2 sm:gap-3 mt-4 overflow-x-auto pb-1">

                  {/* PHOTO PRINCIPALE */}

                  {produit.image && (

                    <button
                      type="button"
                      onClick={() =>
                        setImagePrincipale(produit.image!)
                      }
                      className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 bg-white ${
                        imageAffichee === produit.image
                          ? "border-blue-600"
                          : "border-gray-200"
                      }`}
                    >

                      <img
                        src={`${SERVER_URL}/uploads/${produit.image}`}
                        alt="Photo principale"
                        className="w-full h-full object-cover"
                      />

                    </button>

                  )}

                  {/* PHOTOS SUPPLEMENTAIRES */}

                  {images.map((photo) => (

                    <button
                      key={photo.id}
                      type="button"
                      onClick={() =>
                        setImagePrincipale(photo.image)
                      }
                      className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 bg-white ${
                        imageAffichee === photo.image
                          ? "border-blue-600"
                          : "border-gray-200"
                      }`}
                    >

                      <img
                        src={`${SERVER_URL}/uploads/${photo.image}`}
                        alt={`Photo ${photo.id}`}
                        className="w-full h-full object-cover"
                      />

                    </button>

                  ))}

                </div>

              )}

            </div>

            {/* ================================
                INFORMATIONS
            ================================= */}

            <div className="p-5 sm:p-7 lg:p-10">

              {/* CATEGORIE */}

              <span className="inline-flex bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide">
                {produit.categorie}
              </span>

              {/* NOM */}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-4 leading-tight">
                {produit.nom}
              </h1>

              {/* PRIX */}

              <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-5">
                {Number(produit.prix).toLocaleString()} FC
              </p>

              <div className="h-px bg-gray-100 my-6" />

              {/* STOCK */}

              {produit.stock > 0 ? (

                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl text-sm font-semibold">
                  <span>✓</span>
                  <span>
                    Disponible — {produit.stock} en stock
                  </span>
                </div>

              ) : (

                <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold">
                  <span>✕</span>
                  <span>Rupture de stock</span>
                </div>

              )}

              {/* QUANTITE */}

              {produit.stock > 0 && (

                <div className="mt-7">

                  <label className="block text-sm font-bold text-slate-800 mb-3">
                    Quantité
                  </label>

                  <div className="flex items-center gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        setQuantite(
                          Math.max(1, quantite - 1)
                        )
                      }
                      className="w-11 h-11 rounded-xl border border-gray-200 hover:bg-gray-100 text-xl font-bold transition"
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min={1}
                      max={produit.stock}
                      value={quantite}
                      onChange={(e) => {

                        let valeur = Number(
                          e.target.value
                        );

                        if (valeur < 1 || isNaN(valeur)) {
                          valeur = 1;
                        }

                        if (valeur > produit.stock) {
                          valeur = produit.stock;
                        }

                        setQuantite(valeur);
                      }}
                      className="w-16 h-11 text-center border border-gray-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-11 h-11 rounded-xl border border-gray-200 hover:bg-gray-100 text-xl font-bold transition"
                    >
                      +
                    </button>

                  </div>

                </div>

              )}

              {/* TOTAL */}

              {produit.stock > 0 && (

                <div className="bg-slate-50 border border-gray-100 rounded-2xl p-4 mt-6">

                  <div className="flex items-center justify-between gap-4">

                    <span className="text-sm text-gray-500">
                      {Number(produit.prix).toLocaleString()} FC × {quantite}
                    </span>

                    <strong className="text-lg sm:text-xl text-slate-900">
                      {Number(
                        produit.prix * quantite
                      ).toLocaleString()} FC
                    </strong>

                  </div>

                </div>

              )}

              {/* ACTIONS */}

              <div className="mt-6 space-y-3">

                <button
                  type="button"
                  onClick={ajouterProduit}
                  disabled={produit.stock <= 0}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 sm:py-4 rounded-xl font-bold transition shadow-sm"
                >
                  🛒
                  <span>
                    Ajouter au panier
                  </span>
                </button>

                <Link
                  to="/panier"
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:text-blue-600 py-3.5 sm:py-4 rounded-xl font-bold transition"
                >
                  🛍️
                  <span>
                    Voir mon panier
                  </span>
                </Link>

              </div>

            </div>

          </div>

        </div>

        {/* ================================
            PRODUITS SIMILAIRES
        ================================= */}

        {produitsSimilaires.length > 0 && (

          <section className="mt-10 sm:mt-14">

            <div className="mb-6">

              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                Suggestions
              </p>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Vous pourriez aussi aimer
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                Autres produits de la catégorie{" "}
                <strong>{produit.categorie}</strong>
              </p>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">

              {produitsSimilaires.map(
                (produitSimilaire) => (

                  <div
                    key={produitSimilaire.id}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >

                    {/* IMAGE */}

                    <Link
                      to={`/boutique/produit/${produitSimilaire.id}`}
                      className="block overflow-hidden bg-gray-100"
                    >

                      {produitSimilaire.image ? (

                        <img
                          src={`${SERVER_URL}/uploads/${produitSimilaire.image}`}
                          alt={produitSimilaire.nom}
                          className="w-full h-36 sm:h-44 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                      ) : (

                        <div className="w-full h-36 sm:h-44 lg:h-48 bg-gray-100 flex items-center justify-center text-4xl">
                          📦
                        </div>

                      )}

                    </Link>

                    {/* INFORMATIONS */}

                    <div className="p-3 sm:p-4">

                      <p className="text-[10px] sm:text-xs text-blue-600 font-semibold uppercase truncate">
                        {produitSimilaire.categorie}
                      </p>

                      <Link
                        to={`/boutique/produit/${produitSimilaire.id}`}
                      >

                        <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1 line-clamp-2 hover:text-blue-600 transition">
                          {produitSimilaire.nom}
                        </h3>

                      </Link>

                      <p className="text-blue-600 font-extrabold text-sm sm:text-lg mt-2">
                        {Number(
                          produitSimilaire.prix
                        ).toLocaleString()} FC
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          ajouterAuPanier(
                            produitSimilaire
                          )
                        }
                        className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition"
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

      {/* ================================
          FOOTER
      ================================= */}

      <footer className="bg-slate-950 text-white mt-10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

          <div className="text-center">

            <div className="font-bold text-lg">
              🛍️ Gestion Boutique
            </div>

            <p className="text-slate-400 text-sm mt-2">
              Découvrez nos produits et commandez facilement.
            </p>

            <div className="border-t border-white/10 mt-6 pt-5">

              <p className="text-xs sm:text-sm text-slate-500">
                © {new Date().getFullYear()} Gestion Boutique. Tous droits réservés.
              </p>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default ProduitDetail;