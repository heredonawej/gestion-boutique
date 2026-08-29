import { useEffect, useState } from "react";

import { ajouterProduit } from "../services/produitService";

import { ajouterImageProduit } from "../services/imageService";

interface ProduitEdition {
  id: number;
  nom: string;
  categorie: string;
  prix: number;
  prix_achat?: number;
  stock: number;
  image?: string | null;
}

interface ProductFormProps {
  onProduitAjoute: () => void;
  produitEnEdition?: ProduitEdition | null;
  onAnnulerEdition?: () => void;
  onModifier?: (produit: ProduitEdition) => Promise<void>;
}

function ProductForm({
  onProduitAjoute,
  produitEnEdition = null,
  onAnnulerEdition,
  onModifier,
}: ProductFormProps) {

  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState("");
  const [prixAchat, setPrixAchat] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");

  // Image principale
  const [image, setImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState("");

  // Photos supplémentaires
  const [imagesSupplementaires, setImagesSupplementaires] =
    useState<File[]>([]);

  const [previewsSupplementaires, setPreviewsSupplementaires] =
    useState<string[]>([]);

  const [chargement, setChargement] =
    useState(false);

  // ==========================================
  // CHARGER LE PRODUIT EN ÉDITION
  // ==========================================

  useEffect(() => {

    if (produitEnEdition) {

      setNom(produitEnEdition.nom);

      setCategorie(
        produitEnEdition.categorie
      );

      setPrixAchat(
        String(
          produitEnEdition.prix_achat ?? ""
        )
      );

      setPrix(
        String(produitEnEdition.prix)
      );

      setStock(
        String(produitEnEdition.stock)
      );

      if (produitEnEdition.image) {

        setPreview(
          `http://https://gestion-boutique-2qu3.onrender.com/uploads/${produitEnEdition.image}`
        );

      } else {

        setPreview("");

      }

    }

  }, [produitEnEdition]);

  // ==========================================
  // IMAGE PRINCIPALE
  // ==========================================

  const handleImage = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files?.length) {
      return;
    }

    const file =
      e.target.files[0];

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // ==========================================
  // PHOTOS SUPPLÉMENTAIRES
  // ==========================================

  const handleImagesSupplementaires = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files?.length) {
      return;
    }

    const fichiers =
      Array.from(e.target.files);

    setImagesSupplementaires(
      fichiers
    );

    const nouveauxPreviews =
      fichiers.map((file) =>
        URL.createObjectURL(file)
      );

    setPreviewsSupplementaires(
      nouveauxPreviews
    );
  };

  // ==========================================
  // SUPPRIMER UNE PHOTO DE LA SÉLECTION
  // ==========================================

  const supprimerImageSelectionnee = (
    index: number
  ) => {

    setImagesSupplementaires(
      (ancien) =>
        ancien.filter(
          (_, i) => i !== index
        )
    );

    setPreviewsSupplementaires(
      (ancien) =>
        ancien.filter(
          (_, i) => i !== index
        )
    );
  };

  // ==========================================
  // RÉINITIALISER
  // ==========================================

  const reinitialiser = () => {

    setNom("");
    setCategorie("");
    setPrixAchat("");
    setPrix("");
    setStock("");

    setImage(null);
    setPreview("");

    setImagesSupplementaires([]);
    setPreviewsSupplementaires([]);

  };

  // ==========================================
  // ENVOI DU FORMULAIRE
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setChargement(true);

      // ======================================
      // MODIFICATION
      // ======================================

      if (produitEnEdition) {

        if (!onModifier) {
          return;
        }

        await onModifier({

          ...produitEnEdition,

          nom,

          categorie,

          prix_achat:
            Number(prixAchat),

          prix:
            Number(prix),

          stock:
            Number(stock),

        });

        alert(
          "Produit modifié avec succès."
        );

        return;
      }

      // ======================================
      // AJOUT DU PRODUIT
      // ======================================

      const formData =
        new FormData();

      formData.append(
        "nom",
        nom
      );

      formData.append(
        "categorie",
        categorie
      );

      formData.append(
        "prix_achat",
        prixAchat
      );

      formData.append(
        "prix",
        prix
      );

      formData.append(
        "stock",
        stock
      );

      // Image principale
      if (image) {

        formData.append(
          "image",
          image
        );

      }

      // Ajouter le produit
      const data =
        await ajouterProduit(
          formData
        );

      if (!data.id) {

        alert(
          data.message ||
          "Erreur lors de l'ajout du produit."
        );

        return;
      }

      // ======================================
      // AJOUT DES PHOTOS SUPPLÉMENTAIRES
      // ======================================

      if (
        imagesSupplementaires.length >
        0
      ) {

        for (
          const fichier
          of imagesSupplementaires
        ) {

          await ajouterImageProduit(
            data.id,
            fichier
          );

        }

      }

      alert(
        "Produit et photos ajoutés avec succès."
      );

      reinitialiser();

      onProduitAjoute();

    } catch (error) {

      console.error(error);

      alert(
        "Une erreur est survenue lors de l'enregistrement."
      );

    } finally {

      setChargement(false);

    }

  };

  // ==========================================
  // ANNULER
  // ==========================================

  const annulerEdition = () => {

    reinitialiser();

    if (onAnnulerEdition) {

      onAnnulerEdition();

    }

  };

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

      <h2 className="text-2xl font-bold mb-6">

        {produitEnEdition
          ? "✏️ Modifier le produit"
          : "📦 Ajouter un produit"}

      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* =====================================
            NOM
        ===================================== */}

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Nom du produit"
          value={nom}
          onChange={(e) =>
            setNom(e.target.value)
          }
          required
        />

        {/* =====================================
            CATÉGORIE
        ===================================== */}

        <input
          className="w-full border rounded-lg p-3"
          placeholder="Catégorie"
          value={categorie}
          onChange={(e) =>
            setCategorie(e.target.value)
          }
          required
        />

        {/* =====================================
            PRIX ACHAT
        ===================================== */}

        <div>

          <label className="block font-semibold mb-2">
            Prix d'achat
          </label>

          <input
            type="number"
            min="0"
            className="w-full border rounded-lg p-3"
            placeholder="Prix d'achat"
            value={prixAchat}
            onChange={(e) =>
              setPrixAchat(
                e.target.value
              )
            }
            required
          />

        </div>

        {/* =====================================
            PRIX VENTE
        ===================================== */}

        <div>

          <label className="block font-semibold mb-2">
            Prix de vente
          </label>

          <input
            type="number"
            min="0"
            className="w-full border rounded-lg p-3"
            placeholder="Prix de vente"
            value={prix}
            onChange={(e) =>
              setPrix(
                e.target.value
              )
            }
            required
          />

        </div>

        {/* =====================================
            STOCK
        ===================================== */}

        <div>

          <label className="block font-semibold mb-2">
            Stock
          </label>

          <input
            type="number"
            min="0"
            className="w-full border rounded-lg p-3"
            placeholder="Stock"
            value={stock}
            onChange={(e) =>
              setStock(
                e.target.value
              )
            }
            required
          />

        </div>

        {/* =====================================
            IMAGE PRINCIPALE
        ===================================== */}

        {!produitEnEdition && (

          <div>

            <label className="block font-semibold mb-2">
              📷 Image principale
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full"
            />

          </div>

        )}

        {/* =====================================
            APERÇU IMAGE PRINCIPALE
        ===================================== */}

        {preview && (

          <div>

            <p className="font-semibold mb-2">
              Aperçu de l'image principale :
            </p>

            <img
              src={preview}
              alt="Aperçu du produit"
              className="w-40 h-40 object-cover rounded-xl border"
            />

          </div>

        )}

        {/* =====================================
            PHOTOS SUPPLÉMENTAIRES
        ===================================== */}

        {!produitEnEdition && (

          <div className="border-t pt-5">

            <label className="block font-semibold mb-2">
              📸 Photos supplémentaires
            </label>

            <p className="text-sm text-gray-500 mb-3">
              Tu peux sélectionner plusieurs photos
              du même produit.
            </p>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={
                handleImagesSupplementaires
              }
              className="w-full"
            />

          </div>

        )}

        {/* =====================================
            APERÇU PHOTOS SUPPLÉMENTAIRES
        ===================================== */}

        {previewsSupplementaires.length >
          0 && (

          <div>

            <p className="font-semibold mb-3">
              📸 Photos sélectionnées :
            </p>

            <div className="flex flex-wrap gap-4">

              {previewsSupplementaires.map(
                (photo, index) => (

                  <div
                    key={index}
                    className="relative"
                  >

                    <img
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="w-28 h-28 object-cover rounded-xl border"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        supprimerImageSelectionnee(
                          index
                        )
                      }
                      className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white w-7 h-7 rounded-full"
                    >
                      ×
                    </button>

                  </div>

                )
              )}

            </div>

          </div>

        )}

        {/* =====================================
            BOUTONS
        ===================================== */}

        <div className="flex gap-3">

          <button
            type="submit"
            disabled={chargement}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
          >

            {chargement
              ? "⏳ Enregistrement..."
              : produitEnEdition
              ? "Enregistrer les modifications"
              : "Ajouter le produit"}

          </button>

          {produitEnEdition && (

            <button
              type="button"
              onClick={annulerEdition}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
            >
              Annuler
            </button>

          )}

        </div>

      </form>

    </div>

  );
}

export default ProductForm;