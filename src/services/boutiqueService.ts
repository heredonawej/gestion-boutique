export interface BoutiqueInfo {
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
}

const CLE = "boutiqueInfo";

export function getBoutiqueInfo(): BoutiqueInfo {
  const donnees = localStorage.getItem(CLE);

  if (donnees) {
    return JSON.parse(donnees);
  }

  return {
    nom: "Boutique Héritier",
    telephone: "",
    email: "",
    adresse: "",
  };
}

export function sauvegarderBoutiqueInfo(
  info: BoutiqueInfo
) {
  localStorage.setItem(
    CLE,
    JSON.stringify(info)
  );
}