const API = import.meta.env.PROD
  ? "https://gestion-boutique-2qu3.onrender.com/api/dashboard/chart"
  : "http://localhost:3001/api/chart";

export async function getChartData() {
  const response = await fetch(API);
  return response.json();
}