import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (utilisateurEnEdition) {
      setNom(utilisateurEnEdition.nom);
      setEmail(utilisateurEnEdition.email);
      setRole(utilisateurEnEdition.role);
      setMotDePasse("");
    }
  }, [utilisateurEnEdition]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let response;

    if (utilisateurEnEdition) {
      response = await fetch(
        `http://https://gestion-boutique-2qu3.onrender.com/api/utilisateurs/${utilisateurEnEdition.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom,
            email,
            role,
          }),
        }
      );
    } else {
      response = await fetch(
        "http://https://gestion-boutique-2qu3.onrender.com/api/utilisateurs",
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

    alert(data.message);

    setNom("");
    setEmail("");
    setMotDePasse("");
    setRole("caissier");

    if (onAnnulerEdition) {
      onAnnulerEdition();
    }

    onAjouter();
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

      <input
        className="w-full border rounded-lg p-3"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />

      <input
        className="w-full border rounded-lg p-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {!utilisateurEnEdition && (
        <input
          type="password"
          className="w-full border rounded-lg p-3"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
      )}

      <select
        className="w-full border rounded-lg p-3"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="admin">Admin</option>
        <option value="caissier">Caissier</option>
      </select>

      <div className="flex gap-3">

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          {utilisateurEnEdition ? "Modifier" : "Ajouter"}
        </button>

        {utilisateurEnEdition && (
          <button
            type="button"
            onClick={onAnnulerEdition}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
          >
            Annuler
          </button>
        )}

      </div>

    </form>
  );
}

export default UserForm;