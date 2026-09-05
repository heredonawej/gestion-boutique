import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProduits } from "../services/produitService";
import { usePanier } from "../context/PanierContext";

import type { Produit } from "../types/Produit";
import { getBoutiqueInfo } from "../services/boutiqueService";

function Boutique() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [recherche, setRecherche] = useState("");
  const [categorie, setCategorie] = useState("Toutes");

  const { ajouterAuPanier, nombreArticles } = usePanier();
  const boutique = getBoutiqueInfo();

  useEffect(() => {
    chargerProduits();
  }, []);

  const chargerProduits = async () => {
    try {
      const data = await getProduits();
      setProduits(data);
    } catch (error) {
      console.error(error);
    }
  };

  const produitsFiltres = produits.filter((produit) => {
    const rechercheOK = produit.nom
      .toLowerCase()
      .includes(recherche.toLowerCase());

    const categorieOK =
      categorie === "Toutes" ||
      produit.categorie === categorie;

    return rechercheOK && categorieOK;
  });

  const categories = [
    "Toutes",
    ...Array.from(
      new Set(
        produits.map((produit) => produit.categorie)
      )
    ),
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================================
          HEADER
      ================================= */}

      <header className="sticky top-0 z-40 bg-slate-950 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-16 flex items-center justify-between gap-4">

            <Link
              to="/"
              className="flex items-center gap-2 min-w-0"
            >
              <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl flex-shrink-0">
                🛍️
              </span>

              <span className="font-bold text-base sm:text-xl truncate">
                {boutique.nom}
              </span>
            </Link>

            <Link
              to="/panier"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-3 sm:px-5 py-2.5 rounded-xl font-semibold text-sm sm:text-base transition shadow-lg"
            >
              🛒
              <span>Panier</span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Présentation */}

        <section className="text-center mb-8 sm:mb-10">

          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
            Notre collection
          </p>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
            Découvrez notre boutique
          </h1>

          <p className="text-gray-500 mt-3 text-sm sm:text-base">
            Trouvez facilement les produits qui vous correspondent.
          </p>

        </section>

        {/* ================================
            RECHERCHE
        ================================= */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-8">

          <div className="flex flex-col md:flex-row gap-3">

            <div className="relative flex-1">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />

            </div>

            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3.5 bg-white outline-none focus:ring-2 focus:ring-blue-500 md:min-w-[200px]"
            >

              {categories.map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}

            </select>

          </div>

        </div>

        {/* ================================
            RESULTAT
        ================================= */}

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Nos produits
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {produitsFiltres.length} produit
              {produitsFiltres.length > 1 ? "s" : ""} disponible
              {produitsFiltres.length > 1 ? "s" : ""}
            </p>
          </div>

        </div>

        {/* ================================
            PRODUITS
        ================================= */}

        {produitsFiltres.length === 0 ? (

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              Aucun produit trouvé
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Essayez une autre recherche ou une autre catégorie.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">

            {produitsFiltres.map((produit) => (

              <div
                key={produit.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >

                {/* ================================
                    IMAGE
                ================================= */}

                <Link
                  to={`/boutique/produit/${produit.id}`}
                  className="block overflow-hidden bg-gray-100"
                >

                  {produit.image ? (

                    <img
                      src={`${
                        import.meta.env.PROD
                          ? "https://gestion-boutique-2qu3.onrender.com"
                          : "http://localhost:3001"
                      }/uploads/${produit.image}`}
                      alt={produit.nom}
                      className="w-full h-40 sm:h-48 lg:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                  ) : (

                    <div className="w-full h-40 sm:h-48 lg:h-52 bg-gray-100 flex items-center justify-center text-4xl sm:text-5xl">
                      📦
                    </div>

                  )}

                </Link>

                {/* ================================
                    INFORMATIONS
                ================================= */}

                <div className="p-3 sm:p-5">

                  <p className="text-[11px] sm:text-xs font-medium text-blue-600 uppercase tracking-wide truncate">
                    {produit.categorie}
                  </p>

                  <Link
                    to={`/boutique/produit/${produit.id}`}
                  >

                    <h3 className="font-bold text-sm sm:text-lg text-slate-900 mt-1 line-clamp-2 hover:text-blue-600 transition">
                      {produit.nom}
                    </h3>

                  </Link>

                  <div className="mt-2 sm:mt-3">

                    <p className="text-base sm:text-xl font-extrabold text-blue-600">
                      {Number(produit.prix).toLocaleString()} FC
                    </p>

                  </div>

                  {/* Stock */}

                  <div className="mt-2 sm:mt-3">

                    {produit.stock > 0 ? (

                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        ✓ Disponible
                        <span className="hidden sm:inline">
                          ({produit.stock})
                        </span>
                      </span>

                    ) : (

                      <span className="inline-flex items-center text-[11px] sm:text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                        ✕ Rupture
                      </span>

                    )}

                  </div>

                  {/* ================================
                      ACTIONS
                  ================================= */}

                  <div className="mt-3 sm:mt-4 space-y-2">

                    <Link
                      to={`/boutique/produit/${produit.id}`}
                      className="w-full flex items-center justify-center gap-1.5 border border-gray-200 hover:border-blue-600 hover:bg-blue-50 text-slate-700 hover:text-blue-600 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition"
                    >
                      👁️
                      <span>Voir</span>
                    </Link>

                    <button
                      onClick={() => ajouterAuPanier(produit)}
                      disabled={produit.stock <= 0}
                      className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition"
                    >
                      🛒
                      <span>Ajouter</span>
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

      {/* ================================
          FOOTER
      ================================= */}

      <footer className="bg-slate-950 text-white mt-10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="text-center">

            <div className="font-bold text-lg">
              🛍️ {boutique.nom}
            </div>

            <p className="text-slate-400 text-sm mt-2">
              Découvrez nos produits et commandez facilement.
            </p>

            <div className="border-t border-white/10 mt-6 pt-5">

              <p className="text-xs sm:text-sm text-slate-500">
                © {new Date().getFullYear()} {boutique.nom}. Tous droits réservés.
              </p>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Boutique;