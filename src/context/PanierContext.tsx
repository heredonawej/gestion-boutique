import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Produit } from "../types/Produit";

export interface ArticlePanier {
  produit: Produit;
  quantite: number;
}

interface PanierContextType {
  panier: ArticlePanier[];
  ajouterAuPanier: (produit: Produit) => void;
  augmenterQuantite: (produitId: number) => void;
  diminuerQuantite: (produitId: number) => void;
  supprimerDuPanier: (produitId: number) => void;
  viderPanier: () => void;
  total: number;
  nombreArticles: number;
}

const PanierContext = createContext<
  PanierContextType | undefined
>(undefined);

export function PanierProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [panier, setPanier] = useState<ArticlePanier[]>(() => {
    const sauvegarde = localStorage.getItem("panier");

    if (!sauvegarde) {
      return [];
    }

    try {
      return JSON.parse(sauvegarde);
    } catch {
      return [];
    }
  });

  // Sauvegarder le panier
  useEffect(() => {
    localStorage.setItem(
      "panier",
      JSON.stringify(panier)
    );
  }, [panier]);

  // Ajouter un produit
  const ajouterAuPanier = (produit: Produit) => {
    setPanier((ancienPanier) => {
      const articleExiste = ancienPanier.find(
        (article) =>
          article.produit.id === produit.id
      );

      if (articleExiste) {
        if (
          articleExiste.quantite >=
          produit.stock
        ) {
          alert(
            "Vous avez atteint la quantité disponible en stock."
          );

          return ancienPanier;
        }

        return ancienPanier.map((article) =>
          article.produit.id === produit.id
            ? {
                ...article,
                quantite:
                  article.quantite + 1,
              }
            : article
        );
      }

      return [
        ...ancienPanier,
        {
          produit,
          quantite: 1,
        },
      ];
    });
  };

  // Augmenter la quantité
  const augmenterQuantite = (
    produitId: number
  ) => {
    setPanier((ancienPanier) =>
      ancienPanier.map((article) => {
        if (
          article.produit.id !== produitId
        ) {
          return article;
        }

        if (
          article.quantite >=
          article.produit.stock
        ) {
          alert(
            "Stock maximum atteint."
          );

          return article;
        }

        return {
          ...article,
          quantite:
            article.quantite + 1,
        };
      })
    );
  };

  // Diminuer la quantité
  const diminuerQuantite = (
    produitId: number
  ) => {
    setPanier((ancienPanier) =>
      ancienPanier
        .map((article) =>
          article.produit.id === produitId
            ? {
                ...article,
                quantite:
                  article.quantite - 1,
              }
            : article
        )
        .filter(
          (article) =>
            article.quantite > 0
        )
    );
  };

  // Supprimer du panier
  const supprimerDuPanier = (
    produitId: number
  ) => {
    setPanier((ancienPanier) =>
      ancienPanier.filter(
        (article) =>
          article.produit.id !== produitId
      )
    );
  };

  // Vider le panier
  const viderPanier = () => {
    setPanier([]);
  };

  // Calcul du total
  const total = panier.reduce(
    (somme, article) =>
      somme +
      Number(article.produit.prix) *
        article.quantite,
    0
  );

  // Nombre total d'articles
  const nombreArticles = panier.reduce(
    (somme, article) =>
      somme + article.quantite,
    0
  );

  return (
    <PanierContext.Provider
      value={{
        panier,
        ajouterAuPanier,
        augmenterQuantite,
        diminuerQuantite,
        supprimerDuPanier,
        viderPanier,
        total,
        nombreArticles,
      }}
    >
      {children}
    </PanierContext.Provider>
  );
}

export function usePanier() {
  const context =
    useContext(PanierContext);

  if (!context) {
    throw new Error(
      "usePanier doit être utilisé dans PanierProvider."
    );
  }

  return context;
}