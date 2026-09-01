const API = import.meta.env.PROD
  ? "https://gestion-boutique-2qu3.onrender.com/api/dashboard"
  : "http://localhost:3001/api/dashboard";

export async function getDashboard() {
  const response = await fetch(API);
  return response.json();
}