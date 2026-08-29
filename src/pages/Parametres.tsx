import { useState } from "react";
import {
  getBoutiqueInfo,
  sauvegarderBoutiqueInfo,
} from "../services/boutiqueService";

function Parametres() {
  const boutique = getBoutiqueInfo();

  const [nom, setNom] = useState(boutique.nom);
  const [telephone, setTelephone] = useState(
    boutique.telephone
  );
  const [email, setEmail] = useState(boutique.email);
  const [adresse, setAdresse] = useState(
    boutique.adresse
  );

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
    <div className="p-6">

      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          ⚙️ Paramètres
        </h1>

        <p className="text-gray-500 mt-2">
          Gérez les informations générales de votre boutique.
        </p>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl">

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
              className="w-full border rounded-lg p-3"
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
              onChange={(e) =>
                setTelephone(e.target.value)
              }
              className="w-full border rounded-lg p-3"
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
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-lg p-3"
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
              onChange={(e) =>
                setAdresse(e.target.value)
              }
              className="w-full border rounded-lg p-3"
              placeholder="Adresse de la boutique"
            />
          </div>

          {/* Bouton */}
          <div className="pt-3">

            <button
              type="button"
              onClick={sauvegarder}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
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