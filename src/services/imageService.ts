const API = "https://gestion-boutique-2qu3.onrender.com/api/produits";

// ==========================================
// TYPE PHOTO PRODUIT
// ==========================================

export interface ProduitImage {
  id: number;
  produit_id: number;
  image: string;
}

// ==========================================
// RÉCUPÉRER LES PHOTOS
// ==========================================

export async function getImagesProduit(
  produitId: number
): Promise<ProduitImage[]> {

  const response = await fetch(
    `${API}/${produitId}/images`
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de récupérer les photos."
    );
  }

  return response.json();
}

// ==========================================
// AJOUTER UNE PHOTO
// ==========================================

export async function ajouterImageProduit(
  produitId: number,
  fichier: File
) {

  const token =
    localStorage.getItem("token");

  const formData = new FormData();

  formData.append(
    "image",
    fichier
  );

  const response = await fetch(
    `${API}/${produitId}/images`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(
      "Impossible d'ajouter la photo."
    );
  }

  return response.json();
}

// ==========================================
// SUPPRIMER UNE PHOTO
// ==========================================

export async function supprimerImageProduit(
  produitId: number,
  imageId: number
) {

  const token =
    localStorage.getItem("token");

  const response = await fetch(
    `${API}/${produitId}/images/${imageId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      "Impossible de supprimer la photo."
    );
  }

  return response.json();
}