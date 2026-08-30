const API = "https://gestion-boutique-2qu3.onrender.com/api/commandes";

// ==========================================
// TYPES
// ==========================================

export interface ArticleCommande {
  produit_id: number;
  quantite: number;
}

export interface CommandeData {
  nom_client: string;
  telephone: string;
  adresse: string;
  commentaire?: string;
  produits: ArticleCommande[];
  total: number;
}

export interface Commande {
  id: number;
  nom_client: string;
  telephone: string;
  adresse: string;
  commentaire: string;
  total: number;
  statut: string;
  date_commande: string;
}

// ==========================================
// CRÉER UNE COMMANDE
// ==========================================

export async function creerCommande(
  commande: CommandeData
) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commande),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Erreur lors de la commande."
    );
  }

  return data;
}

// ==========================================
// RÉCUPÉRER LES COMMANDES
// ==========================================

export async function getCommandes(): Promise<Commande[]> {
  const response = await fetch(API);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération des commandes."
    );
  }

  return data;
}

// ==========================================
// MODIFIER LE STATUT
// ==========================================

export async function modifierStatutCommande(
  id: number,
  statut: string
) {
  const response = await fetch(
    `${API}/${id}/statut`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        statut,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la modification du statut."
    );
  }

  return data;
}

// ==========================================
// RÉCUPÉRER LE DÉTAIL D'UNE COMMANDE
// ==========================================

export async function getCommandeById(
  id: number
) {
  const response = await fetch(`${API}/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération de la commande."
    );
  }

  return data;
}

export interface DetailCommande {
  id: number;
  produit_id: number;
  quantite: number;
  prix: number;
  sous_total: number;
  nom: string;
  categorie: string;
  image?: string;
}

export interface CommandeDetailResponse {
  commande: Commande;
  produits: DetailCommande[];
}