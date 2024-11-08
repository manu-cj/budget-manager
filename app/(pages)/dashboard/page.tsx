"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/protected");

        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
        } else if (response.status === 401) {
          const data = await response.json();
          setError(data.error);
          router.push("/auth");
        } else {
          const data = await response.json();
          setError(data.error || "Erreur inconnue");
        }
      } catch {
        setError("Erreur lors de la requête");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div>
      <h1>Page protégée</h1>
      {loading && <p>Chargement...</p>}
      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
