const API = "http://https://gestion-boutique-2qu3.onrender.com/api/utilisateurs";

export async function supprimerUtilisateur(id: number) {
  const response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });

  return response.json();
}

export async function modifierUtilisateur(utilisateur: any) {
  const response = await fetch(`${API}/${utilisateur.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(utilisateur),
  });

  return response.json();
}