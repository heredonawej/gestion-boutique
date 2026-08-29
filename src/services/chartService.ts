const API = "http://localhost:3001/api/dashboard/chart";

export async function getChartData() {
  const response = await fetch(API);
  return response.json();
}