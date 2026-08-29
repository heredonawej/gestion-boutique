export interface Vente {
  id: number;
  nom: string;
  quantite: number;
  montant: number;
  date_vente: string;
  origine: "sur_place" | "en_ligne";
}