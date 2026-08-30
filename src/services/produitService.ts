import type { Produit } from "../types/Produit";

const API = "https://gestion-boutique-2qu3.onrender.com/api/produits";

// Récupérer tous les produits
export async function getProduits(): Promise<Produit[]> {
  const response = await fetch(API);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des produits.");
  }

  return response.json();
}

// Ajouter un produit avec image
export async function ajouterProduit(
  formData: FormData
) {
  const token = localStorage.getItem("token");

  const response = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
}

// Modifier un produit
export async function modifierProduit(
  produit: Produit
) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/${produit.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(produit),
  });

  return response.json();
}

// Supprimer un produit
export async function supprimerProduit(id: number) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Impossible de supprimer le produit."
    );
  }

  return data;
}