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

  useEffect(() => {
    const html = document.documentElement;

    if (modeSombre) {
      html.classList.add("dark");
      localStorage.setItem("modeApparence", "sombre");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("modeApparence", "clair");
    }
  }, [modeSombre]);

  const changerApparence = () => {
    setModeSombre((ancienneValeur) => !ancienneValeur);
  };

  // ==============================
  // SAUVEGARDE
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
      {/* ==============================
          TITRE
      ============================== */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          ⚙️ Paramètres
        </h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Gérez les informations générales de votre boutique.
        </p>
      </div>

      {/* ==============================
          APPARENCE
      ============================== */}

      <div
        className="
          max-w-3xl
          mb-6
          p-6
          rounded-2xl
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          shadow-lg
          transition-colors
          duration-300
        "
      >
        <h2 className="text-2xl font-bold mb-2">
          🎨 Apparence
        </h2>

        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Choisissez l'apparence de votre application.
        </p>

        {/* CONTENEUR DU SWITCH */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-5
            p-5
            rounded-2xl
            bg-gray-100
            dark:bg-gray-800
            border
            border-gray-200
            dark:border-gray-700
            transition-colors
            duration-300
          "
        >
          <div>
            <p className="text-lg font-bold">
              {modeSombre
                ? "🌙 Mode sombre"
                : "☀️ Mode clair"}
            </p>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {modeSombre
                ? "Le thème sombre est actuellement activé."
                : "Le thème clair est actuellement activé."}
            </p>
          </div>

          {/* ==============================
              SWITCH
          ============================== */}

          <button
            type="button"
            onClick={changerApparence}
            aria-label="Changer le mode d'apparence"
            aria-pressed={modeSombre}
            className={`
              relative
              w-20
              h-10
              rounded-full
              flex
              items-center
              flex-shrink-0
              shadow-inner
              transition-all
              duration-300
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              ${
                modeSombre
                  ? "bg-blue-600"
                  : "bg-gray-400"
              }
            `}
          >
            {/* TEXTE */}

            <span
              className={`
                absolute
                text-[10px]
                font-bold
                text-white
                ${
                  modeSombre
                    ? "left-2.5"
                    : "right-2.5"
                }
              `}
            >
              {modeSombre ? "ON" : "OFF"}
            </span>

            {/* CERCLE */}

            <span
              className={`
                absolute
                top-1
                left-1
                w-8
                h-8
                rounded-full
                bg-white
                shadow-md
                transition-transform
                duration-300
                ${
                  modeSombre
                    ? "translate-x-10"
                    : "translate-x-0"
                }
              `}
            >
              <span className="flex items-center justify-center w-full h-full text-sm">
                {modeSombre ? "🌙" : "☀️"}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* ==============================
          INFORMATIONS BOUTIQUE
      ============================== */}

      <div
        className="
          max-w-3xl
          p-6
          rounded-2xl
          bg-white
          dark:bg-gray-900
          border
          border-gray-200
          dark:border-gray-800
          shadow-lg
          transition-colors
          duration-300
        "
      >
        <h2 className="text-2xl font-bold mb-6">
          🏪 Informations de la boutique
        </h2>

        <div className="space-y-5">
          {/* NOM */}

          <div>
            <label className="block mb-2 font-semibold">
              Nom de la boutique
            </label>

            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom de la boutique"
              className="
                w-full
                p-3
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder-gray-400
                outline-none
                focus:ring-2
                focus:ring-blue-500
                transition-colors
              "
            />
          </div>

          {/* TELEPHONE */}

          <div>
            <label className="block mb-2 font-semibold">
              Téléphone
            </label>

            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Ex : +243 000 000 000"
              className="
                w-full
                p-3
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder-gray-400
                outline-none
                focus:ring-2
                focus:ring-blue-500
                transition-colors
              "
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="block mb-2 font-semibold">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex : contact@boutique.com"
              className="
                w-full
                p-3
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder-gray-400
                outline-none
                focus:ring-2
                focus:ring-blue-500
                transition-colors
              "
            />
          </div>

          {/* ADRESSE */}

          <div>
            <label className="block mb-2 font-semibold">
              Adresse
            </label>

            <input
              type="text"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              placeholder="Adresse de la boutique"
              className="
                w-full
                p-3
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-white
                dark:bg-gray-800
                text-gray-900
                dark:text-white
                placeholder-gray-400
                outline-none
                focus:ring-2
                focus:ring-blue-500
                transition-colors
              "
            />
          </div>

          {/* BOUTON */}

          <div className="pt-3">
            <button
              type="button"
              onClick={sauvegarder}
              className="
                px-6
                py-3
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-semibold
                shadow-md
                transition-all
                duration-200
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