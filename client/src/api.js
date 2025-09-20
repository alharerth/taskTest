export const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL); // should log correctly

export const getLinks = async () => {
  const res = await fetch(`${API_URL}/api/links`);
  if (!res.ok) throw new Error("Failed to fetch links");
  return res.json();
};

export const createLink = async ({ target, slug }) => {
  const res = await fetch(`${API_URL}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target, slug }),
  });
  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || "Failed to create link");
  }
  return res.json();
};
