const API = "http://localhost:3001/api/dashboard";

export async function getDashboard() {
  const response = await fetch(API);
  return response.json();
}