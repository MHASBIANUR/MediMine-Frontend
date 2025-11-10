"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API } from "@/lib/api";
import type { User } from "@/types/user";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get<{ user: User }>("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500/90 backdrop-blur-md border-b border-white/20 shadow-sm z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <h1
          onClick={() => router.push(user ? "/dashboard" : "/")}
          className="text-2xl font-extrabold text-white cursor-pointer hover:text-yellow-200 transition-colors"
        >
          MediMine 🧬
        </h1>

        <div className="flex items-center gap-5">
          {loading ? (
            <span className="text-sm italic text-white/80">Loading...</span>
          ) : user ? (
            <>
              <div className="flex items-center gap-2 bg-white/30 text-white px-4 py-1.5 rounded-full shadow-sm">
                <span className="text-sm font-medium">
                  👋 Hi, <strong>{user.username}</strong>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
