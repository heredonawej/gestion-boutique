require("dotenv").config();

const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifierToken = require("./middleware/auth");
const verifierAdmin = require("./middleware/admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à SQLite
const db = new sqlite3.Database("./boutique.db", (err) => {
  if (err) {
    console.log("Erreur SQLite :", err.message);
  } else {
    console.log("✅ Base SQLite connectée !");
  }
});

// Autoriser l'accès aux images
app.use("/uploads", express.static("uploads"));

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Création de la table Produits
db.run(`
CREATE TABLE IF NOT EXISTS produits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    categorie TEXT NOT NULL,
    prix REAL NOT NULL,
    stock INTEGER NOT NULL
)
`);

// Ajouter la colonne image si elle n'existe pas
db.run(`
ALTER TABLE produits
ADD COLUMN image TEXT
`, (err) => {
  if (err && !err.message.includes("duplicate column")) {
    console.log(err.message);
  }
});

// Ajouter la colonne prix_achat si elle n'existe pas
db.run(`
ALTER TABLE produits
ADD COLUMN prix_achat REAL DEFAULT 0
`, (err) => {
  if (err && !err.message.includes("duplicate column")) {
    console.log(err.message);
  }
});

// Création de la table Ventes
db.run(`
CREATE TABLE IF NOT EXISTS ventes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produit_id INTEGER NOT NULL,
    quantite INTEGER NOT NULL,
    montant REAL NOT NULL,
    date_vente TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (produit_id) REFERENCES produits(id)
)
`);
db.all(
  `PRAGMA table_info(ventes)`,
  (err, colonnes) => {
    if (err) {
      console.error(
        "Erreur vérification table ventes :",
        err.message
      );
      return;
    }

    const existe = colonnes.some(
      (colonne) => colonne.name === "commande_id"
    );

    if (!existe) {
      db.run(
        `
        ALTER TABLE ventes
        ADD COLUMN commande_id INTEGER
        `,
        (err) => {
          if (err) {
            console.error(
              "Erreur ajout commande_id :",
              err.message
            );
          } else {
            console.log(
              "✅ Colonne commande_id ajoutée à ventes"
            );
          }
        }
      );
    }
  }
);
// ==========================================
// AJOUT DE LA COLONNE ORIGINE AUX VENTES
// ==========================================

db.all(
  `PRAGMA table_info(ventes)`,
  (err, colonnes) => {
    if (err) {
      console.error(
        "Erreur vérification colonne origine :",
        err.message
      );
      return;
    }

    const existe = colonnes.some(
      (colonne) => colonne.name === "origine"
    );

    if (!existe) {
      db.run(
        `
        ALTER TABLE ventes
        ADD COLUMN origine TEXT DEFAULT 'sur_place'
        `,
        (err) => {
          if (err) {
            console.error(
              "Erreur ajout origine :",
              err.message
            );
          } else {
            console.log(
              "✅ Colonne origine ajoutée à ventes"
            );
          }
        }
      );
    }
  }
);

db.run(`
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mot_de_passe TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin','caissier'))
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS fournisseurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    telephone TEXT,
    email TEXT,
    adresse TEXT,
    date_creation TEXT DEFAULT CURRENT_TIMESTAMP
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS achats(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fournisseur_id INTEGER NOT NULL,
    produit_id INTEGER NOT NULL,
    quantite INTEGER NOT NULL,
    prix_achat REAL NOT NULL,
    date_achat TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(fournisseur_id)
    REFERENCES fournisseurs(id),

    FOREIGN KEY(produit_id)
    REFERENCES produits(id)
)
`);

// ===============================
// TABLE COMMANDES
// ===============================

db.run(`
  CREATE TABLE IF NOT EXISTS commandes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom_client TEXT NOT NULL,
    telephone TEXT NOT NULL,
    adresse TEXT NOT NULL,
    commentaire TEXT,
    total REAL NOT NULL,
    statut TEXT NOT NULL DEFAULT 'en_attente',
    date_commande DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
db.run(`
  ALTER TABLE commandes
  ADD COLUMN date_livraison DATETIME
`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error(
      "Erreur ajout date_livraison :",
      err.message
    );
  }
});

// ===============================
// TABLE DETAILS COMMANDES
// ===============================

db.run(`
  CREATE TABLE IF NOT EXISTS commande_details (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    commande_id INTEGER NOT NULL,
    produit_id INTEGER NOT NULL,
    quantite INTEGER NOT NULL,
    prix REAL NOT NULL,
    sous_total REAL NOT NULL,

    FOREIGN KEY (commande_id)
      REFERENCES commandes(id)
      ON DELETE CASCADE,

    FOREIGN KEY (produit_id)
      REFERENCES produits(id)
  )
`);
// ===============================
// TABLE NOTIFICATIONS
// ===============================

db.run(`
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    commande_id INTEGER NOT NULL,
    statut TEXT NOT NULL,
    message TEXT NOT NULL,
    lu INTEGER NOT NULL DEFAULT 0,
    date_notification DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (commande_id)
      REFERENCES commandes(id)
      ON DELETE CASCADE
  )
`);
db.run(`
  CREATE TABLE IF NOT EXISTS produit_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produit_id INTEGER NOT NULL,
    image TEXT NOT NULL,
    FOREIGN KEY (produit_id)
      REFERENCES produits(id)
      ON DELETE CASCADE
  )
`);
// ==========================================
// TABLE CORBEILLE
// ==========================================

db.run(`
  CREATE TABLE IF NOT EXISTS corbeille (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    element_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    date_originale DATETIME,
    date_suppression DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error(
      "Erreur création table corbeille :",
      err.message
    );
  } else {
    console.log("Table corbeille OK");
  }
});
db.run(`
  ALTER TABLE corbeille
  ADD COLUMN donnees TEXT
`, (err) => {
  if (err && !err.message.includes("duplicate column")) {
    console.log(err.message);
  }
});


const creerAdmin = async () => {
  db.get(
    "SELECT * FROM utilisateurs WHERE email = ?",
    ["admin@boutique.com"],
    async (err, utilisateur) => {
      if (err) {
        console.error(err);
        return;
      }

      if (!utilisateur) {
        const motDePasseHash = await bcrypt.hash("admin123", 10);

        db.run(
          `INSERT INTO utilisateurs
          (nom, email, mot_de_passe, role)
          VALUES (?, ?, ?, ?)`,
          [
            "Administrateur",
            "admin@boutique.com",
            motDePasseHash,
            "admin",
          ],
          (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log("✅ Compte administrateur créé");
            }
          }
        );
      }
    }
  );
};

creerAdmin();

// Route de test
app.get("/", (req, res) => {
  res.json({
    message: "🚀 API Gestion Boutique opérationnelle",
  });
});

// Ajouter un produit avec image
// Ajouter un produit avec image
app.post("/api/produits", upload.single("image"), (req, res) => {
  const {
    nom,
    categorie,
    prix_achat,
    prix,
    stock,
  } = req.body;

  const image = req.file ? req.file.filename : null;

  if (
    !nom ||
    !categorie ||
    prix_achat === undefined ||
    prix === undefined ||
    stock === undefined
  ) {
    return res.status(400).json({
      message: "Tous les champs obligatoires doivent être remplis.",
    });
  }

  const sql = `
    INSERT INTO produits
    (nom, categorie, prix_achat, prix, stock, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      nom,
      categorie,
      Number(prix_achat),
      Number(prix),
      Number(stock),
      image,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message: "Produit ajouté avec succès",
        id: this.lastID,
      });
    }
  );
});

// Récupérer tous les produits
app.get("/api/produits", (req, res) => {
  const sql = "SELECT * FROM produits ORDER BY id DESC";

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        erreur: err.message,
      });
    }

    res.json(rows);
  });
});

// Modifier un produit
// Modifier un produit
app.put("/api/produits/:id", (req, res) => {
  const { id } = req.params;

  const {
    nom,
    categorie,
    prix_achat,
    prix,
    stock,
  } = req.body;

  if (
    !nom ||
    !categorie ||
    prix_achat === undefined ||
    prix === undefined ||
    stock === undefined
  ) {
    return res.status(400).json({
      message: "Tous les champs obligatoires doivent être remplis.",
    });
  }

  const sql = `
    UPDATE produits
    SET
      nom = ?,
      categorie = ?,
      prix_achat = ?,
      prix = ?,
      stock = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [
      nom,
      categorie,
      Number(prix_achat),
      Number(prix),
      Number(stock),
      id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Produit introuvable.",
        });
      }

      res.json({
        message: "Produit modifié avec succès",
      });
    }
  );
});

// ==========================================
// SUPPRIMER UN PRODUIT
// ==========================================

// ==========================================
// SUPPRIMER UN PRODUIT
// ET L'ENVOYER DANS LA CORBEILLE
// ==========================================

app.delete("/api/produits/:id", (req, res) => {
  const { id } = req.params;

  // Vérifier que le produit existe
  db.get(
    "SELECT * FROM produits WHERE id = ?",
    [id],
    (err, produit) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (!produit) {
        return res.status(404).json({
          message: "Produit introuvable.",
        });
      }

      // ==========================================
      // AJOUTER LE PRODUIT DANS LA CORBEILLE
      // ==========================================

      db.run(
  `
  INSERT INTO corbeille
  (
    type,
    element_id,
    description,
    date_originale,
    donnees
  )
  VALUES (?, ?, ?, ?, ?)
  `,
  [
    "produit",
    produit.id,

    `Produit : ${produit.nom} - ${Number(
      produit.prix
    ).toLocaleString()} FC - Stock : ${
      produit.stock
    }`,

    new Date().toISOString(),

    JSON.stringify({
      nom: produit.nom,
      categorie: produit.categorie,
      prix: produit.prix,
      stock: produit.stock,
      image: produit.image || null,
      prix_achat: produit.prix_achat || 0,
    }),
  ],
        (err) => {
          if (err) {
            console.error(
              "Erreur ajout produit dans la corbeille :",
              err.message
            );

            return res.status(500).json({
              message:
                "Impossible d'envoyer le produit dans la corbeille.",
            });
          }

          // ==========================================
          // SUPPRIMER LES PHOTOS
          // ==========================================

          db.run(
            "DELETE FROM produit_images WHERE produit_id = ?",
            [id],
            (err) => {
              if (err) {
                return res.status(500).json({
                  message: err.message,
                });
              }

              // ==========================================
              // SUPPRIMER LE PRODUIT
              // ==========================================

              db.run(
                "DELETE FROM produits WHERE id = ?",
                [id],
                function (err) {
                  if (err) {
                    return res.status(500).json({
                      message: err.message,
                    });
                  }

                  if (this.changes === 0) {
                    return res.status(404).json({
                      message:
                        "Produit introuvable.",
                    });
                  }

                  res.json({
                    message:
                      "Produit supprimé et envoyé dans la corbeille.",
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});
// ==========================================
// AJOUTER UNE PHOTO SUPPLÉMENTAIRE À UN PRODUIT
// ==========================================

app.post(
  "/api/produits/:id/images",
  upload.single("image"),
  (req, res) => {

    const { id } = req.params;

    // Vérifier qu'une image a été envoyée
    if (!req.file) {
      return res.status(400).json({
        message: "Aucune image envoyée.",
      });
    }

    const image = req.file.filename;

    // Vérifier que le produit existe
    db.get(
      "SELECT id FROM produits WHERE id = ?",
      [id],
      (err, produit) => {

        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        if (!produit) {
          return res.status(404).json({
            message: "Produit introuvable.",
          });
        }

        // Enregistrer l'image
        const sql = `
          INSERT INTO produit_images
          (produit_id, image)
          VALUES (?, ?)
        `;

        db.run(
          sql,
          [id, image],
          function (err) {

            if (err) {
              return res.status(500).json({
                message: err.message,
              });
            }

            res.status(201).json({
              message: "Photo ajoutée avec succès.",
              id: this.lastID,
              image,
            });

          }
        );

      }
    );

  }
);
// ==========================================
// RÉCUPÉRER LES PHOTOS D'UN PRODUIT
// ==========================================

app.get(
  "/api/produits/:id/images",
  (req, res) => {

    const { id } = req.params;

    const sql = `
      SELECT *
      FROM produit_images
      WHERE produit_id = ?
      ORDER BY id ASC
    `;

    db.all(
      sql,
      [id],
      (err, rows) => {

        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.json(rows);

      }
    );

  }
);
// ==========================================
// SUPPRIMER UNE PHOTO D'UN PRODUIT
// ==========================================

app.delete(
  "/api/produits/:produitId/images/:imageId",
  (req, res) => {

    const { produitId, imageId } = req.params;

    // Vérifier que la photo appartient bien au produit
    db.get(
      `
      SELECT image
      FROM produit_images
      WHERE id = ? AND produit_id = ?
      `,
      [imageId, produitId],
      (err, photo) => {

        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        if (!photo) {
          return res.status(404).json({
            message: "Photo introuvable.",
          });
        }

        // Supprimer de la base
        db.run(
          `
          DELETE FROM produit_images
          WHERE id = ? AND produit_id = ?
          `,
          [imageId, produitId],
          function (err) {

            if (err) {
              return res.status(500).json({
                message: err.message,
              });
            }

            res.json({
              message: "Photo supprimée avec succès.",
            });

          }
        );

      }
    );

  }
);
// ==========================================
// DÉFINIR UNE PHOTO COMME PHOTO PRINCIPALE
// ==========================================

app.put(
  "/api/produits/:produitId/images/:imageId/principale",
  (req, res) => {

    const { produitId, imageId } = req.params;

    // Vérifier que la photo existe
    db.get(
      `
      SELECT image
      FROM produit_images
      WHERE id = ? AND produit_id = ?
      `,
      [imageId, produitId],
      (err, photo) => {

        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        if (!photo) {
          return res.status(404).json({
            message: "Photo introuvable.",
          });
        }

        // Mettre l'ancienne photo principale
        // dans la table des photos supplémentaires
        db.get(
          `
          SELECT image
          FROM produits
          WHERE id = ?
          `,
          [produitId],
          (err, produit) => {

            if (err) {
              return res.status(500).json({
                message: err.message,
              });
            }

            if (!produit) {
              return res.status(404).json({
                message: "Produit introuvable.",
              });
            }

            const ancienneImage =
              produit.image;

            // Mettre la nouvelle image
            // comme image principale
            db.run(
              `
              UPDATE produits
              SET image = ?
              WHERE id = ?
              `,
              [photo.image, produitId],
              function (err) {

                if (err) {
                  return res.status(500).json({
                    message: err.message,
                  });
                }

                // Si une ancienne image existe,
                // on l'ajoute aux photos supplémentaires
                if (ancienneImage) {

                  db.run(
                    `
                    INSERT INTO produit_images
                    (produit_id, image)
                    VALUES (?, ?)
                    `,
                    [
                      produitId,
                      ancienneImage,
                    ],
                    function (err) {

                      if (err) {
                        return res.status(500).json({
                          message: err.message,
                        });
                      }

                      // Supprimer la nouvelle
                      // image de la liste supplémentaire
                      db.run(
                        `
                        DELETE FROM produit_images
                        WHERE id = ?
                        `,
                        [imageId],
                        function (err) {

                          if (err) {
                            return res.status(500).json({
                              message: err.message,
                            });
                          }

                          res.json({
                            message:
                              "Photo principale modifiée avec succès.",
                          });

                        }
                      );

                    }
                  );

                } else {

                  // Pas d'ancienne photo principale
                  db.run(
                    `
                    DELETE FROM produit_images
                    WHERE id = ?
                    `,
                    [imageId],
                    function (err) {

                      if (err) {
                        return res.status(500).json({
                          message: err.message,
                        });
                      }

                      res.json({
                        message:
                          "Photo principale modifiée avec succès.",
                      });

                    }
                  );

                }

              }
            );

          }
        );

      }
    );

  }
);


// Enregistrer une vente
app.post("/api/ventes", (req, res) => {
  const {
    produit_id,
    quantite,
    origine = "sur_place",
  } = req.body;

  // Vérifier l'origine
  const originesAutorisees = [
    "sur_place",
    "en_ligne",
  ];

  if (!originesAutorisees.includes(origine)) {
    return res.status(400).json({
      message: "Origine de vente invalide.",
    });
  }

  db.get(
    "SELECT * FROM produits WHERE id = ?",
    [produit_id],
    (err, produit) => {
      if (err) {
        return res.status(500).json({
          erreur: err.message,
        });
      }

      if (!produit) {
        return res.status(404).json({
          message: "Produit introuvable",
        });
      }

      if (produit.stock < quantite) {
        return res.status(400).json({
          message: "Stock insuffisant",
        });
      }

      const montant =
        Number(produit.prix) * Number(quantite);

      const nouveauStock =
        Number(produit.stock) - Number(quantite);

      // Enregistrer la vente avec son origine
      db.run(
        `
        INSERT INTO ventes
        (
          produit_id,
          quantite,
          montant,
          origine
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          produit_id,
          quantite,
          montant,
          origine,
        ],
        function (err) {
          if (err) {
            return res.status(500).json({
              erreur: err.message,
            });
          }

          // Diminuer le stock
          db.run(
            `
            UPDATE produits
            SET stock = ?
            WHERE id = ?
            `,
            [
              nouveauStock,
              produit_id,
            ],
            (err) => {
              if (err) {
                return res.status(500).json({
                  erreur: err.message,
                });
              }

              res.json({
                message:
                  "Vente enregistrée avec succès",
                vente_id: this.lastID,
                origine,
              });
            }
          );
        }
      );
    }
  );
});
// Récupérer toutes les ventes
app.get("/api/ventes", (req, res) => {
  const sql = `
    SELECT
      ventes.id,
      produits.nom,
      ventes.quantite,
      ventes.montant,
      ventes.date_vente,
      ventes.origine
    FROM ventes
    INNER JOIN produits
      ON ventes.produit_id = produits.id
    ORDER BY ventes.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        erreur: err.message,
      });
    }

    res.json(rows);
  });
});

// Dashboard
app.get("/api/dashboard", (req, res) => {
  db.get(
    `
    SELECT
      (SELECT COUNT(*) FROM produits) AS totalProduits,
      (SELECT COUNT(*) FROM ventes) AS totalVentes,
      (SELECT IFNULL(SUM(montant),0) FROM ventes) AS chiffreAffaires,
      (SELECT COUNT(*) FROM produits WHERE stock <= 5) AS stockFaible
    `,
    [],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          erreur: err.message,
        });
      }

      res.json(row);
    }
  );
});

// Données du graphique des catégories
app.get("/api/dashboard/chart", (req, res) => {
  const sql = `
    SELECT
      categorie,
      COUNT(*) AS total
    FROM produits
    GROUP BY categorie
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        erreur: err.message,
      });
    }

    res.json(rows);
  });
});

// Dernières ventes
app.get("/api/dashboard/latest-sales", (req, res) => {
  const sql = `
    SELECT
      ventes.id,
      produits.nom,
      ventes.quantite,
      ventes.montant,
      ventes.date_vente
    FROM ventes
    INNER JOIN produits
      ON ventes.produit_id = produits.id
    ORDER BY ventes.date_vente DESC
    LIMIT 5
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        erreur: err.message,
      });
    }

    res.json(rows);
  });
});

// Connexion utilisateur
app.post("/api/login", (req, res) => {
  const { email, motDePasse } = req.body;

  db.get(
    "SELECT * FROM utilisateurs WHERE email = ?",
    [email],
    async (err, utilisateur) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (!utilisateur) {
        return res.status(401).json({
          message: "Email ou mot de passe incorrect."
        });
      }

      const motDePasseValide = await bcrypt.compare(
        motDePasse,
        utilisateur.mot_de_passe
      );

      if (!motDePasseValide) {
        return res.status(401).json({
          message: "Email ou mot de passe incorrect."
        });
      }

      const token = jwt.sign(
        {
          id: utilisateur.id,
          role: utilisateur.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "8h",
        }
      );

      res.json({
        message: "Connexion réussie",
        token,
        utilisateur: {
          id: utilisateur.id,
          nom: utilisateur.nom,
          email: utilisateur.email,
          role: utilisateur.role,
        },
      });
    }
  );
});

// Récupérer tous les utilisateurs
app.get("/api/utilisateurs", (req, res) => {
  db.all(
    "SELECT id, nom, email, role FROM utilisateurs ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json(rows);
    }
  );
});

// Ajouter un utilisateur
app.post("/api/utilisateurs", async (req, res) => {
  const { nom, email, motDePasse, role } = req.body;

  try {
    const hash = await bcrypt.hash(motDePasse, 10);

    db.run(
      `INSERT INTO utilisateurs (nom, email, mot_de_passe, role)
       VALUES (?, ?, ?, ?)`,
      [nom, email, hash, role],
      function (err) {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.json({
          message: "Utilisateur ajouté avec succès"
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Supprimer un utilisateur
app.delete("/api/utilisateurs/:id", (req, res) => {
  const { id } = req.params;

  db.run(
    "DELETE FROM utilisateurs WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Utilisateur supprimé avec succès",
      });
    }
  );
});

// Modifier un utilisateur
// ==========================================
// MODIFIER UN UTILISATEUR
// ==========================================

app.put("/api/utilisateurs/:id", async (req, res) => {
  const { id } = req.params;
  const {
    nom,
    email,
    role,
    motDePasse,
  } = req.body;

  if (!nom || !email || !role) {
    return res.status(400).json({
      message:
        "Le nom, l'email et le rôle sont obligatoires.",
    });
  }

  try {

    // ======================================
    // MODIFICATION AVEC MOT DE PASSE
    // ======================================

    if (
      motDePasse &&
      motDePasse.trim() !== ""
    ) {

      const hash =
        await bcrypt.hash(
          motDePasse,
          10
        );

      db.run(
        `
        UPDATE utilisateurs
        SET
          nom = ?,
          email = ?,
          role = ?,
          mot_de_passe = ?
        WHERE id = ?
        `,
        [
          nom,
          email,
          role,
          hash,
          id,
        ],
        function (err) {

          if (err) {

            if (
              err.message.includes(
                "UNIQUE constraint failed"
              )
            ) {
              return res.status(400).json({
                message:
                  "Cet email est déjà utilisé.",
              });
            }

            return res.status(500).json({
              message: err.message,
            });
          }

          if (this.changes === 0) {
            return res.status(404).json({
              message:
                "Utilisateur introuvable.",
            });
          }

          res.json({
            message:
              "Utilisateur et mot de passe modifiés avec succès.",
          });
        }
      );

      return;
    }

    // ======================================
    // MODIFICATION SANS MOT DE PASSE
    // ======================================

    db.run(
      `
      UPDATE utilisateurs
      SET
        nom = ?,
        email = ?,
        role = ?
      WHERE id = ?
      `,
      [
        nom,
        email,
        role,
        id,
      ],
      function (err) {

        if (err) {

          if (
            err.message.includes(
              "UNIQUE constraint failed"
            )
          ) {
            return res.status(400).json({
              message:
                "Cet email est déjà utilisé.",
            });
          }

          return res.status(500).json({
            message: err.message,
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            message:
              "Utilisateur introuvable.",
          });
        }

        res.json({
          message:
            "Utilisateur modifié avec succès.",
        });
      }
    );

  } catch (error) {

    console.error(
      "Erreur modification utilisateur :",
      error
    );

    res.status(500).json({
      message:
        "Erreur lors de la modification de l'utilisateur.",
    });
  }
});

app.post("/api/fournisseurs", (req, res) => {

  const {
    nom,
    telephone,
    email,
    adresse,
  } = req.body;

  db.run(
    `
    INSERT INTO fournisseurs
    (nom, telephone, email, adresse)
    VALUES (?, ?, ?, ?)
    `,
    [
      nom,
      telephone,
      email,
      adresse,
    ],
    function(err){

      if(err){
        return res.status(500).json({
          message: err.message
        });
      }

      res.json({
        message:"Fournisseur ajouté avec succès."
      });

    }
  );

});
app.get("/api/fournisseurs",(req,res)=>{

    db.all(
        "SELECT * FROM fournisseurs ORDER BY nom",
        [],
        (err,rows)=>{

            if(err){
                return res.status(500).json({
                    message:err.message
                });
            }

            res.json(rows);

        }
    );

});
app.delete("/api/fournisseurs/:id",(req,res)=>{

    db.run(
        "DELETE FROM fournisseurs WHERE id=?",
        [req.params.id],
        function(err){

            if(err){
                return res.status(500).json({
                    message:err.message
                });
            }

            res.json({
                message:"Fournisseur supprimé."
            });

        }
    );

});

app.post("/api/achats", (req, res) => {
  const {
    fournisseur_id,
    produit_id,
    quantite,
    prix_achat,
  } = req.body;

  // Vérifier que le produit existe
  db.get(
    "SELECT * FROM produits WHERE id = ?",
    [produit_id],
    (err, produit) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (!produit) {
        return res.status(404).json({
          message: "Produit introuvable.",
        });
      }

      // Enregistrer l'achat
      db.run(
        `
        INSERT INTO achats
        (fournisseur_id, produit_id, quantite, prix_achat)
        VALUES (?, ?, ?, ?)
        `,
        [
          fournisseur_id,
          produit_id,
          quantite,
          prix_achat,
        ],
        function (err) {
          if (err) {
            return res.status(500).json({
              message: err.message,
            });
          }

          // Nouveau stock
          const nouveauStock =
            produit.stock + Number(quantite);

          db.run(
            "UPDATE produits SET stock = ? WHERE id = ?",
            [nouveauStock, produit_id],
            (err) => {
              if (err) {
                return res.status(500).json({
                  message: err.message,
                });
              }

              res.json({
                message: "Achat enregistré avec succès. Stock mis à jour.",
              });
            }
          );
        }
      );
    }
  );
});

// Récupérer l'historique des achats
app.get("/api/achats", (req, res) => {
  const sql = `
    SELECT
      achats.id,
      fournisseurs.nom AS fournisseur,
      produits.nom AS produit,
      achats.quantite,
      achats.prix_achat,
      (achats.quantite * achats.prix_achat) AS montant_total,
      achats.date_achat
    FROM achats
    INNER JOIN fournisseurs
      ON achats.fournisseur_id = fournisseurs.id
    INNER JOIN produits
      ON achats.produit_id = produits.id
    ORDER BY achats.id DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(rows);
  });
});

// ==========================================
// API COMMANDES CLIENTS
// ==========================================

app.post("/api/commandes", (req, res) => {
  const {
    nom_client,
    telephone,
    adresse,
    commentaire,
    produits,
    total,
  } = req.body;

  // ==========================================
  // VÉRIFICATION DES INFORMATIONS CLIENT
  // ==========================================

  if (
    !nom_client ||
    !telephone ||
    !adresse ||
    !Array.isArray(produits) ||
    produits.length === 0
  ) {
    return res.status(400).json({
      message: "Informations de commande incomplètes.",
    });
  }

  // ==========================================
  // VÉRIFICATION DU TOTAL
  // ==========================================

  const totalCommande = Number(total);

  if (
    !Number.isFinite(totalCommande) ||
    totalCommande <= 0
  ) {
    return res.status(400).json({
      message: "Total de commande invalide.",
    });
  }

  // ==========================================
  // VÉRIFIER LES PRODUITS ET LE STOCK
  // ==========================================
  // IMPORTANT :
  // On vérifie le stock mais on ne le diminue PAS.
  // Le stock sera diminué uniquement lorsque
  // l'administrateur mettra la commande à "livree".

  const verifierProduit = (index) => {
    if (index >= produits.length) {
      return creerCommande();
    }

    const article = produits[index];

    const produitId = Number(article.produit_id);
    const quantite = Number(article.quantite);

    if (
      !Number.isInteger(produitId) ||
      !Number.isInteger(quantite) ||
      quantite <= 0
    ) {
      return res.status(400).json({
        message: "Produit ou quantité invalide.",
      });
    }

    db.get(
      "SELECT * FROM produits WHERE id = ?",
      [produitId],
      (err, produit) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        if (!produit) {
          return res.status(404).json({
            message: `Produit ${produitId} introuvable.`,
          });
        }

        // Vérifier le stock disponible
        if (Number(produit.stock) < quantite) {
          return res.status(400).json({
            message:
              `Stock insuffisant pour le produit "${produit.nom}". Stock disponible : ${produit.stock}.`,
          });
        }

        // Garder les informations du produit
        article.produit_verifie = produit;

        verifierProduit(index + 1);
      }
    );
  };

  // ==========================================
  // CRÉER LA COMMANDE
  // ==========================================

  const creerCommande = () => {
    db.run(
      `
      INSERT INTO commandes
      (
        nom_client,
        telephone,
        adresse,
        commentaire,
        total,
        statut
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        nom_client,
        telephone,
        adresse,
        commentaire || "",
        totalCommande,
        "en_attente",
      ],
      function (err) {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        const commandeId = this.lastID;

        enregistrerDetails(commandeId, 0);
      }
    );
  };

  // ==========================================
  // ENREGISTRER LES DÉTAILS
  // ==========================================

  const enregistrerDetails = (
    commandeId,
    index
  ) => {
    if (index >= produits.length) {
      return res.status(201).json({
        message: "Commande enregistrée avec succès.",
        commande_id: commandeId,
      });
    }

    const article = produits[index];

    const produit = article.produit_verifie;

    const produitId = Number(
      article.produit_id
    );

    const quantite = Number(
      article.quantite
    );

    const prix = Number(
      produit.prix
    );

    const sousTotal =
      prix * quantite;

    // ========================================
    // ENREGISTRER LE PRODUIT DE LA COMMANDE
    // ========================================

    db.run(
      `
      INSERT INTO commande_details
      (
        commande_id,
        produit_id,
        quantite,
        prix,
        sous_total
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        commandeId,
        produitId,
        quantite,
        prix,
        sousTotal,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        // ====================================
        // IMPORTANT :
        // NE PAS DIMINUER LE STOCK ICI
        // ====================================

        enregistrerDetails(
          commandeId,
          index + 1
        );
      }
    );
  };

  // ==========================================
  // COMMENCER LA VÉRIFICATION
  // ==========================================

  verifierProduit(0);
});

// ==========================================
// RÉCUPÉRER TOUTES LES COMMANDES
// ==========================================

app.get("/api/commandes", (req, res) => {
  const sql = `
    SELECT
      id,
      nom_client,
      telephone,
      adresse,
      commentaire,
      total,
      statut,
      date_commande,
      date_livraison
    FROM commandes
    WHERE
      statut != 'livree'
      OR date_livraison IS NULL
      OR datetime(date_livraison, '+1 day') > datetime('now')
    ORDER BY id DESC
  `;

  db.all(sql, [], (err, commandes) => {
    if (err) {
      console.error(
        "Erreur récupération commandes :",
        err
      );

      return res.status(500).json({
        message:
          "Erreur lors de la récupération des commandes.",
      });
    }

    res.json(commandes);
  });
});
// ==========================================
// CORBEILLE DES COMMANDES
// ==========================================

app.get("/api/commandes/corbeille", (req, res) => {
  const sql = `
    SELECT
      id,
      nom_client,
      telephone,
      adresse,
      commentaire,
      total,
      statut,
      date_commande,
      date_livraison
    FROM commandes
    WHERE
      statut = 'livree'
      AND date_livraison IS NOT NULL
      AND datetime(date_livraison, '+1 day') <= datetime('now')
    ORDER BY date_livraison DESC
  `;

  db.all(sql, [], (err, commandes) => {
    if (err) {
      console.error(
        "Erreur récupération corbeille :",
        err
      );

      return res.status(500).json({
        message:
          "Erreur lors de la récupération de la corbeille.",
      });
    }

    res.json(commandes);
  });
});
// ==========================================
// RÉCUPÉRER TOUTE LA CORBEILLE
// ==========================================

app.get("/api/corbeille", (req, res) => {
  const sql = `
    SELECT
      id,
      type,
      element_id,
      description,
      date_originale,
      date_suppression
    FROM corbeille
    ORDER BY date_suppression DESC
  `;

  db.all(sql, [], (err, elements) => {
    if (err) {
      console.error(
        "Erreur récupération corbeille :",
        err.message
      );

      return res.status(500).json({
        message:
          "Erreur lors de la récupération de la corbeille.",
      });
    }

    res.json(elements);
  });
});
// ==========================================
// SUPPRIMER DÉFINITIVEMENT UN ÉLÉMENT
// DE LA CORBEILLE
// ==========================================

app.delete("/api/corbeille/:id", (req, res) => {
  const corbeilleId = Number(req.params.id);

  if (!Number.isInteger(corbeilleId)) {
    return res.status(400).json({
      message: "Identifiant de corbeille invalide.",
    });
  }

  db.run(
    `
    DELETE FROM corbeille
    WHERE id = ?
    `,
    [corbeilleId],
    function (err) {
      if (err) {
        console.error(
          "Erreur suppression corbeille :",
          err.message
        );

        return res.status(500).json({
          message:
            "Erreur lors de la suppression définitive.",
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Élément introuvable dans la corbeille.",
        });
      }

      res.json({
        message:
          "Élément supprimé définitivement.",
      });
    }
  );
});
// ==========================================
// RESTAURER UN ÉLÉMENT DE LA CORBEILLE
// ==========================================

// ==========================================
// RESTAURER UN ÉLÉMENT DE LA CORBEILLE
// ==========================================

app.put("/api/corbeille/:id/restaurer", (req, res) => {
  const corbeilleId = Number(req.params.id);

  if (!Number.isInteger(corbeilleId)) {
    return res.status(400).json({
      message: "Identifiant invalide.",
    });
  }

  // Récupérer l'élément
  db.get(
    `
    SELECT *
    FROM corbeille
    WHERE id = ?
    `,
    [corbeilleId],
    (err, element) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (!element) {
        return res.status(404).json({
          message:
            "Élément introuvable dans la corbeille.",
        });
      }

      // ==========================================
      // RESTAURATION D'UN PRODUIT
      // ==========================================

      if (element.type === "produit") {
        if (!element.donnees) {
          return res.status(400).json({
            message:
              "Les données du produit ne sont pas disponibles.",
          });
        }

        let produit;

        try {
          produit = JSON.parse(element.donnees);
        } catch (error) {
          return res.status(500).json({
            message:
              "Impossible de lire les données du produit.",
          });
        }

        db.run(
          `
          INSERT INTO produits
          (
            nom,
            categorie,
            prix,
            stock,
            image,
            prix_achat
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            produit.nom,
            produit.categorie,
            produit.prix,
            produit.stock,
            produit.image,
            produit.prix_achat,
          ],
          function (err) {
            if (err) {
              return res.status(500).json({
                message: err.message,
              });
            }

            // Supprimer de la corbeille
            db.run(
              `
              DELETE FROM corbeille
              WHERE id = ?
              `,
              [corbeilleId],
              (err) => {
                if (err) {
                  return res.status(500).json({
                    message: err.message,
                  });
                }

                return res.json({
                  message:
                    "Produit restauré avec succès.",
                });
              }
            );
          }
        );

        return;
      }

      // ==========================================
      // RESTAURATION D'UNE COMMANDE
      // ==========================================

      if (element.type === "commande") {
        db.get(
          `
          SELECT id
          FROM commandes
          WHERE id = ?
          `,
          [element.element_id],
          (err, commande) => {
            if (err) {
              return res.status(500).json({
                message: err.message,
              });
            }

            if (!commande) {
              return res.status(404).json({
                message:
                  "La commande originale n'existe plus.",
              });
            }

            db.run(
              `
              DELETE FROM corbeille
              WHERE id = ?
              `,
              [corbeilleId],
              (err) => {
                if (err) {
                  return res.status(500).json({
                    message: err.message,
                  });
                }

                return res.json({
                  message:
                    "Commande restaurée avec succès.",
                });
              }
            );
          }
        );

        return;
      }

      // ==========================================
      // RESTAURATION D'UNE VENTE
      // ==========================================

      if (element.type === "vente") {
        db.get(
          `
          SELECT id
          FROM ventes
          WHERE id = ?
          `,
          [element.element_id],
          (err, vente) => {
            if (err) {
              return res.status(500).json({
                message: err.message,
              });
            }

            if (!vente) {
              return res.status(404).json({
                message:
                  "La vente originale n'existe plus.",
              });
            }

            db.run(
              `
              DELETE FROM corbeille
              WHERE id = ?
              `,
              [corbeilleId],
              (err) => {
                if (err) {
                  return res.status(500).json({
                    message: err.message,
                  });
                }

                return res.json({
                  message:
                    "Vente restaurée avec succès.",
                });
              }
            );
          }
        );

        return;
      }

      return res.status(400).json({
        message:
          "Type d'élément non pris en charge.",
      });
    }
  );
});

// ==========================================
// DÉTAIL D'UNE COMMANDE
// ==========================================

app.get("/api/commandes/:id", (req, res) => {
  const commandeId = Number(req.params.id);

  if (!Number.isInteger(commandeId)) {
    return res.status(400).json({
      message: "Identifiant de commande invalide.",
    });
  }

  // Récupérer les informations de la commande
  db.get(
    `
    SELECT
      id,
      nom_client,
      telephone,
      adresse,
      commentaire,
      total,
      statut,
      date_commande
    FROM commandes
    WHERE id = ?
    `,
    [commandeId],
    (err, commande) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (!commande) {
        return res.status(404).json({
          message: "Commande introuvable.",
        });
      }

      // Récupérer les produits de la commande
      db.all(
        `
        SELECT
          cd.id,
          cd.produit_id,
          cd.quantite,
          cd.prix,
          cd.sous_total,
          p.nom,
          p.categorie,
          p.image
        FROM commande_details cd
        INNER JOIN produits p
          ON p.id = cd.produit_id
        WHERE cd.commande_id = ?
        ORDER BY cd.id ASC
        `,
        [commandeId],
        (err, produits) => {
          if (err) {
            return res.status(500).json({
              message: err.message,
            });
          }

          res.json({
            commande,
            produits,
          });
        }
      );
    }
  );
});
// ==========================================
// RÉCUPÉRER LES NOTIFICATIONS D'UNE COMMANDE
// ==========================================

app.get("/api/notifications/:commandeId", (req, res) => {
  const commandeId = Number(req.params.commandeId);

  if (!Number.isInteger(commandeId) || commandeId <= 0) {
    return res.status(400).json({
      message: "Numéro de commande invalide.",
    });
  }

  db.all(
    `
    SELECT
      id,
      commande_id,
      statut,
      message,
      lu,
      date_notification
    FROM notifications
    WHERE commande_id = ?
    ORDER BY id DESC
    `,
    [commandeId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json(rows);
    }
  );
});
// ==========================================
// NOTIFICATIONS D'UN CLIENT
// ==========================================

app.get("/api/notifications/client/:telephone", (req, res) => {
  const telephone = String(req.params.telephone || "").trim();

  if (!telephone) {
    return res.status(400).json({
      message: "Numéro de téléphone invalide.",
    });
  }

  const sql = `
    SELECT
      notifications.id,
      notifications.commande_id,
      notifications.statut,
      notifications.message,
      notifications.lu,
      notifications.date_notification
    FROM notifications
    INNER JOIN commandes
      ON notifications.commande_id = commandes.id
    WHERE commandes.telephone = ?
    ORDER BY notifications.id DESC
  `;

  db.all(
    sql,
    [telephone],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json(rows);
    }
  );
});
// ==========================================
// MARQUER UNE NOTIFICATION COMME LUE
// ==========================================

app.put("/api/notifications/:id/lue", (req, res) => {
  const notificationId = Number(req.params.id);

  if (!Number.isInteger(notificationId) || notificationId <= 0) {
    return res.status(400).json({
      message: "ID de notification invalide.",
    });
  }

  db.run(
    `
    UPDATE notifications
    SET lu = 1
    WHERE id = ?
    `,
    [notificationId],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Notification introuvable.",
        });
      }

      res.json({
        message: "Notification marquée comme lue.",
      });
    }
  );
});

// ==========================================
// MODIFIER LE STATUT D'UNE COMMANDE
// ==========================================

// ==========================================
// MODIFIER LE STATUT D'UNE COMMANDE
// ==========================================

app.put("/api/commandes/:id/statut", (req, res) => {
  const commandeId = Number(req.params.id);
  const { statut } = req.body;

  const statutsAutorises = [
    "en_attente",
    "confirmee",
    "preparation",
    "prete",
    "livree",
    "annulee",
  ];

  // Vérification de l'ID
  if (!Number.isInteger(commandeId) || commandeId <= 0) {
    return res.status(400).json({
      message: "Numéro de commande invalide.",
    });
  }

  // Vérification du statut
  if (!statutsAutorises.includes(statut)) {
    return res.status(400).json({
      message: "Statut de commande invalide.",
    });
  }

  // ==========================================
  // RÉCUPÉRER LA COMMANDE
  // ==========================================

  db.get(
    `
    SELECT *
    FROM commandes
    WHERE id = ?
    `,
    [commandeId],
    (err, commande) => {
      if (err) {
        console.error(
          "Erreur récupération commande :",
          err.message
        );

        return res.status(500).json({
          message:
            "Erreur lors de la récupération de la commande.",
        });
      }

      if (!commande) {
        return res.status(404).json({
          message: "Commande introuvable.",
        });
      }

      const ancienStatut = commande.statut;

      // ==========================================
      // SI LE STATUT NE CHANGE PAS
      // ==========================================

      if (ancienStatut === statut) {
        return res.json({
          message:
            "Le statut de la commande est déjà " +
            statut +
            ".",
        });
      }

      // ==========================================
      // CAS : ANNULATION
      // ==========================================

      if (statut === "annulee") {
        db.run(
          `
          UPDATE commandes
          SET statut = ?
          WHERE id = ?
          `,
          [statut, commandeId],
          function (err) {
            if (err) {
              console.error(
                "Erreur annulation commande :",
                err.message
              );

              return res.status(500).json({
                message:
                  "Impossible de modifier le statut.",
              });
            }

            // Notification
            db.run(
              `
              INSERT INTO notifications
              (
                commande_id,
                statut,
                message
              )
              VALUES (?, ?, ?)
              `,
              [
                commandeId,
                "annulee",
                "🔴 Votre commande a été annulée.",
              ],
              (notificationError) => {
                if (notificationError) {
                  console.error(
                    "Erreur notification :",
                    notificationError.message
                  );
                }

                return res.json({
                  message:
                    "Commande annulée avec succès.",
                });
              }
            );
          }
        );

        return;
      }

      // ==========================================
      // CAS : LIVRAISON
      // ==========================================

      if (statut === "livree") {
        // Récupérer les produits de la commande
        db.all(
          `
          SELECT
            commande_details.produit_id,
            commande_details.quantite,
            commande_details.prix,
            produits.nom,
            produits.stock
          FROM commande_details
          INNER JOIN produits
            ON commande_details.produit_id = produits.id
          WHERE commande_details.commande_id = ?
          `,
          [commandeId],
          (err, details) => {
            if (err) {
              console.error(
                "Erreur récupération détails :",
                err.message
              );

              return res.status(500).json({
                message:
                  "Impossible de récupérer les produits de la commande.",
              });
            }

            if (!details || details.length === 0) {
              return res.status(400).json({
                message:
                  "Cette commande ne contient aucun produit.",
              });
            }

            // ========================================
            // VÉRIFIER SI LES VENTES EXISTENT DÉJÀ
            // ========================================

            db.get(
              `
              SELECT COUNT(*) AS nombre
              FROM ventes
              WHERE commande_id = ?
              `,
              [commandeId],
              (err, resultat) => {
                if (err) {
                  console.error(
                    "Erreur vérification ventes :",
                    err.message
                  );

                  return res.status(500).json({
                    message:
                      "Impossible de vérifier les ventes.",
                  });
                }

                // Si des ventes existent déjà,
                // on ne les recrée pas.
                if (
                  resultat &&
                  Number(resultat.nombre) > 0
                ) {
                  return res.status(400).json({
                    message:
                      "Les ventes de cette commande ont déjà été enregistrées.",
                  });
                }

                // ====================================
                // VÉRIFICATION DU STOCK
                // ====================================

                for (const detail of details) {
                  if (
                    Number(detail.stock) <
                    Number(detail.quantite)
                  ) {
                    return res.status(400).json({
                      message:
                        `Stock insuffisant pour "${detail.nom}". ` +
                        `Stock disponible : ${detail.stock}, ` +
                        `quantité demandée : ${detail.quantite}.`,
                    });
                  }
                }

                // ====================================
                // ENREGISTRER LES VENTES
                // ====================================

                let index = 0;

                const enregistrerVenteSuivante = () => {
                  if (index >= details.length) {
                    terminerCommande();
                    return;
                  }

                  const detail = details[index];

                  const montant =
                    Number(detail.prix) *
                    Number(detail.quantite);

                  db.run(
                    `
                    INSERT INTO ventes
                    (
                      produit_id,
                      commande_id,
                      quantite,
                      montant,
                      origine
                    )
                    VALUES (?, ?, ?, ?, ?)
                    `,
                    [
                      detail.produit_id,
                      commandeId,
                      Number(detail.quantite),
                      montant,
                      "en_ligne",
                    ],
                    function (err) {
                      if (err) {
                        console.error(
                          "Erreur création vente :",
                          err.message
                        );

                        return res.status(500).json({
                          message:
                            "Impossible d'enregistrer la vente.",
                        });
                      }

                      // ==================================
                      // DIMINUER LE STOCK
                      // ==================================

                      db.run(
                        `
                        UPDATE produits
                        SET stock = stock - ?
                        WHERE id = ?
                        `,
                        [
                          Number(detail.quantite),
                          detail.produit_id,
                        ],
                        function (err) {
                          if (err) {
                            console.error(
                              "Erreur mise à jour stock :",
                              err.message
                            );

                            return res.status(500).json({
                              message:
                                "La vente a été enregistrée mais le stock n'a pas pu être mis à jour.",
                            });
                          }

                          index++;

                          enregistrerVenteSuivante();
                        }
                      );
                    }
                  );
                };

                // ====================================
                // TERMINER LA COMMANDE
                // ====================================

                const terminerCommande = () => {
                  db.run(
                    `
                    UPDATE commandes
                    SET
                      statut = ?,
                      date_livraison = CURRENT_TIMESTAMP
                    WHERE id = ?
                    `,
                    ["livree", commandeId],
                    function (err) {
                      if (err) {
                        console.error(
                          "Erreur mise à jour commande :",
                          err.message
                        );

                        return res.status(500).json({
                          message:
                            "Les ventes ont été enregistrées, mais la commande n'a pas pu être livrée.",
                        });
                      }

                      // ==================================
                      // CRÉER LA NOTIFICATION
                      // ==================================

                      db.run(
                        `
                        INSERT INTO notifications
                        (
                          commande_id,
                          statut,
                          message
                        )
                        VALUES (?, ?, ?)
                        `,
                        [
                          commandeId,
                          "livree",
                          "🎉 Votre commande a été livrée avec succès. Merci pour votre confiance !",
                        ],
                        function (notificationError) {
                          if (notificationError) {
                            console.error(
                              "Erreur notification :",
                              notificationError.message
                            );

                            // La commande est quand même livrée.
                            return res.json({
                              message:
                                "Commande livrée et ventes enregistrées. La notification n'a pas pu être créée.",
                            });
                          }

                          return res.json({
                            message:
                              "Commande livrée. Vente, stock, date de livraison et notification mis à jour avec succès.",
                          });
                        }
                      );
                    }
                  );
                };

                // Commencer les ventes
                enregistrerVenteSuivante();
              }
            );
          }
        );

        return;
      }

      // ==========================================
      // AUTRES STATUTS
      // ==========================================

      db.run(
        `
        UPDATE commandes
        SET statut = ?
        WHERE id = ?
        `,
        [statut, commandeId],
        function (err) {
          if (err) {
            console.error(
              "Erreur modification statut :",
              err.message
            );

            return res.status(500).json({
              message:
                "Impossible de modifier le statut.",
            });
          }

          // ========================================
          // CRÉER LA NOTIFICATION
          // ========================================

          let message = "";

          switch (statut) {
            case "confirmee":
              message =
                "🔵 Votre commande a été confirmée.";
              break;

            case "preparation":
              message =
                "📦 Votre commande est en cours de préparation.";
              break;

            case "prete":
              message =
                "🟢 Votre commande est prête.";
              break;

            case "en_attente":
              message =
                "🟡 Votre commande est en attente.";
              break;

            default:
              message =
                "🔔 Le statut de votre commande a été mis à jour.";
          }

          db.run(
            `
            INSERT INTO notifications
            (
              commande_id,
              statut,
              message
            )
            VALUES (?, ?, ?)
            `,
            [
              commandeId,
              statut,
              message,
            ],
            (notificationError) => {
              if (notificationError) {
                console.error(
                  "Erreur notification :",
                  notificationError.message
                );
              }

              return res.json({
                message:
                  "Statut de la commande modifié avec succès.",
              });
            }
          );
        }
      );
    }
  );
});
// ==========================================
// ENVOYER LES COMMANDES LIVRÉES
// DANS LA CORBEILLE APRÈS 24 HEURES
// ==========================================

const nettoyerCommandesLivrees = () => {
  db.all(
    `
    SELECT *
    FROM commandes
    WHERE
      statut = 'livree'
      AND date_livraison IS NOT NULL
      AND datetime(date_livraison, '+1 day') <= datetime('now')
    `,
    [],
    (err, commandes) => {
      if (err) {
        console.error(
          "Erreur recherche commandes à archiver :",
          err.message
        );
        return;
      }

      if (commandes.length === 0) {
        return;
      }

      commandes.forEach((commande) => {

        // Vérifier si elle est déjà dans la corbeille
        db.get(
          `
          SELECT id
          FROM corbeille
          WHERE type = 'commande'
          AND element_id = ?
          `,
          [commande.id],
          (err, existe) => {
            if (err) {
              console.error(
                "Erreur vérification corbeille :",
                err.message
              );
              return;
            }

            // Déjà présente → rien à faire
            if (existe) {
              return;
            }

            // Ajouter dans la corbeille
            db.run(
              `
              INSERT INTO corbeille
              (
                type,
                element_id,
                description,
                date_originale
              )
              VALUES (?, ?, ?, ?)
              `,
              [
                "commande",
                commande.id,
                `Commande #${commande.id} - ${commande.nom_client}`,
                commande.date_commande,
              ],
              (err) => {
                if (err) {
                  console.error(
                    "Erreur ajout commande corbeille :",
                    err.message
                  );
                  return;
                }

                console.log(
                  `Commande #${commande.id} envoyée dans la corbeille.`
                );
              }
            );
          }
        );
      });
    }
  );
};

// Vérification toutes les 10 minutes
setInterval(
  nettoyerCommandesLivrees,
  10 * 60 * 1000
);

// Vérification également au démarrage du serveur
nettoyerCommandesLivrees();

// ==========================================
// ENVOYER LES VENTES DANS LA CORBEILLE
// APRÈS 7 JOURS
// ==========================================

const nettoyerVentesAnciennes = () => {
  db.all(
    `
    SELECT
      ventes.id,
      ventes.produit_id,
      ventes.quantite,
      ventes.montant,
      ventes.date_vente,
      produits.nom
    FROM ventes
    LEFT JOIN produits
      ON ventes.produit_id = produits.id
    WHERE datetime(ventes.date_vente, '+7 days')
      <= datetime('now')
    `,
    [],
    (err, ventes) => {
      if (err) {
        console.error(
          "Erreur recherche ventes anciennes :",
          err.message
        );
        return;
      }

      if (ventes.length === 0) {
        return;
      }

      ventes.forEach((vente) => {

        db.get(
          `
          SELECT id
          FROM corbeille
          WHERE type = 'vente'
          AND element_id = ?
          `,
          [vente.id],
          (err, existe) => {
            if (err) {
              console.error(
                "Erreur vérification vente corbeille :",
                err.message
              );
              return;
            }

            if (existe) {
              return;
            }

            db.run(
              `
              INSERT INTO corbeille
              (
                type,
                element_id,
                description,
                date_originale
              )
              VALUES (?, ?, ?, ?)
              `,
              [
                "vente",
                vente.id,
                `Vente #${vente.id} - ${
                  vente.nom || "Produit supprimé"
                } - ${
                  vente.quantite
                } article(s) - ${
                  Number(vente.montant).toLocaleString()
                } FC`,
                vente.date_vente,
              ],
              (err) => {
                if (err) {
                  console.error(
                    "Erreur ajout vente corbeille :",
                    err.message
                  );
                  return;
                }

                console.log(
                  `Vente #${vente.id} envoyée dans la corbeille.`
                );
              }
            );
          }
        );
      });
    }
  );
};

// Vérification toutes les 10 minutes
setInterval(
  nettoyerVentesAnciennes,
  10 * 60 * 1000
);

// Vérification au démarrage
nettoyerVentesAnciennes();

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});