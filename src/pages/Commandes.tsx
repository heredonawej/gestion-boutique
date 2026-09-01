import { useEffect, useState } from "react";

import {
  getCommandes,
  getCommandeById,
  modifierStatutCommande,
} from "../services/commandeService";

import type {
  Commande,
  CommandeDetailResponse,
} from "../services/commandeService";

import { genererBonCommande } from "../services/factureService";

function Commandes() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [chargement, setChargement] = useState(true);

  const [commandeSelectionnee, setCommandeSelectionnee] =
    useState<CommandeDetailResponse | null>(null);

  const [chargementDetail, setChargementDetail] =
    useState(false);

  const chargerCommandes = async () => {
    try {
      setChargement(true);

      const data = await getCommandes();

      setCommandes(data);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerCommandes();
  }, []);

  // ==========================================
  // AFFICHER LE DÉTAIL
  // ==========================================

  const voirCommande = async (id: number) => {
    try {
      setChargementDetail(true);

      const data = await getCommandeById(id);

      setCommandeSelectionnee(data);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setChargementDetail(false);
    }
  };

  // ==========================================
  // FERMER LE DÉTAIL
  // ==========================================

  const fermerDetail = () => {
    setCommandeSelectionnee(null);
  };

  const imprimerCommande = () => {
  if (!commandeSelectionnee) {
    return;
  }

  genererBonCommande({
    id: commandeSelectionnee.commande.id,

    nom_client:
      commandeSelectionnee.commande.nom_client,

    telephone:
      commandeSelectionnee.commande.telephone,

    adresse:
      commandeSelectionnee.commande.adresse,

    commentaire:
      commandeSelectionnee.commande.commentaire,

    total:
      Number(
        commandeSelectionnee.commande.total
      ),

    statut:
      commandeSelectionnee.commande.statut,

    date_commande:
      commandeSelectionnee.commande.date_commande,

    produits:
      commandeSelectionnee.produits.map(
        (produit) => ({
          nom: produit.nom,

          quantite:
            Number(produit.quantite),

          prix:
            Number(produit.prix),

          sous_total:
            Number(produit.sous_total),
        })
      ),
  });
};

  // ==========================================
  // MODIFIER LE STATUT
  // ==========================================

  const changerStatut = async (
    id: number,
    statut: string
  ) => {
    try {
      const data = await modifierStatutCommande(
        id,
        statut
      );

      alert(data.message);

      await chargerCommandes();

      // Actualiser également le détail
      if (
        commandeSelectionnee &&
        commandeSelectionnee.commande.id === id
      ) {
        const detail = await getCommandeById(id);

        setCommandeSelectionnee(detail);
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  // ==========================================
  // AFFICHER LE STATUT
  // ==========================================

  const afficherStatut = (statut: string) => {
    switch (statut) {
      case "en_attente":
        return "🟡 En attente";

      case "confirmee":
        return "🔵 Confirmée";

      case "preparation":
        return "🟣 En préparation";

      case "prete":
        return "🟢 Prête";

      case "livree":
        return "✅ Livrée";

      case "annulee":
        return "🔴 Annulée";

      default:
        return statut;
    }
  };

  // ==========================================
  // CHARGEMENT
  // ==========================================

  if (chargement) {
    return (
      <div className="flex justify-center items-center p-10">
        <p className="text-gray-500 text-lg">
          ⏳ Chargement des commandes...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

      {/* ======================================
          EN-TÊTE
      ====================================== */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            📋 Commandes clients
          </h1>

          <p className="text-gray-500 mt-1">
            Gestion des commandes passées par les clients.
          </p>
        </div>

        <button
          onClick={chargerCommandes}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
        >
          🔄 Actualiser
        </button>

      </div>

      {/* ======================================
          STATISTIQUES
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Total commandes
          </p>

          <p className="text-3xl font-bold mt-2">
            {commandes.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            En attente
          </p>

          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {
              commandes.filter(
                (commande) =>
                  commande.statut === "en_attente"
              ).length
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500">
            Livrées
          </p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {
              commandes.filter(
                (commande) =>
                  commande.statut === "livree"
              ).length
            }
          </p>
        </div>

      </div>

      {/* ======================================
          TABLE COMMANDES
      ====================================== */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        {commandes.length === 0 ? (

          <div className="p-10 text-center">

            <div className="text-5xl mb-4">
              📭
            </div>

            <p className="text-gray-500">
              Aucune commande pour le moment.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-800 text-white">

                <tr>

                  <th className="text-left p-4">
                    N°
                  </th>

                  <th className="text-left p-4">
                    Client
                  </th>

                  <th className="text-left p-4">
                    Téléphone
                  </th>

                  <th className="text-left p-4">
                    Total
                  </th>

                  <th className="text-left p-4">
                    Statut
                  </th>

                  <th className="text-left p-4">
                    Date
                  </th>

                  <th className="text-left p-4">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {commandes.map((commande) => (

                  <tr
                    key={commande.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="p-4 font-bold">
                      #{commande.id}
                    </td>

                    <td className="p-4">

                      <p className="font-semibold">
                        {commande.nom_client}
                      </p>

                      <p className="text-sm text-gray-500">
                        {commande.adresse}
                      </p>

                    </td>

                    <td className="p-4">
                      {commande.telephone}
                    </td>

                    <td className="p-4 font-bold">
                      {Number(
                        commande.total
                      ).toLocaleString()} FC
                    </td>

                    <td className="p-4">
                      {afficherStatut(
                        commande.statut
                      )}
                    </td>

                    <td className="p-4 text-sm text-gray-500">
                      {new Date(
                        commande.date_commande
                      ).toLocaleString()}
                    </td>

                    <td className="p-4">

                      <div className="flex flex-col gap-2">

                        {/* Voir */}
                        <button
                          onClick={() =>
                            voirCommande(
                              commande.id
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg"
                        >
                          👁️ Voir
                        </button>

                        {/* Statut */}
                        <select
                          value={commande.statut}
                          onChange={(e) =>
                            changerStatut(
                              commande.id,
                              e.target.value
                            )
                          }
                          className="border rounded-lg p-2"
                        >

                          <option value="en_attente">
                            🟡 En attente
                          </option>

                          <option value="confirmee">
                            🔵 Confirmée
                          </option>

                          <option value="preparation">
                            🟣 En préparation
                          </option>

                          <option value="prete">
                            🟢 Prête
                          </option>

                          <option value="livree">
                            ✅ Livrée
                          </option>

                          <option value="annulee">
                            🔴 Annulée
                          </option>

                        </select>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ======================================
          MODAL DÉTAIL
      ====================================== */}

      {commandeSelectionnee && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            {/* Header modal */}
            <div className="bg-slate-800 text-white p-6 flex justify-between items-center">

              <div>
                <h2 className="text-2xl font-bold">
                  📋 Commande #
                  {commandeSelectionnee.commande.id}
                </h2>

                <p className="text-slate-300 mt-1">
                  {afficherStatut(
                    commandeSelectionnee.commande.statut
                  )}
                </p>
              </div>

              <button
                onClick={fermerDetail}
                className="text-2xl hover:text-red-400"
              >
                ✕
              </button>

            </div>

            <div className="p-6">

              {/* Informations client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

                <div className="bg-gray-50 rounded-xl p-5">

                  <h3 className="font-bold text-lg mb-3">
                    👤 Informations client
                  </h3>

                  <p>
                    <strong>Nom :</strong>{" "}
                    {commandeSelectionnee.commande.nom_client}
                  </p>

                  <p className="mt-2">
                    <strong>Téléphone :</strong>{" "}
                    {commandeSelectionnee.commande.telephone}
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-5">

                  <h3 className="font-bold text-lg mb-3">
                    📍 Livraison
                  </h3>

                  <p>
                    {commandeSelectionnee.commande.adresse}
                  </p>

                </div>

              </div>

              {/* Commentaire */}
              {commandeSelectionnee.commande.commentaire && (

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">

                  <h3 className="font-bold mb-1">
                    📝 Commentaire
                  </h3>

                  <p>
                    {commandeSelectionnee.commande.commentaire}
                  </p>

                </div>

              )}

              {/* Produits */}
              <h3 className="text-xl font-bold mb-4">
                🛍️ Produits commandés
              </h3>

              <div className="space-y-3">

                {commandeSelectionnee.produits.map(
                  (produit) => (

                    <div
                      key={produit.id}
                      className="border rounded-xl p-4 flex items-center gap-4"
                    >

                      {produit.image ? (

  <img
    src={`${
      import.meta.env.PROD
        ? "https://gestion-boutique-2qu3.onrender.com"
        : "http://localhost:3001"
    }/uploads/${produit.image}`}
    alt={produit.nom}
    className="w-20 h-20 object-cover rounded-lg"
  />

) : (

  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
    📦
  </div>

)}

                      <div className="flex-1">

                        <p className="font-bold">
                          {produit.nom}
                        </p>

                        <p className="text-sm text-gray-500">
                          {produit.categorie}
                        </p>

                        <p className="text-sm mt-1">
                          {Number(
                            produit.prix
                          ).toLocaleString()} FC ×{" "}
                          {produit.quantite}
                        </p>

                      </div>

                      <div className="font-bold">
                        {Number(
                          produit.sous_total
                        ).toLocaleString()} FC
                      </div>

                    </div>

                  )
                )}

              </div>

              {/* Total */}
              <div className="border-t mt-6 pt-5 flex justify-between items-center">

                <span className="text-xl font-bold">
                  TOTAL
                </span>

                <span className="text-2xl font-bold text-blue-600">
                  {Number(
                    commandeSelectionnee.commande.total
                  ).toLocaleString()} FC
                </span>

              </div>

              {/* Date */}
              <p className="text-sm text-gray-500 mt-4">
                📅 Commande passée le{" "}
                {new Date(
                  commandeSelectionnee.commande.date_commande
                ).toLocaleString()}
              </p>

            </div>

            {/* Footer */}
            <div className="border-t p-5 flex justify-between gap-3">

  <button
    onClick={imprimerCommande}
    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
  >
    🖨️ Imprimer le bon
  </button>

  <button
    onClick={fermerDetail}
    className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
  >
    Fermer
  </button>

</div>

          </div>

        </div>

      )}

      {/* Chargement détail */}
      {chargementDetail && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">

          <div className="bg-white rounded-xl p-6 shadow-xl">
            ⏳ Chargement du détail...
          </div>

        </div>

      )}

    </div>
  );
}

export default Commandes;