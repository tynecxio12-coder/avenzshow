import { useEffect, useState } from "react";

export default function TestSupabase() {
  const [result, setResult] = useState("Loading...");

  useEffect(() => {
    const run = async () => {
      try {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const res = await fetch(`${url}/rest/v1/`, {
          method: "GET",
          headers: {
            apikey: key,
          },
        });

        const text = await res.text();
        setResult(`Status: ${res.status} | Body: ${text}`);
      } catch (err: any) {
        setResult(`Fetch failed: ${err.message}`);
      }
    };

    run();
  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h1>Supabase Test</h1>
      <p>URL: {import.meta.env.VITE_SUPABASE_URL ? "Loaded" : "Missing"}</p>
      <p>KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? "Loaded" : "Missing"}</p>
      <p>{result}</p>
    </div>
  );
}
