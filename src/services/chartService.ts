const API = "http://https://gestion-boutique-2qu3.onrender.com/api/dashboard/chart";

export async function getChartData() {
  const response = await fetch(API);
  return response.json();
}