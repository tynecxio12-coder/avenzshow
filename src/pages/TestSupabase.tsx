import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  brand: string | null;
};

export default function TestSupabase() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (!error && data) {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={{ padding: "20px", color: "white", background: "#111", minHeight: "100vh" }}>
      <h1>Supabase Test</h1>

      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: "30px" }}>
          <h2>{product.name}</h2>
          <p>{product.brand}</p>
          <p>৳ {product.price}</p>

          {product.image_url && (
            <img
              src={product.image_url}
              alt={product.name}
              width="250"
              style={{ borderRadius: "12px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
