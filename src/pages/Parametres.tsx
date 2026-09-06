import { useEffect, useState } from "react";
import {
  getBoutiqueInfo,
  sauvegarderBoutiqueInfo,
} from "../services/boutiqueService";

function Parametres() {
  const boutique = getBoutiqueInfo();

  const [nom, setNom] = useState(boutique.nom);
  const [telephone, setTelephone] = useState(boutique.telephone);
  const [email, setEmail] = useState(boutique.email);
  const [adresse, setAdresse] = useState(boutique.adresse);

  // ==============================
  // APPARENCE
  // ==============================
  const [modeSombre, setModeSombre] = useState(() => {
    return localStorage.getItem("modeApparence") === "sombre";
  });

  // Appliquer le mode choisi
  useEffect(() => {
    if (modeSombre) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("modeApparence", "sombre");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("modeApparence", "clair");
    }
  }, [modeSombre]);

  const changerApparence = () => {
    setModeSombre((ancienneValeur) => !ancienneValeur);
  };

  // ==============================
  // SAUVEGARDE BOUTIQUE
  // ==============================
  const sauvegarder = () => {
    sauvegarderBoutiqueInfo({
      nom,
      telephone,
      email,
      adresse,
    });

    alert("✅ Informations de la boutique enregistrées !");
  };

  return (
    <div
      className="
        min-h-screen
        p-6
        bg-gray-50
        dark:bg-gray-950
        text-gray-900
        dark:text-white
        transition-colors
        duration-300
      "
    >

      {/* =========================
          EN-TÊTE
      ========================= */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          ⚙️ Paramètres
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Gérez les informations générales de votre boutique.
        </p>

      </div>


      {/* =========================
          APPARENCE
      ========================= */}
      <div
        className="
          bg-white
          dark:bg-gray-900
          rounded-2xl
          shadow-lg
          p-6
          max-w-3xl
          mb-6
          border
          border-gray-100
          dark:border-gray-800
          transition-colors
          duration-300
        "
      >

        <h2 className="text-2xl font-bold mb-2">
          🎨 Apparence
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Choisissez l'apparence de votre application.
        </p>


        {/* Bouton sombre / clair */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            p-4
            rounded-xl
            bg-gray-100
            dark:bg-gray-800
            transition-colors
            duration-300
          "
        >

          <div>

            <p className="font-semibold text-lg">
              {modeSombre
                ? "🌙 Mode sombre"
                : "☀️ Mode clair"}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {modeSombre
                ? "L'application utilise actuellement le thème sombre."
                : "L'application utilise actuellement le thème clair."}
            </p>

          </div>


          {/* SWITCH */}
          <button
            type="button"
            onClick={changerApparence}
            aria-label="Changer l'apparence"
            className={`
              relative
              w-24
              h-12
              rounded-full
              flex
              items-center
              transition-all
              duration-300
              shadow-inner
              flex-shrink-0
              ${
                modeSombre
                  ? "bg-purple-600"
                  : "bg-gray-400"
              }
            `}
          >

            {/* Petit texte */}
            <span
              className={`
                absolute
                text-xs
                font-bold
                text-white
                ${
                  modeSombre
                    ? "left-3"
                    : "right-3"
                }
              `}
            >
              {modeSombre ? "ON" : "OFF"}
            </span>


            {/* Rond */}
            <span
              className={`
                absolute
                w-9
                h-9
                bg-white
                rounded-full
                shadow-lg
                transition-all
                duration-300
                ${
                  modeSombre
                    ? "translate-x-12"
                    : "translate-x-1"
                }
              `}
            />

          </button>

        </div>

      </div>


      {/* =========================
          INFORMATIONS BOUTIQUE
      ========================= */}
      <div
        className="
          bg-white
          dark:bg-gray-900
          rounded-2xl
          shadow-lg
          p-6
          max-w-3xl
          border
          border-gray-100
          dark:border-gray-800
          transition-colors
          duration-300
        "
      >

        <h2 className="text-2xl font-bold mb-6">
          🏪 Informations de la boutique
        </h2>

        <div className="space-y-5">

          {/* Nom */}
          <div>
            <label className="block font-semibold mb-2">
              Nom de la boutique
            </label>

            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                rounded-lg
                p-3
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                outline-none
                focus:ring-2
                focus:ring-blue-500
                transition-colors
              "
              placeholder="Nom de la boutique"
            />
          </div>


          {/* Téléphone */}
          <div>
            <label className="block font-semibold mb-2">
              Téléphone
            </label>

            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                rounded-lg
                p-3
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                outline-none
                focus:ring-2
                focus:ring-blue-500
                transition-colors
              "
              placeholder="Ex : +243 000 000 000"
            />
          </div>


          {/* Email */}
          <div>
            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                rounded-lg
                p-3
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                outline-none
                focus:ring-2
                focus:ring-blue-500
                transition-colors
              "
              placeholder="Ex : contact@boutique.com"
            />
          </div>


          {/* Adresse */}
          <div>
            <label className="block font-semibold mb-2">
              Adresse
            </label>

            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              className="
                w-full
                border
                border-gray-300
                dark:border-gray-700
                rounded-lg
                p-3
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                outline-none
                focus:ring-2
                focus:ring-blue-500
                transition-colors
              "
              placeholder="Adresse de la boutique"
            />
          </div>


          {/* Bouton sauvegarder */}
          <div className="pt-3">

            <button
              type="button"
              onClick={sauvegarder}
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-6
                py-3
                rounded-lg
                font-semibold
                transition
                shadow
              "
            >
              💾 Enregistrer les informations
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Parametres;