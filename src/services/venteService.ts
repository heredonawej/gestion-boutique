import type { Vente } from "../types/Vente";

const API = "http://https://gestion-boutique-2qu3.onrender.com/api/ventes";

export async function enregistrerVente(
  produit_id: number,
  quantite: number,
  origine: "sur_place" | "en_ligne" = "sur_place"
) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      produit_id,
      quantite,
      origine,
    }),
  });

  if (!response.ok) {
    const erreur = await response.json();
    throw new Error(
      erreur.message || "Erreur lors de la vente."
    );
  }

  return response.json();
}

export async function getVentes(): Promise<Vente[]> {
  const response = await fetch(API);

  if (!response.ok) {
    throw new Error(
      "Impossible de récupérer les ventes."
    );
  }

  return response.json();
}