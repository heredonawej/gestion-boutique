const API = "http://https://gestion-boutique-2qu3.onrender.com/api/achats";

// Enregistrer un achat
export async function enregistrerAchat(
  fournisseur_id: number,
  produit_id: number,
  quantite: number,
  prix_achat: number
) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fournisseur_id,
      produit_id,
      quantite,
      prix_achat,
    }),
  });

  return response.json();
}

// Récupérer l'historique des achats
export async function getAchats() {
  const response = await fetch(API);

  if (!response.ok) {
    throw new Error("Impossible de récupérer les achats.");
  }

  return response.json();
}