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
    const fetchProducts = async () => {
      try {
        console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
        console.log("Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY);

        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, image_url, brand");

        console.log("DATA:", data);
        console.log("ERROR:", error);

        if (error) {
          setErrorMessage(error.message);
        } else {
          setProducts(data || []);
        }
      } catch (err: any) {
        console.error("CATCH ERROR:", err);
        setErrorMessage(err.message || "Unknown fetch error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
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
