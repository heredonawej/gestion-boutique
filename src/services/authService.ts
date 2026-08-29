const API = "http://localhost:3001/api/login";

export async function login(email: string, motDePasse: string) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      motDePasse,
    }),
  });

  return response.json();
}