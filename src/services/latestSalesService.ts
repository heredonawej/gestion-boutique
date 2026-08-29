const API = "http://localhost:3001/api/dashboard/latest-sales";

export async function getLatestSales() {
  const response = await fetch(API);
  return response.json();
}