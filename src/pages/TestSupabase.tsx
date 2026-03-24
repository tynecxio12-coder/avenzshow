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
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image_url, brand");

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (error) {
        setErrorMessage(error.message);
      } else if (data) {
        setProducts(data as Product[]);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
        background: "#111",
        minHeight: "100vh",
      }}
    >
      <h1>Supabase Test</h1>

      {loading && <p>Loading products...</p>}

      {errorMessage && <p style={{ color: "red" }}>Error: {errorMessage}</p>}

      {!loading && !errorMessage && products.length === 0 && (
        <p>No products found.</p>
      )}

      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: "30px" }}>
          <h2>{product.name}</h2>
          <p>{product.brand || "No brand"}</p>
          <p>৳ {product.price ?? 0}</p>

          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              width={250}
              style={{ borderRadius: "12px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
