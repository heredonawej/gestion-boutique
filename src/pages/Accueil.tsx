import { useState } from "react";
import { Link } from "react-router-dom";
import { getBoutiqueInfo } from "../services/boutiqueService";

function Accueil() {
  const boutique = getBoutiqueInfo();

  const [afficherInfos, setAfficherInfos] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ==============================
          EN-TÊTE
      ============================== */}

      <header className="bg-slate-900 text-white px-8 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* LOGO / NOM BOUTIQUE */}

          <Link
            to="/"
            className="text-2xl font-bold"
          >
            🛍️ {boutique.nom}
          </Link>

          {/* MENU */}

          <nav className="flex items-center gap-6">

            <Link
              to="/"
              className="hover:text-blue-400 transition"
            >
              Accueil
            </Link>

            <Link
              to="/boutique"
              className="hover:text-blue-400 transition"
            >
              Boutique
            </Link>

            <Link
              to="/suivi-commande"
              className="hover:text-blue-400 transition"
            >
              🔎 Suivre ma commande
            </Link>

            <Link
              to="/panier"
              className="hover:text-blue-400 transition"
            >
              🛒 Panier
            </Link>

            {/* ==============================
                BOUTON INFORMATIONS
            ============================== */}

            <button
              type="button"
              onClick={() => setAfficherInfos(true)}
              className="text-white hover:text-blue-400 transition text-xl"
              title="Informations de la boutique"
            >
              ℹ️
            </button>

          </nav>

        </div>
      </header>

      {/* ==============================
          FENÊTRE INFORMATIONS
      ============================== */}

      {afficherInfos && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setAfficherInfos(false)}
        >

          <div
            className="bg-white text-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8"
            onClick={(e) => e.stopPropagation()}
          >

            {/* TITRE */}

            <div className="text-center mb-6">

              <div className="text-5xl mb-3">
                🏪
              </div>

              <h2 className="text-2xl font-bold">
                Informations de la boutique
              </h2>

            </div>

            {/* INFORMATIONS */}

            <div className="space-y-4">

              {/* NOM */}

              <div className="flex items-start gap-3">
                <span className="text-xl">
                  🏪
                </span>

                <div>
                  <p className="text-sm text-gray-500">
                    Nom de la boutique
                  </p>

                  <p className="font-semibold">
                    {boutique.nom}
                  </p>
                </div>
              </div>

              {/* ADRESSE */}

              {boutique.adresse && (
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    📍
                  </span>

                  <div>
                    <p className="text-sm text-gray-500">
                      Adresse
                    </p>

                    <p className="font-semibold">
                      {boutique.adresse}
                    </p>
                  </div>
                </div>
              )}

              {/* TELEPHONE */}

              {boutique.telephone && (
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    📞
                  </span>

                  <div>
                    <p className="text-sm text-gray-500">
                      Téléphone
                    </p>

                    <p className="font-semibold">
                      {boutique.telephone}
                    </p>
                  </div>
                </div>
              )}

              {/* EMAIL */}

              {boutique.email && (
                <div className="flex items-start gap-3">
                  <span className="text-xl">
                    ✉️
                  </span>

                  <div>
                    <p className="text-sm text-gray-500">
                      Email
                    </p>

                    <p className="font-semibold break-all">
                      {boutique.email}
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* BOUTON FERMER */}

            <button
              type="button"
              onClick={() => setAfficherInfos(false)}
              className="w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition"
            >
              Fermer
            </button>

          </div>

        </div>
      )}

      {/* ==============================
          PRÉSENTATION
      ============================== */}

      <main>

        <section className="min-h-[500px] flex items-center justify-center bg-gradient-to-r from-slate-900 to-blue-800 text-white px-6">

          <div className="text-center max-w-3xl">

            <p className="text-blue-300 text-lg font-semibold mb-4">
              BIENVENUE DANS NOTRE BOUTIQUE
            </p>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Trouvez votre style,
              <br />
              exprimez-vous.
            </h1>

            <p className="text-lg text-gray-200 mb-8">
              Découvrez nos articles disponibles et trouvez
              facilement les produits qui vous correspondent.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">

              {/* BOUTIQUE */}

              <Link
                to="/boutique"
                className="inline-block bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition"
              >
                🛍️ Voir la boutique
              </Link>

              {/* SUIVI */}

              <Link
                to="/suivi-commande"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition"
              >
                🔎 Suivre ma commande
              </Link>

            </div>

          </div>

        </section>

        {/* ==============================
            AVANTAGES
        ============================== */}

        <section className="max-w-7xl mx-auto py-16 px-8">

          <h2 className="text-3xl font-bold text-center mb-10">
            Pourquoi choisir notre boutique ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* PRODUITS */}

            <div className="bg-white rounded-2xl shadow p-8 text-center">

              <div className="text-5xl mb-4">
                👕
              </div>

              <h3 className="text-xl font-bold mb-2">
                Nombreux produits
              </h3>

              <p className="text-gray-500">
                Découvrez différents articles disponibles
                dans notre boutique.
              </p>

            </div>

            {/* COMMANDE */}

            <div className="bg-white rounded-2xl shadow p-8 text-center">

              <div className="text-5xl mb-4">
                🛒
              </div>

              <h3 className="text-xl font-bold mb-2">
                Commande facile
              </h3>

              <p className="text-gray-500 mb-4">
                Ajoutez vos produits au panier et passez
                votre commande facilement.
              </p>

              <Link
                to="/boutique"
                className="text-blue-600 font-semibold hover:underline"
              >
                Découvrir la boutique →
              </Link>

            </div>

            {/* SUIVI */}

            <div className="bg-white rounded-2xl shadow p-8 text-center">

              <div className="text-5xl mb-4">
                📦
              </div>

              <h3 className="text-xl font-bold mb-2">
                Suivi des commandes
              </h3>

              <p className="text-gray-500 mb-4">
                Consultez l'évolution de vos commandes
                en temps réel.
              </p>

              <Link
                to="/suivi-commande"
                className="text-blue-600 font-semibold hover:underline"
              >
                Suivre ma commande →
              </Link>

            </div>

          </div>

        </section>

      </main>

      {/* ==============================
          PIED DE PAGE
      ============================== */}

      <footer className="bg-slate-900 text-white text-center py-6">

        <p>
          © {new Date().getFullYear()} {boutique.nom}.
          Tous droits réservés.
        </p>

      </footer>

    </div>
  );
}

export default Accueil;