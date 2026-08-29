const API = "http://localhost:3001/api/utilisateurs";

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