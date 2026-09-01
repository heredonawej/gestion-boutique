import { useState } from "react";

import {
  getCommandeById,
} from "../services/commandeService";

import {
  getNotifications,
} from "../services/notificationService";

import type {
  CommandeDetailResponse,
} from "../services/commandeService";

import type {
  Notification,
} from "../services/notificationService";

const SERVER_URL = import.meta.env.PROD
  ? "https://gestion-boutique-2qu3.onrender.com"
  : "http://localhost:3001";

function SuiviCommande() {

  const [numeroCommande, setNumeroCommande] =
    useState("");

  const [commande, setCommande] =
    useState<CommandeDetailResponse | null>(null);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [chargement, setChargement] =
    useState(false);

  const [erreur, setErreur] =
    useState("");

  // ==========================================
  // RECHERCHER LA COMMANDE
  // ==========================================

  const rechercherCommande = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setErreur("");
    setCommande(null);
    setNotifications([]);

    const id = Number(
      numeroCommande
        .replace("#", "")
        .trim()
    );

    if (!id || id <= 0) {

      setErreur(
        "Veuillez entrer un numéro de commande valide."
      );

      return;
    }

    try {

      setChargement(true);

      // Récupérer la commande
      const data =
        await getCommandeById(id);

      setCommande(data);

      // Récupérer les notifications
      const notificationsData =
        await getNotifications(id);

      setNotifications(
        notificationsData
      );

    } catch (error) {

      console.error(error);

      if (error instanceof Error) {

        setErreur(error.message);

      } else {

        setErreur(
          "Commande introuvable."
        );
      }

    } finally {

      setChargement(false);

    }
  };

  // ==========================================
  // NOTIFICATION SELON LE STATUT
  // ==========================================

  const obtenirNotificationStatut = (
    statut: string
  ) => {

    switch (statut) {

      case "en_attente":

        return {
          icon: "🟡",
          titre: "Commande reçue",
          couleur:
            "bg-yellow-50 border-yellow-200 text-yellow-700",
        };

      case "confirmee":

        return {
          icon: "🔵",
          titre: "Commande confirmée",
          couleur:
            "bg-blue-50 border-blue-200 text-blue-700",
        };

      case "preparation":

        return {
          icon: "📦",
          titre: "Commande en préparation",
          couleur:
            "bg-orange-50 border-orange-200 text-orange-700",
        };

      case "prete":

        return {
          icon: "🟢",
          titre: "Commande prête",
          couleur:
            "bg-green-50 border-green-200 text-green-700",
        };

      case "livree":

        return {
          icon: "🎉",
          titre: "Commande livrée",
          couleur:
            "bg-green-50 border-green-200 text-green-700",
        };

      case "annulee":

        return {
          icon: "🔴",
          titre: "Commande annulée",
          couleur:
            "bg-red-50 border-red-200 text-red-700",
        };

      default:

        return {
          icon: "🔔",
          titre: "Notification",
          couleur:
            "bg-gray-50 border-gray-200 text-gray-700",
        };
    }
  };

  const etapes = [
    {
      statut: "en_attente",
      titre: "Commande reçue",
      description:
        "Votre commande a bien été enregistrée.",
      icon: "📥",
    },

    {
      statut: "confirmee",
      titre: "Commande confirmée",
      description:
        "La boutique a confirmé votre commande.",
      icon: "🔵",
    },

    {
      statut: "preparation",
      titre: "En préparation",
      description:
        "Votre commande est en cours de préparation.",
      icon: "📦",
    },

    {
      statut: "prete",
      titre: "Commande prête",
      description:
        "Votre commande est prête à être livrée.",
      icon: "🟢",
    },

    {
      statut: "livree",
      titre: "Commande livrée",
      description:
        "Votre commande a été livrée avec succès.",
      icon: "✅",
    },
  ];

  const statutActuel =
    commande?.commande.statut;

  const indexStatut =
    etapes.findIndex(
      (etape) =>
        etape.statut === statutActuel
    );

  return (

    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <header className="bg-slate-900 text-white px-6 py-5">

        <div className="max-w-5xl mx-auto">

          <h1 className="text-2xl md:text-3xl font-bold">
            🔎 Suivre ma commande
          </h1>

          <p className="text-slate-300 mt-1">
            Consultez l'état de votre commande.
          </p>

        </div>

      </header>

      <main className="max-w-5xl mx-auto p-6">

        {/* RECHERCHE */}

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <h2 className="text-xl font-bold mb-4">
            Numéro de commande
          </h2>

          <form
            onSubmit={rechercherCommande}
            className="flex flex-col md:flex-row gap-3"
          >

            <input
              type="text"
              value={numeroCommande}
              onChange={(e) =>
                setNumeroCommande(
                  e.target.value
                )
              }
              placeholder="Ex : 12 ou #12"
              className="flex-1 border rounded-lg p-3"
            />

            <button
              type="submit"
              disabled={chargement}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
            >

              {chargement
                ? "⏳ Recherche..."
                : "🔍 Rechercher"}

            </button>

          </form>

          {erreur && (

            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">

              ❌ {erreur}

            </div>

          )}

        </div>

        {/* RESULTAT */}

        {commande && (

          <div className="space-y-6">

            {/* ==================================
                🔔 NOTIFICATIONS
            ================================== */}

            {notifications.length > 0 && (

              <div className="bg-white rounded-2xl shadow p-6">

                <div className="flex items-center justify-between mb-5">

                  <h2 className="text-2xl font-bold">
                    🔔 Notifications
                  </h2>

                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">

                    {notifications.length}

                  </span>

                </div>

                <div className="space-y-3">

                  {notifications.map(
                    (notification) => {

                      const style =
                        obtenirNotificationStatut(
                          notification.statut
                        );

                      return (

                        <div
                          key={notification.id}
                          className={`border rounded-xl p-4 ${style.couleur}`}
                        >

                          <div className="flex gap-3">

                            <div className="text-2xl">
                              {style.icon}
                            </div>

                            <div className="flex-1">

                              <h3 className="font-bold">
                                {style.titre}
                              </h3>

                              <p className="mt-1">
                                {notification.message}
                              </p>

                              <p className="text-xs mt-2 opacity-70">

                                {new Date(
                                  notification.date_notification
                                ).toLocaleString()}

                              </p>

                            </div>

                          </div>

                        </div>

                      );
                    }
                  )}

                </div>

              </div>

            )}

            {/* ==================================
                INFORMATIONS COMMANDE
            ================================== */}

            <div className="bg-white rounded-2xl shadow p-6">

              <div className="flex flex-col md:flex-row md:justify-between gap-4">

                <div>

                  <p className="text-gray-500">
                    Numéro de commande
                  </p>

                  <h2 className="text-3xl font-bold">
                    #{commande.commande.id}
                  </h2>

                </div>

                <div className="text-left md:text-right">

                  <p className="text-gray-500">
                    Client
                  </p>

                  <p className="font-bold text-lg">
                    {commande.commande.nom_client}
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-gray-500 text-sm">
                    📱 Téléphone
                  </p>

                  <p className="font-semibold mt-1">
                    {commande.commande.telephone}
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-gray-500 text-sm">
                    📍 Adresse
                  </p>

                  <p className="font-semibold mt-1">
                    {commande.commande.adresse}
                  </p>

                </div>

                <div className="bg-gray-50 rounded-xl p-4">

                  <p className="text-gray-500 text-sm">
                    💰 Total
                  </p>

                  <p className="font-bold text-blue-600 text-lg mt-1">

                    {Number(
                      commande.commande.total
                    ).toLocaleString()} FC

                  </p>

                </div>

              </div>

            </div>

            {/* ==================================
                SUIVI
            ================================== */}

            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-2xl font-bold mb-8">
                📦 Suivi de votre commande
              </h2>

              <div className="space-y-6">

                {etapes.map(
                  (etape, index) => {

                    const termine =
                      index <= indexStatut;

                    const actuel =
                      etape.statut ===
                      statutActuel;

                    return (

                      <div
                        key={etape.statut}
                        className="flex gap-4"
                      >

                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                            termine
                              ? "bg-green-100"
                              : "bg-gray-100"
                          }`}
                        >
                          {etape.icon}
                        </div>

                        <div className="flex-1">

                          <div className="flex flex-col md:flex-row md:items-center gap-2">

                            <h3
                              className={`font-bold text-lg ${
                                termine
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {etape.titre}
                            </h3>

                            {actuel && (

                              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm w-fit">

                                Statut actuel

                              </span>

                            )}

                          </div>

                          <p
                            className={`mt-1 ${
                              termine
                                ? "text-gray-600"
                                : "text-gray-400"
                            }`}
                          >
                            {etape.description}
                          </p>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

              {/* COMMANDE ANNULEE */}

              {statutActuel ===
                "annulee" && (

                <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">

                  <h3 className="font-bold text-lg">
                    🔴 Commande annulée
                  </h3>

                  <p className="mt-1">
                    Cette commande a été annulée
                    par la boutique.
                  </p>

                </div>

              )}

            </div>

            {/* ==================================
                PRODUITS
            ================================== */}

            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-2xl font-bold mb-5">
                🛍️ Produits commandés
              </h2>

              <div className="space-y-3">

                {commande.produits.map(
                  (produit) => (

                    <div
                      key={produit.id}
                      className="border rounded-xl p-4 flex items-center gap-4"
                    >

                      {produit.image ? (

                        <img
  src={`${SERVER_URL}/uploads/${produit.image}`}
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

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default SuiviCommande;