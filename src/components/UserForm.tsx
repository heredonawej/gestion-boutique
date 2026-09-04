import { useEffect, useState } from "react";
import API_URL from "../config";

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role: string;
}

interface Props {
  onAjouter: () => void;
  utilisateurEnEdition?: Utilisateur | null;
  onAnnulerEdition?: () => void;
}

function UserForm({
  onAjouter,
  utilisateurEnEdition,
  onAnnulerEdition,
}: Props) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [role, setRole] = useState("caissier");
  const [chargement, setChargement] = useState(false);

  // ==========================================
  // CHARGER L'UTILISATEUR EN MODIFICATION
  // ==========================================

  useEffect(() => {
    if (utilisateurEnEdition) {
      setNom(utilisateurEnEdition.nom);
      setEmail(utilisateurEnEdition.email);
      setRole(utilisateurEnEdition.role);
      setMotDePasse("");
    } else {
      setNom("");
      setEmail("");
      setMotDePasse("");
      setRole("caissier");
    }
  }, [utilisateurEnEdition]);

  // ==========================================
  // ENREGISTRER
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!nom.trim() || !email.trim()) {
      alert("Veuillez remplir le nom et l'email.");
      return;
    }

    // Lors de l'ajout, mot de passe obligatoire
    if (!utilisateurEnEdition && !motDePasse.trim()) {
      alert("Veuillez saisir un mot de passe.");
      return;
    }

    try {
      setChargement(true);

      let response: Response;

      // ======================================
      // MODIFICATION
      // ======================================

      if (utilisateurEnEdition) {
        response = await fetch(
          `${API_URL}/api/utilisateurs/${utilisateurEnEdition.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nom,
              email,
              role,
              // Le mot de passe est envoyé seulement
              // s'il a été renseigné.
              ...(motDePasse.trim()
                ? { motDePasse }
                : {}),
            }),
          }
        );
      }

      // ======================================
      // AJOUT
      // ======================================

      else {
        response = await fetch(
          `${API_URL}/api/utilisateurs`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              nom,
              email,
              motDePasse,
              role,
            }),
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Erreur lors de l'enregistrement."
        );
      }

      alert(
        data.message ||
          "Utilisateur enregistré avec succès."
      );

      // ======================================
      // RÉINITIALISER
      // ======================================

      setNom("");
      setEmail("");
      setMotDePasse("");
      setRole("caissier");

      if (onAnnulerEdition) {
        onAnnulerEdition();
      }

      onAjouter();

    } catch (error) {
      console.error(
        "Erreur utilisateur :",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );

    } finally {
      setChargement(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow rounded-xl p-6 mb-6 space-y-4"
    >

      <h2 className="text-2xl font-bold">
        {utilisateurEnEdition
          ? "Modifier un utilisateur"
          : "Ajouter un utilisateur"}
      </h2>

      {/* NOM */}

      <input
        className="w-full border rounded-lg p-3"
        placeholder="Nom"
        value={nom}
        onChange={(e) =>
          setNom(e.target.value)
        }
        required
      />

      {/* EMAIL */}

      <input
        type="email"
        className="w-full border rounded-lg p-3"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        required
      />

      {/* MOT DE PASSE */}

      <div>
        <input
          type="password"
          className="w-full border rounded-lg p-3"
          placeholder={
            utilisateurEnEdition
              ? "Nouveau mot de passe (facultatif)"
              : "Mot de passe"
          }
          value={motDePasse}
          onChange={(e) =>
            setMotDePasse(e.target.value)
          }
          required={!utilisateurEnEdition}
        />

        {utilisateurEnEdition && (
          <p className="text-xs text-gray-500 mt-1">
            Laissez vide pour conserver l'ancien
            mot de passe.
          </p>
        )}
      </div>

      {/* ROLE */}

      <select
        className="w-full border rounded-lg p-3"
        value={role}
        onChange={(e) =>
          setRole(e.target.value)
        }
      >
        <option value="admin">
          Admin
        </option>

        <option value="caissier">
          Caissier
        </option>
      </select>

      {/* BOUTONS */}

      <div className="flex gap-3">

        <button
          type="submit"
          disabled={chargement}
          className="
            bg-blue-600
            hover:bg-blue-700
            disabled:bg-gray-400
            text-white
            px-6
            py-3
            rounded-lg
            font-semibold
          "
        >
          {chargement
            ? "Enregistrement..."
            : utilisateurEnEdition
            ? "Modifier"
            : "Ajouter"}
        </button>

        {utilisateurEnEdition && (
          <button
            type="button"
            onClick={onAnnulerEdition}
            disabled={chargement}
            className="
              bg-gray-500
              hover:bg-gray-600
              text-white
              px-6
              py-3
              rounded-lg
            "
          >
            Annuler
          </button>
        )}

      </div>

    </form>
  );
}

export default UserForm;