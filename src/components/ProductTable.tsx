import { useEffect, useState } from "react";

import type { Produit } from "../types/Produit";

import {
  getImagesProduit,
  ajouterImageProduit,
  supprimerImageProduit,
  type ProduitImage,
} from "../services/imageService";
import API_URL from "../config";

interface ProductTableProps {
  produits: Produit[];
  onSupprimer: (id: number) => void;
  onModifier: (produit: Produit) => void;
}

function ProductTable({
  produits,
  onSupprimer,
  onModifier,
}: ProductTableProps) {

  const utilisateur = JSON.parse(
    localStorage.getItem("utilisateur") || "{}"
  );

  // ==========================================
  // PRODUIT SÉLECTIONNÉ POUR LES PHOTOS
  // ==========================================

  const [produitPhotos, setProduitPhotos] =
    useState<Produit | null>(null);

  const [images, setImages] =
    useState<ProduitImage[]>([]);

  const [chargementPhotos, setChargementPhotos] =
    useState(false);

  const [fichiers, setFichiers] =
    useState<File[]>([]);

  const [previews, setPreviews] =
    useState<string[]>([]);

  const [ajoutPhotos, setAjoutPhotos] =
    useState(false);

  // ==========================================
  // CHARGER LES PHOTOS
  // ==========================================

  const ouvrirGestionPhotos = async (
    produit: Produit
  ) => {

    setProduitPhotos(produit);

    setImages([]);

    setFichiers([]);

    setPreviews([]);

    setChargementPhotos(true);

    try {

      const data =
        await getImagesProduit(
          produit.id
        );

      setImages(data);

    } catch (error) {

      console.error(error);

      alert(
        "Impossible de charger les photos."
      );

    } finally {

      setChargementPhotos(false);

    }
  };

  // ==========================================
  // FERMER
  // ==========================================

  const fermerGestionPhotos = () => {

    setProduitPhotos(null);

    setImages([]);

    setFichiers([]);

    setPreviews([]);

    setAjoutPhotos(false);

  };

  // ==========================================
  // SÉLECTIONNER PLUSIEURS PHOTOS
  // ==========================================

  const handleSelectionPhotos = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files?.length) {
      return;
    }

    const nouveauxFichiers =
      Array.from(e.target.files);

    setFichiers(nouveauxFichiers);

    const nouveauxPreviews =
      nouveauxFichiers.map(
        (file) =>
          URL.createObjectURL(file)
      );

    setPreviews(nouveauxPreviews);

  };

  // ==========================================
  // ANNULER LA SÉLECTION
  // ==========================================

  const annulerSelection = () => {

    setFichiers([]);

    setPreviews([]);

  };

  // ==========================================
  // AJOUTER LES PHOTOS
  // ==========================================

  const enregistrerPhotos = async () => {

    if (!produitPhotos) {
      return;
    }

    if (fichiers.length === 0) {

      alert(
        "Sélectionne au moins une photo."
      );

      return;
    }

    try {

      setAjoutPhotos(true);

      for (const fichier of fichiers) {

        await ajouterImageProduit(
          produitPhotos.id,
          fichier
        );

      }

      // Recharger les photos
      const nouvellesImages =
        await getImagesProduit(
          produitPhotos.id
        );

      setImages(nouvellesImages);

      setFichiers([]);

      setPreviews([]);

      alert(
        "Photos ajoutées avec succès."
      );

    } catch (error) {

      console.error(error);

      alert(
        "Erreur lors de l'ajout des photos."
      );

    } finally {

      setAjoutPhotos(false);

    }

  };

  // ==========================================
  // SUPPRIMER UNE PHOTO
  // ==========================================

  const supprimerPhoto = async (
    image: ProduitImage
  ) => {

    if (!produitPhotos) {
      return;
    }

    const confirmation =
      window.confirm(
        "Voulez-vous vraiment supprimer cette photo ?"
      );

    if (!confirmation) {
      return;
    }

    try {

      await supprimerImageProduit(
        produitPhotos.id,
        image.id
      );

      setImages(
        (ancien) =>
          ancien.filter(
            (photo) =>
              photo.id !== image.id
          )
      );

      alert(
        "Photo supprimée avec succès."
      );

    } catch (error) {

      console.error(error);

      alert(
        "Impossible de supprimer la photo."
      );

    }

  };

  // ==========================================
  // NETTOYAGE DES URL PREVIEW
  // ==========================================

  useEffect(() => {

    return () => {

      previews.forEach(
        (preview) =>
          URL.revokeObjectURL(preview)
      );

    };

  }, [previews]);

  // ==========================================
// DÉFINIR UNE PHOTO COMME PRINCIPALE
// ==========================================

const definirPhotoPrincipale = async (
  image: ProduitImage
) => {

  if (!produitPhotos) {
    return;
  }

  const confirmation = window.confirm(
    "Définir cette photo comme photo principale ?"
  );

  if (!confirmation) {
    return;
  }

  try {

    const token =
      localStorage.getItem("token");

    const response = await fetch(
  `${API_URL}/api/produits/${produitPhotos.id}/images/${image.id}/principale`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        "Impossible de modifier la photo principale."
      );
    }

    alert(data.message);

    // Fermer puis rouvrir les données
    // avec la nouvelle organisation
    const nouvellesImages =
      await getImagesProduit(
        produitPhotos.id
      );

    setImages(nouvellesImages);

  } catch (error) {

    console.error(error);

    alert(
      "Erreur lors du changement de photo principale."
    );

  }
};

  return (

    <>

      {/* ======================================
          TABLEAU
      ====================================== */}

      <div className="bg-white shadow-xl rounded-2xl p-6 mt-8">

        <h2 className="text-2xl font-bold mb-6">
          📦 Liste des produits
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-4">
                  Photo
                </th>

                <th className="p-4">
                  Nom
                </th>

                <th className="p-4">
                  Catégorie
                </th>

                <th className="p-4">
                  Prix d'achat
                </th>

                <th className="p-4">
                  Prix de vente
                </th>

                <th className="p-4">
                  Bénéfice
                </th>

                <th className="p-4">
                  Stock
                </th>

                <th className="p-4">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {produits.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="text-center py-8 text-gray-500"
                  >
                    Aucun produit enregistré.
                  </td>

                </tr>

              ) : (

                produits.map((produit) => {

                  const prixAchat =
                    Number(
                      produit.prix_achat || 0
                    );

                  const prixVente =
                    Number(
                      produit.prix || 0
                    );

                  const benefice =
                    prixVente - prixAchat;

                  return (

                    <tr
                      key={produit.id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      {/* PHOTO */}

                      <td className="p-3 text-center">

                        {produit.image ? (

                          <img
  src={`${API_URL}/uploads/${produit.image}`}
  alt={produit.nom}
  className="w-16 h-16 object-cover rounded-lg mx-auto"
/>

                        ) : (

                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto">
                            📦
                          </div>

                        )}

                      </td>

                      {/* NOM */}

                      <td className="p-3 font-semibold">
                        {produit.nom}
                      </td>

                      {/* CATÉGORIE */}

                      <td className="p-3">
                        {produit.categorie}
                      </td>

                      {/* PRIX ACHAT */}

                      <td className="p-3">
                        {prixAchat.toLocaleString()} FC
                      </td>

                      {/* PRIX VENTE */}

                      <td className="p-3 font-semibold">
                        {prixVente.toLocaleString()} FC
                      </td>

                      {/* BÉNÉFICE */}

                      <td className="p-3">

                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            benefice > 0
                              ? "bg-green-500"
                              : benefice < 0
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {benefice.toLocaleString()} FC
                        </span>

                      </td>

                      {/* STOCK */}

                      <td className="p-3">

                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            produit.stock <= 5
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        >
                          {produit.stock}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="p-3">

                        {utilisateur.role === "admin" && (

                          <div className="flex flex-wrap gap-2">

                            {/* PHOTOS */}

                            <button
                              onClick={() =>
                                ouvrirGestionPhotos(
                                  produit
                                )
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
                            >
                              📸 Photos
                            </button>

                            {/* MODIFIER */}

                            <button
                              onClick={() =>
                                onModifier(
                                  produit
                                )
                              }
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded"
                            >
                              Modifier
                            </button>

                            {/* SUPPRIMER */}

                            <button
                              onClick={() =>
                                onSupprimer(
                                  produit.id
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                            >
                              Supprimer
                            </button>

                          </div>

                        )}

                      </td>

                    </tr>

                  );

                })

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ======================================
          MODAL PHOTOS
      ====================================== */}

      {produitPhotos && (

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">

            {/* HEADER MODAL */}

            <div className="flex justify-between items-center p-6 border-b">

              <div>

                <h2 className="text-2xl font-bold">
                  📸 Photos du produit
                </h2>

                <p className="text-gray-500 mt-1">
                  {produitPhotos.nom}
                </p>

              </div>

              <button
                onClick={fermerGestionPhotos}
                className="text-gray-500 hover:text-red-600 text-3xl"
              >
                ×
              </button>

            </div>

            <div className="p-6">

              {/* CHARGEMENT */}

              {chargementPhotos ? (

                <div className="text-center py-10">

                  <p className="text-gray-500">
                    ⏳ Chargement des photos...
                  </p>

                </div>

              ) : (

                <>

                  {/* PHOTOS EXISTANTES */}

                  <div>

                    <h3 className="text-lg font-bold mb-4">
                      Photos existantes
                    </h3>

                    {images.length === 0 ? (

                      <div className="bg-gray-100 rounded-xl p-8 text-center">

                        <p className="text-gray-500">
                          Aucune photo supplémentaire.
                        </p>

                      </div>

                    ) : (

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">

                        {images.map(
  (image) => (

    <div
      key={image.id}
      className="relative group"
    >

      <img
  src={`${API_URL}/uploads/${image.image}`}
  alt="Photo produit"
  className="w-full h-40 object-cover rounded-xl border"
/>

      {/* Bouton photo principale */}

      <button
        type="button"
        onClick={() =>
          definirPhotoPrincipale(image)
        }
        title="Définir comme photo principale"
        className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600 text-white w-9 h-9 rounded-full"
      >
        ⭐
      </button>

      {/* Bouton supprimer */}

      <button
        type="button"
        onClick={() =>
          supprimerPhoto(image)
        }
        title="Supprimer cette photo"
        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white w-9 h-9 rounded-full"
      >
        🗑️
      </button>

    </div>

  )
)}
                      </div>

                    )}

                  </div>

                  {/* AJOUT */}

                  <div className="border-t mt-8 pt-6">

                    <h3 className="text-lg font-bold mb-4">
                      ➕ Ajouter des photos
                    </h3>

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={
                        handleSelectionPhotos
                      }
                      className="w-full border rounded-lg p-3"
                    />

                  </div>

                  {/* APERÇU */}

                  {previews.length > 0 && (

                    <div className="mt-6">

                      <h3 className="font-bold mb-3">
                        Aperçu
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                        {previews.map(
                          (preview, index) => (

                            <img
                              key={index}
                              src={preview}
                              alt={`Aperçu ${index + 1}`}
                              className="w-full h-32 object-cover rounded-xl border"
                            />

                          )
                        )}

                      </div>

                    </div>

                  )}

                  {/* BOUTONS */}

                  {fichiers.length > 0 && (

                    <div className="flex gap-3 mt-6">

                      <button
                        type="button"
                        onClick={
                          enregistrerPhotos
                        }
                        disabled={ajoutPhotos}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
                      >
                        {ajoutPhotos
                          ? "⏳ Ajout..."
                          : "📸 Enregistrer les photos"}
                      </button>

                      <button
                        type="button"
                        onClick={
                          annulerSelection
                        }
                        disabled={ajoutPhotos}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
                      >
                        Annuler
                      </button>

                    </div>

                  )}

                </>

              )}

            </div>

            {/* FOOTER */}

            <div className="border-t p-6 flex justify-end">

              <button
                onClick={
                  fermerGestionPhotos
                }
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg"
              >
                Fermer
              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );
}

export default ProductTable;