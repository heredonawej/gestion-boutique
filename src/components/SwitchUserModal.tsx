import { useState } from "react";
import API_URL from "../config";

interface Props {
  onClose: () => void;
}

function SwitchUserModal({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [chargement, setChargement] = useState(false);

  const changerUtilisateur = async () => {
    if (!email || !motDePasse) {
      alert("Veuillez saisir l'email et le mot de passe.");
      return;
    }

    try {
      setChargement(true);

      const response = await fetch(
  `${API_URL}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            motDePasse,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Identifiants incorrects.");
        return;
      }

      // Enregistrer le nouveau token
      localStorage.setItem(
        "token",
        data.token
      );

      // Enregistrer le nouvel utilisateur
      localStorage.setItem(
        "utilisateur",
        JSON.stringify(data.utilisateur)
      );

      alert("Utilisateur changé avec succès.");

      // Recharger l'application
      window.location.reload();

    } catch (error) {
      console.error(
        "Erreur changement utilisateur :",
        error
      );

      alert(
        "Impossible de contacter le serveur."
      );

    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]">

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

        {/* Titre */}

        <div className="text-center mb-6">

          <div className="text-4xl mb-3">
            🔄
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Changer d'utilisateur
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Connectez-vous avec un autre compte
          </p>

        </div>

        {/* Email */}

        <div className="mb-4">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Adresse e-mail
          </label>

          <input
            type="email"
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              p-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
            "
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

        </div>

        {/* Mot de passe */}

        <div className="mb-6">

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mot de passe
          </label>

          <input
            type="password"
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              p-3
              outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
            "
            placeholder="Votre mot de passe"
            value={motDePasse}
            onChange={(e) =>
              setMotDePasse(e.target.value)
            }
          />

        </div>

        {/* Boutons */}

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={chargement}
            className="
              px-5
              py-3
              rounded-xl
              bg-gray-200
              hover:bg-gray-300
              text-gray-700
              font-semibold
              transition
            "
          >
            Annuler
          </button>

          <button
            onClick={changerUtilisateur}
            disabled={chargement}
            className="
              px-5
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-semibold
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {chargement
              ? "Connexion..."
              : "Se connecter"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default SwitchUserModal;