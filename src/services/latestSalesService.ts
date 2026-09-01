const API = import.meta.env.PROD
  ? "https://gestion-boutique-2qu3.onrender.com/api/dashboard/latest-sales"
  : "http://localhost:3001/api/dashboard/latest-sales";

export async function getLatestSales() {
  const response = await fetch(API);
  return response.json();
}