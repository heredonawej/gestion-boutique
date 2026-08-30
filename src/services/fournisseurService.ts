import type { Fournisseur } from "../types/Fournisseur";

const API = "https://gestion-boutique-2qu3.onrender.com/api/fournisseurs";

export async function getFournisseurs(): Promise<Fournisseur[]> {
  const response = await fetch(API);
  return response.json();
}

export async function ajouterFournisseur(
  fournisseur: Omit<Fournisseur, "id">
) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fournisseur),
  });

  return response.json();
}

export async function supprimerFournisseur(id: number) {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  return response.json();
}