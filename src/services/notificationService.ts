export interface Notification {
  id: number;
  commande_id: number;
  statut: string;
  message: string;
  lu: number;
  date_notification: string;
}

const API =
  "https://gestion-boutique-2qu3.onrender.com/api/notifications";

export async function getNotifications(
  commandeId: number
): Promise<Notification[]> {

  const response = await fetch(
    `${API}/${commandeId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération des notifications."
    );
  }

  return data;
}
export async function getNotificationsClient(
  telephone: string
): Promise<Notification[]> {

  const response = await fetch(
    `${API}/client/${encodeURIComponent(telephone)}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la récupération des notifications."
    );
  }

  return data;
}
export async function marquerNotificationCommeLue(
  id: number
): Promise<void> {

  const response = await fetch(
    `${API}/${id}/lue`,
    {
      method: "PUT",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erreur lors de la mise à jour de la notification."
    );
  }
}