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
        produits.map(
          (produit) => produit.categorie
        )
      )
    ),
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="bg-slate-900 text-white px-8 py-5">

        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <Link
  to="/"
  className="text-2xl font-bold"
>
  🛍️ {boutique.nom}
</Link>

          <Link
            to="/panier"
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
          >
            🛒 Panier ({nombreArticles})
          </Link>

        </div>

      </header>

      {/* =====================================
          CONTENU
      ===================================== */}

      <main className="max-w-7xl mx-auto p-8">

        {/* Présentation */}

        <section className="text-center mb-10">

          <h2 className="text-4xl font-bold">
            Bienvenue dans notre boutique
          </h2>

          <p className="text-gray-500 mt-3">
            Découvrez nos produits disponibles.
          </p>

        </section>

        {/* =====================================
            RECHERCHE
        ===================================== */}

        <div className="bg-white rounded-2xl shadow p-5 mb-8 flex flex-col md:flex-row gap-4">

          <input
            type="text"
            placeholder="🔍 Rechercher un produit..."
            value={recherche}
            onChange={(e) =>
              setRecherche(e.target.value)
            }
            className="flex-1 border rounded-lg p-3"
          />

          <select
            value={categorie}
            onChange={(e) =>
              setCategorie(e.target.value)
            }
            className="border rounded-lg p-3"
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

        {/* =====================================
            PRODUITS
        ===================================== */}

        {produitsFiltres.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <p className="text-gray-500">
              Aucun produit disponible.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {produitsFiltres.map((produit) => (

              <div
                key={produit.id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
              >

                {/* =================================
                    IMAGE
                ================================= */}

                <Link
                  to={`/boutique/produit/${produit.id}`}
                >

                  {produit.image ? (

                    <img
                      src={`http://https://gestion-boutique-2qu3.onrender.com/uploads/${produit.image}`}
                      alt={produit.nom}
                      className="w-full h-56 object-cover hover:scale-105 transition duration-300"
                    />

                  ) : (

                    <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-5xl">
                      📦
                    </div>

                  )}

                </Link>

                {/* =================================
                    INFORMATIONS
                ================================= */}

                <div className="p-5">

                  <p className="text-sm text-gray-500">
                    {produit.categorie}
                  </p>

                  <Link
                    to={`/boutique/produit/${produit.id}`}
                  >

                    <h3 className="text-xl font-bold mt-1 hover:text-blue-600">
                      {produit.nom}
                    </h3>

                  </Link>

                  <p className="text-blue-600 text-xl font-bold mt-3">
                    {Number(
                      produit.prix
                    ).toLocaleString()} FC
                  </p>

                  {/* Stock */}

                  <p className="text-sm mt-2">

                    {produit.stock > 0 ? (

                      <span className="text-green-600">
                        ✓ Disponible ({produit.stock})
                      </span>

                    ) : (

                      <span className="text-red-600">
                        ✕ Rupture de stock
                      </span>

                    )}

                  </p>

                  {/* =================================
                      ACTIONS
                  ================================= */}

                  <div className="flex flex-col gap-2 mt-4">

                    <Link
                      to={`/boutique/produit/${produit.id}`}
                      className="w-full text-center border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-lg font-semibold"
                    >
                      👁️ Voir le produit
                    </Link>

                    <button
                      onClick={() =>
                        ajouterAuPanier(produit)
                      }
                      disabled={produit.stock <= 0}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
                    >
                      🛒 Ajouter au panier
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Boutique;