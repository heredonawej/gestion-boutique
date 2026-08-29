import { useState } from "react";
import { ajouterFournisseur } from "../services/fournisseurService";

interface Props {
  onAjouter: () => void;
}

function FournisseurForm({ onAjouter }: Props) {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [adresse, setAdresse] = useState("");

  const ajouter = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await ajouterFournisseur({
      nom,
      telephone,
      email,
      adresse,
    });

    alert(data.message);

    setNom("");
    setTelephone("");
    setEmail("");
    setAdresse("");

    onAjouter();
  };

  return (
    <form
      onSubmit={ajouter}
      className="bg-white shadow rounded-xl p-6 mb-6 space-y-4"
    >
      <h2 className="text-2xl font-bold">
        Ajouter un fournisseur
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
        placeholder="Téléphone"
        value={telephone}
        onChange={(e) => setTelephone(e.target.value)}
      />

      <input
        type="email"
        className="w-full border rounded-lg p-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border rounded-lg p-3"
        placeholder="Adresse"
        value={adresse}
        onChange={(e) => setAdresse(e.target.value)}
      />

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
        Ajouter
      </button>
    </form>
  );
}

export default FournisseurForm;