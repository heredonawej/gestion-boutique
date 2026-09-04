import { useState } from "react";
import { Link } from "react-router-dom";
import { getBoutiqueInfo } from "../services/boutiqueService";

function Accueil() {
  const boutique = getBoutiqueInfo();

  const [afficherInfos, setAfficherInfos] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);

  const fermerMenu = () => {
    setMenuOuvert(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* =====================================================
          EN-TÊTE
      ===================================================== */}

      <header className="sticky top-0 z-40 bg-slate-950 text-white shadow-lg">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="h-16 flex items-center justify-between">

            {/* LOGO */}

            <Link
              to="/"
              onClick={fermerMenu}
              className="flex items-center gap-2 min-w-0"
            >

              <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl shadow-lg flex-shrink-0">
                🛍️
              </span>

              <span className="text-lg sm:text-xl font-bold truncate max-w-[180px] sm:max-w-none">
                {boutique.nom}
              </span>

            </Link>


            {/* =================================================
                MENU DESKTOP
            ================================================= */}

            <nav className="hidden md:flex items-center gap-2">

              <Link
                to="/"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition"
              >
                Accueil
              </Link>

              <Link
                to="/boutique"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition"
              >
                Boutique
              </Link>

              <Link
                to="/suivi-commande"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition"
              >
                🔎 Suivre ma commande
              </Link>

              <Link
                to="/panier"
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition"
              >
                🛒 Panier
              </Link>

              <button
                type="button"
                onClick={() => setAfficherInfos(true)}
                className="ml-1 w-10 h-10 rounded-lg hover:bg-white/10 transition flex items-center justify-center text-lg"
                title="Informations de la boutique"
              >
                ℹ️
              </button>

            </nav>


            {/* =================================================
                BOUTON MOBILE
            ================================================= */}

            <button
              type="button"
              onClick={() => setMenuOuvert(!menuOuvert)}
              className="md:hidden w-11 h-11 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl transition"
              aria-label="Ouvrir le menu"
              aria-expanded={menuOuvert}
            >
              {menuOuvert ? "✕" : "☰"}
            </button>

          </div>


          {/* =================================================
              MENU MOBILE
          ================================================= */}

          {menuOuvert && (

            <nav className="md:hidden pb-4 space-y-2">

              <Link
                to="/"
                onClick={fermerMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 font-medium"
              >
                🏠
                <span>Accueil</span>
              </Link>

              <Link
                to="/boutique"
                onClick={fermerMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 font-medium transition"
              >
                🛍️
                <span>Boutique</span>
              </Link>

              <Link
                to="/suivi-commande"
                onClick={fermerMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 font-medium transition"
              >
                🔎
                <span>Suivre ma commande</span>
              </Link>

              <Link
                to="/panier"
                onClick={fermerMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 font-medium transition"
              >
                🛒
                <span>Mon panier</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setAfficherInfos(true);
                  fermerMenu();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 font-medium transition text-left"
              >
                ℹ️
                <span>Informations de la boutique</span>
              </button>

            </nav>

          )}

        </div>

      </header>


      {/* =====================================================
          FENÊTRE INFORMATIONS
      ===================================================== */}

      {afficherInfos && (

        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 py-6"
          onClick={() => setAfficherInfos(false)}
        >

          <div
            className="bg-white text-gray-800 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >

            {/* TITRE */}

            <div className="text-center mb-7">

              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-4xl mb-4">
                🏪
              </div>

              <h2 className="text-xl sm:text-2xl font-bold">
                Informations de la boutique
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Retrouvez nos coordonnées
              </p>

            </div>


            {/* INFORMATIONS */}

            <div className="space-y-3">

              {/* NOM */}

              <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4">

                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  🏪
                </div>

                <div className="min-w-0">

                  <p className="text-xs text-gray-500">
                    Nom de la boutique
                  </p>

                  <p className="font-semibold break-words">
                    {boutique.nom}
                  </p>

                </div>

              </div>


              {/* ADRESSE */}

              {boutique.adresse && (

                <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4">

                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                    📍
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs text-gray-500">
                      Adresse
                    </p>

                    <p className="font-semibold break-words">
                      {boutique.adresse}
                    </p>

                  </div>

                </div>

              )}


              {/* TELEPHONE */}

              {boutique.telephone && (

                <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4">

                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    📞
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs text-gray-500">
                      Téléphone
                    </p>

                    <p className="font-semibold break-words">
                      {boutique.telephone}
                    </p>

                  </div>

                </div>

              )}


              {/* EMAIL */}

              {boutique.email && (

                <div className="flex items-start gap-4 bg-gray-50 rounded-2xl p-4">

                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    ✉️
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs text-gray-500">
                      Email
                    </p>

                    <p className="font-semibold break-all">
                      {boutique.email}
                    </p>

                  </div>

                </div>

              )}

            </div>


            {/* FERMER */}

            <button
              type="button"
              onClick={() => setAfficherInfos(false)}
              className="
                w-full
                mt-7
                bg-slate-950
                hover:bg-slate-800
                text-white
                py-3.5
                rounded-xl
                font-semibold
                transition
              "
            >
              Fermer
            </button>

          </div>

        </div>

      )}


      {/* =====================================================
          HERO
      ===================================================== */}

      <main>

        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-800 text-white">

          {/* Décor */}

          <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />


          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-24 lg:py-32">

            <div className="max-w-3xl mx-auto text-center">

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-6">

                <span className="text-lg">
                  🛍️
                </span>

                <span className="text-sm font-medium text-blue-100">
                  Bienvenue chez {boutique.nom}
                </span>

              </div>


              <p className="text-blue-300 text-sm sm:text-base font-bold tracking-widest uppercase mb-4">
                Découvrez notre collection
              </p>


              <h1 className="
                text-4xl
                sm:text-5xl
                lg:text-6xl
                font-extrabold
                leading-tight
                mb-6
              ">
                Trouvez votre style,
                <span className="block text-blue-400">
                  exprimez-vous.
                </span>
              </h1>


              <p className="
                text-base
                sm:text-lg
                text-slate-300
                leading-relaxed
                max-w-2xl
                mx-auto
                mb-9
              ">
                Découvrez nos articles disponibles et trouvez
                facilement les produits qui vous correspondent.
                Commandez directement depuis notre boutique.
              </p>


              {/* BOUTONS */}

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">

                <Link
                  to="/boutique"
                  className="
                    w-full
                    sm:w-auto
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    bg-white
                    text-slate-950
                    px-7
                    py-4
                    rounded-2xl
                    font-bold
                    hover:bg-slate-100
                    active:scale-[0.98]
                    transition
                    shadow-xl
                  "
                >
                  🛍️
                  <span>Voir la boutique</span>
                </Link>


                <Link
                  to="/suivi-commande"
                  className="
                    w-full
                    sm:w-auto
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    bg-blue-600
                    hover:bg-blue-500
                    text-white
                    px-7
                    py-4
                    rounded-2xl
                    font-bold
                    active:scale-[0.98]
                    transition
                    shadow-xl
                  "
                >
                  🔎
                  <span>Suivre ma commande</span>
                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            AVANTAGES
        ================================================= */}

        <section className="max-w-7xl mx-auto py-14 sm:py-20 px-5 sm:px-8">

          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">

            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-2">
              Une expérience simple
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Pourquoi choisir notre boutique ?
            </h2>

            <p className="text-gray-500 mt-3 text-sm sm:text-base">
              Tout est pensé pour vous permettre de trouver,
              commander et suivre vos produits facilement.
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

            {/* PRODUITS */}

            <div className="
              bg-white
              rounded-3xl
              border border-gray-100
              shadow-sm
              p-6 sm:p-8
              text-center
              hover:shadow-lg
              hover:-translate-y-1
              transition
            ">

              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-4xl mb-5">
                👕
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Nombreux produits
              </h3>

              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Découvrez différents articles disponibles
                dans notre boutique.
              </p>

            </div>


            {/* COMMANDE */}

            <div className="
              bg-white
              rounded-3xl
              border border-gray-100
              shadow-sm
              p-6 sm:p-8
              text-center
              hover:shadow-lg
              hover:-translate-y-1
              transition
            ">

              <div className="mx-auto w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center text-4xl mb-5">
                🛒
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Commande facile
              </h3>

              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-5">
                Ajoutez vos produits au panier et passez
                votre commande facilement.
              </p>

              <Link
                to="/boutique"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition"
              >
                Découvrir la boutique
                <span className="ml-1">
                  →
                </span>
              </Link>

            </div>


            {/* SUIVI */}

            <div className="
              bg-white
              rounded-3xl
              border border-gray-100
              shadow-sm
              p-6 sm:p-8
              text-center
              hover:shadow-lg
              hover:-translate-y-1
              transition
              sm:col-span-2
              lg:col-span-1
            ">

              <div className="mx-auto w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-4xl mb-5">
                📦
              </div>

              <h3 className="text-lg sm:text-xl font-bold mb-2">
                Suivi des commandes
              </h3>

              <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-5">
                Consultez l'évolution de vos commandes
                facilement.
              </p>

              <Link
                to="/suivi-commande"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition"
              >
                Suivre ma commande
                <span className="ml-1">
                  →
                </span>
              </Link>

            </div>

          </div>

        </section>


        {/* =================================================
            CALL TO ACTION
        ================================================= */}

        <section className="px-5 sm:px-8 pb-14 sm:pb-20">

          <div className="
            max-w-7xl
            mx-auto
            rounded-3xl
            bg-blue-600
            text-white
            px-6
            sm:px-10
            py-10
            sm:py-12
            text-center
            shadow-xl
          ">

            <div className="text-4xl mb-4">
              🛍️
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold">
              Prêt à découvrir nos produits ?
            </h2>

            <p className="text-blue-100 mt-3 max-w-xl mx-auto text-sm sm:text-base">
              Parcourez notre catalogue et trouvez l'article
              qui vous convient.
            </p>

            <Link
              to="/boutique"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                mt-6
                bg-white
                text-blue-700
                px-7
                py-3.5
                rounded-xl
                font-bold
                hover:bg-blue-50
                transition
              "
            >
              🛍️ Voir les produits
            </Link>

          </div>

        </section>

      </main>


      {/* =====================================================
          PIED DE PAGE
      ===================================================== */}

      <footer className="bg-slate-950 text-white">

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            <div className="text-center md:text-left">

              <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-lg">
                🛍️
                <span>{boutique.nom}</span>
              </div>

              <p className="text-slate-400 text-sm mt-2">
                Votre boutique, simplement.
              </p>

            </div>


            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">

              <Link
                to="/boutique"
                className="text-slate-300 hover:text-white transition"
              >
                Boutique
              </Link>

              <Link
                to="/suivi-commande"
                className="text-slate-300 hover:text-white transition"
              >
                Suivi commande
              </Link>

              <Link
                to="/panier"
                className="text-slate-300 hover:text-white transition"
              >
                Panier
              </Link>

            </div>

          </div>


          <div className="border-t border-white/10 mt-8 pt-6 text-center">

            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} {boutique.nom}.
              Tous droits réservés.
            </p>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Accueil;