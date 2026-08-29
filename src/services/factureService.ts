import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBoutiqueInfo } from "../services/boutiqueService";

// ==========================================
// TYPES
// ==========================================

interface Facture {
  produit: string;
  quantite: number;
  prix: number;
  vendeur: string;
}

// ==========================================
// FACTURE — FORMAT TICKET 80 MM
// ==========================================

export function genererFacture(data: Facture) {
  const boutique = getBoutiqueInfo();

  const total = data.prix * data.quantite;

  // Format ticket 80 mm
  const largeur = 80;

  // Hauteur approximative du ticket
  const hauteur = 150;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [largeur, hauteur],
  });

  const centre = largeur / 2;

  // ==========================================
  // EN-TÊTE
  // ==========================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);

  doc.text(
    boutique.nom,
    centre,
    10,
    {
      align: "center",
    }
  );

  doc.setFontSize(9);

  doc.setFont("helvetica", "normal");

  if (boutique.telephone) {
    doc.text(
      `Tél : ${boutique.telephone}`,
      centre,
      16,
      {
        align: "center",
      }
    );
  }

  if (boutique.email) {
    doc.text(
      boutique.email,
      centre,
      21,
      {
        align: "center",
      }
    );
  }

  if (boutique.adresse) {
    doc.text(
      boutique.adresse,
      centre,
      26,
      {
        align: "center",
      }
    );
  }

  // ==========================================
  // TITRE
  // ==========================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(
    "FACTURE DE VENTE",
    centre,
    35,
    {
      align: "center",
    }
  );

  // Ligne
  doc.line(5, 38, 75, 38);

  // ==========================================
  // INFORMATIONS
  // ==========================================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    `Date : ${new Date().toLocaleString()}`,
    5,
    44
  );

  doc.text(
    `Vendeur : ${data.vendeur}`,
    5,
    49
  );

  // ==========================================
  // PRODUIT
  // ==========================================

  autoTable(doc, {
    startY: 54,

    margin: {
      left: 5,
      right: 5,
    },

    tableWidth: 70,

    head: [
      [
        "Produit",
        "Qté",
        "Prix",
        "Total",
      ],
    ],

    body: [
      [
        data.produit,
        data.quantite.toString(),
        `${data.prix.toLocaleString()} FC`,
        `${total.toLocaleString()} FC`,
      ],
    ],

    styles: {
      fontSize: 7,
      cellPadding: 2,
      overflow: "linebreak",
    },

    headStyles: {
      fontSize: 7,
      fontStyle: "bold",
    },

    columnStyles: {
      0: {
        cellWidth: 25,
      },
      1: {
        cellWidth: 9,
        halign: "center",
      },
      2: {
        cellWidth: 18,
        halign: "right",
      },
      3: {
        cellWidth: 18,
        halign: "right",
      },
    },
  });

  // ==========================================
  // TOTAL
  // ==========================================

  const positionFinale =
    (doc as any).lastAutoTable.finalY;

  doc.line(
    5,
    positionFinale + 5,
    75,
    positionFinale + 5
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(
    "TOTAL",
    5,
    positionFinale + 13
  );

  doc.text(
    `${total.toLocaleString()} FC`,
    75,
    positionFinale + 13,
    {
      align: "right",
    }
  );

  // ==========================================
  // PIED
  // ==========================================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    "Merci pour votre confiance !",
    centre,
    positionFinale + 25,
    {
      align: "center",
    }
  );

  doc.text(
    "À bientôt 👋",
    centre,
    positionFinale + 31,
    {
      align: "center",
    }
  );

  // ==========================================
  // ENREGISTRER
  // ==========================================

  doc.save(
    `Facture_${Date.now()}.pdf`
  );
}

// ==========================================
// BON DE COMMANDE CLIENT
// FORMAT TICKET 80 MM
// ==========================================

interface ProduitCommande {
  nom: string;
  quantite: number;
  prix: number;
  sous_total: number;
}

interface BonCommande {
  id: number;
  nom_client: string;
  telephone: string;
  adresse: string;
  commentaire?: string;
  total: number;
  statut: string;
  date_commande: string;
  produits: ProduitCommande[];
}

// ==========================================
// GÉNÉRER BON DE COMMANDE
// ==========================================

export function genererBonCommande(
  data: BonCommande
) {
  const boutique = getBoutiqueInfo();

  const largeur = 80;
  const hauteur = 180;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [largeur, hauteur],
  });

  const centre = largeur / 2;

  // ==========================================
  // EN-TÊTE
  // ==========================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);

  doc.text(
    boutique.nom,
    centre,
    10,
    {
      align: "center",
    }
  );

  doc.setFontSize(10);

  doc.text(
    "BON DE COMMANDE",
    centre,
    17,
    {
      align: "center",
    }
  );

  doc.line(5, 21, 75, 21);

  // ==========================================
  // COMMANDE
  // ==========================================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    `Commande N° : #${data.id}`,
    5,
    27
  );

  doc.text(
    `Date : ${new Date(
      data.date_commande
    ).toLocaleString()}`,
    5,
    32
  );

  // ==========================================
  // CLIENT
  // ==========================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);

  doc.text(
    "CLIENT",
    5,
    40
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    `Nom : ${data.nom_client}`,
    5,
    46
  );

  doc.text(
    `Tél : ${data.telephone}`,
    5,
    51
  );

  doc.text(
    `Adresse : ${data.adresse}`,
    5,
    56
  );

  // ==========================================
  // PRODUITS
  // ==========================================

  autoTable(doc, {
    startY: 61,

    margin: {
      left: 5,
      right: 5,
    },

    tableWidth: 70,

    head: [
      [
        "Produit",
        "Qté",
        "Prix",
        "Total",
      ],
    ],

    body: data.produits.map(
      (produit) => [
        produit.nom,
        produit.quantite.toString(),
        `${Number(
          produit.prix
        ).toLocaleString()} FC`,
        `${Number(
          produit.sous_total
        ).toLocaleString()} FC`,
      ]
    ),

    styles: {
      fontSize: 7,
      cellPadding: 2,
      overflow: "linebreak",
    },

    headStyles: {
      fontSize: 7,
      fontStyle: "bold",
    },

    columnStyles: {
      0: {
        cellWidth: 25,
      },
      1: {
        cellWidth: 9,
        halign: "center",
      },
      2: {
        cellWidth: 18,
        halign: "right",
      },
      3: {
        cellWidth: 18,
        halign: "right",
      },
    },
  });

  // ==========================================
  // TOTAL
  // ==========================================

  const positionFinale =
    (doc as any).lastAutoTable.finalY;

  doc.line(
    5,
    positionFinale + 5,
    75,
    positionFinale + 5
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);

  doc.text(
    "TOTAL",
    5,
    positionFinale + 13
  );

  doc.text(
    `${Number(
      data.total
    ).toLocaleString()} FC`,
    75,
    positionFinale + 13,
    {
      align: "right",
    }
  );

  // ==========================================
  // STATUT
  // ==========================================

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  doc.text(
    `Statut : ${data.statut}`,
    5,
    positionFinale + 22
  );

  // ==========================================
  // COMMENTAIRE
  // ==========================================

  if (data.commentaire) {
    doc.text(
      `Note : ${data.commentaire}`,
      5,
      positionFinale + 29
    );
  }

  // ==========================================
  // PIED
  // ==========================================

  doc.setFontSize(8);

  doc.text(
    "Merci pour votre confiance !",
    centre,
    positionFinale + 42,
    {
      align: "center",
    }
  );

  doc.text(
    "À bientôt 👋",
    centre,
    positionFinale + 48,
    {
      align: "center",
    }
  );

  // ==========================================
  // TÉLÉCHARGEMENT
  // ==========================================

  doc.save(
    `Bon_Commande_${data.id}.pdf`
  );
}