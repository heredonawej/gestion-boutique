export interface Produit {
  id: number;
  nom: string;
  categorie: string;
  prix_achat: number;
  prix: number;
  stock: number;
  image?: string | null;
}