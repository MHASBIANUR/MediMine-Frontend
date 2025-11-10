"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/lib/api";
import AnimatedHeart3D from "@/components/AnimatedHeart3D";

// === Toast Component ===
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white ${type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
    >
      {message}
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"none" | "register" | "login">("none");
  const [form, setForm] = useState({ email: "", password: "", username: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleClick = (target: "register" | "login") => setMode(target);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      showToast("Registration successful! Please login.", "success");
      setMode("login");
      setForm({ email: "", password: "", username: "" });
    } catch (err: any) {
      showToast(err.response?.data?.error || "Registration failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser({ email: form.email, password: form.password });
      const token = data.session?.access_token;
      if (!token) throw new Error(data.error || "Token not found from server.");
      localStorage.setItem("token", token);
      showToast("Login successful!", "success");
      router.push("/dashboard");
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message;
      showToast(msg.includes("email") || msg.includes("password") ? `Login failed: ${msg}` : "Login failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-500 overflow-hidden">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-start justify-between px-6 md:px-12 py-20 gap-12">
        {/* LEFT SECTION */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col items-start gap-6"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
              Welcome To
            </h1>
            <motion.div
              className="flex items-center gap-2"
              animate={{
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 0px rgba(255,255,255,0.8)",
                  "0 0 18px rgba(255,100,150,1)",
                  "0 0 0px rgba(255,255,255,0.8)",
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-white">
                MediMine 🧬
              </h1>
            </motion.div>
          </div>

          <p className="text-white/90 text-base md:text-lg max-w-md">
            Your personal AI health companion. Explore your health data safely and easily.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <button
              onClick={() => handleClick("register")}
              className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform"
            >
              Sign Up
            </button>
            <button
              onClick={() => handleClick("login")}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-transform"
            >
              Sign In
            </button>
          </div>
        </motion.div>

        {/* RIGHT SECTION */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col items-center gap-4 relative"
        >
          {/* AnimatedHeart3D dengan animasi saat register/login */}
          <motion.div
            animate={{
              scale: mode === "none" ? 1 : 0.5,
              rotateY: mode === "none" ? 0 : 180,
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-72 h-72 md:w-96 md:h-96 flex items-center justify-center relative"
          >
            <AnimatedHeart3D />
          </motion.div>


          {/* About Section*/}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-2 max-w-[300px] text-justify shadow-sm mt-4"
          >
            <h3 className="text-white text-[20px] font-semibold mb-1 text-center">About 🧬</h3>
            <p className="text-white/80 text-[16px] leading-snug">
              AI Health is a health assistant that helps you track your health, nutrition, and
              healthy habits securely and easily.
            </p>
          </motion.div>



          {/* Form register/login*/}
          {mode !== "none" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white/30 backdrop-blur-md border border-white/40 rounded-2xl shadow-2xl p-8"
            >
              <button
                onClick={() => setMode("none")}
                className="absolute top-3 right-3 text-white font-bold text-lg"
              >
                ✕
              </button>

              {mode === "register" ? (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-6">
                    Create Account ✨
                  </h2>
                  <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                    <input type="text" placeholder="Username" className="p-2 rounded-lg bg-white/80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                    <input type="email" placeholder="Email" className="p-2 rounded-lg bg-white/80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <input type="password" placeholder="Password" className="p-2 rounded-lg bg-white/80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <button disabled={loading} className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white py-2 rounded-lg font-semibold shadow-md hover:scale-[1.02] hover:shadow-lg transition-all">
                      {loading ? "Processing..." : "Register"}
                    </button>
                  </form>
                  <p className="text-white text-sm text-center mt-4">
                    Already have an account?{" "}
                    <button onClick={() => setMode("login")} className="text-pink-500 font-semibold hover:underline">Login</button>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-6">
                    Welcome Back 👋
                  </h2>
                  <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                    <input type="email" placeholder="Email" className="p-2 rounded-lg bg-white/80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <input type="password" placeholder="Password" className="p-2 rounded-lg bg-white/80 text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <button disabled={loading} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-semibold shadow-md hover:scale-[1.02] hover:shadow-lg transition-all">
                      {loading ? "Processing..." : "Login"}
                    </button>
                  </form>
                  <p className="text-white text-sm text-center mt-4">
                    Don&apos;t have an account?{" "}
                    <button onClick={() => setMode("register")} className="text-cyan-400 font-semibold hover:underline">Register</button>
                  </p>
                </>
              )}
            </motion.div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
