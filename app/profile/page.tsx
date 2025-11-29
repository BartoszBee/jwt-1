"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔵 Pobieramy dane użytkownika z backendu (API protected)
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setUser(data.user);
      setLoading(false);
    }

    fetchUser();
  }, [router]);

  // 🔴 Wylogowanie
  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
  }

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 border rounded-lg shadow text-center">
        <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>

        <p className="mb-2">
          <strong>Email:</strong> {user?.email ?? "nieznany"}
        </p>

        <p className="mb-2">
          <strong>Role:</strong> {user?.role ?? "nieznany"}
        </p>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
        <Link
        href="/"
        className="block mt-4 text-blue-600 hover:underline text-sm"
      >
        ← Back to Home
      </Link>
      </div>
      
    </div>
  );
}
