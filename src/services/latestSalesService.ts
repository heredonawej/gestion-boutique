const API = "https://gestion-boutique-2qu3.onrender.com/api/dashboard/latest-sales";

export async function getLatestSales() {
  const response = await fetch(API);
  return response.json();
}