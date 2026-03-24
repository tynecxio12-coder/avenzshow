import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number | null;
  image_url: string | null;
  brand: string | null;
};

export default function TestSupabase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

 useEffect(() => {
  const testDirectFetch = async () => {
    try {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const res = await fetch(`${url}/rest/v1/products?select=*`, {
        method: "GET",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
      });

      const text = await res.text();
      setErrorMessage(`Status: ${res.status} | Body: ${text}`);
    } catch (err: any) {
      setErrorMessage(`Fetch error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  testDirectFetch();
}, []);

  return (
    <div style={{ color: "white", padding: "20px" }}>
      <h1>Supabase Test</h1>

      <p>URL: {import.meta.env.VITE_SUPABASE_URL ? "Loaded" : "Missing"}</p>
      <p>KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? "Loaded" : "Missing"}</p>
      <p>Project URL: {import.meta.env.VITE_SUPABASE_URL || "No URL"}</p>

      {loading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: "red" }}>Error: {errorMessage}</p>}

      {!loading && !errorMessage && (
        <pre>{JSON.stringify(products, null, 2)}</pre>
      )}
    </div>
  );
}
