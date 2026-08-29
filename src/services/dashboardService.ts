const API = "http://https://gestion-boutique-2qu3.onrender.com/api/dashboard";

export async function getDashboard() {
  const response = await fetch(API);
  return response.json();
}