"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);

  const dropRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // === Load History dari localStorage ===
  useEffect(() => {
    const savedHistory = localStorage.getItem("medicalHistory");
    if (savedHistory) {
      setMedicalHistory(JSON.parse(savedHistory));
    }
  }, []);

  // === Upload file handler ===
  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setAiResult(null);
    setAiImage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // === Submit ke backend ===
  const handleSubmit = async () => {
    if (!prompt && !imageFile)
      return alert("Tolong isi prompt atau upload gambar dulu.");

    setLoading(true);
    try {
      const formData = new FormData();
      if (prompt) formData.append("prompt", prompt);
      if (imageFile) formData.append("image", imageFile);

      const token = localStorage.getItem("token");
      if (!token) {
        alert("Kamu belum login. Silakan login dulu.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal memproses AI");

      const data = await res.json();
      setAiResult(data.message || "Tidak ada hasil AI.");
      setAiImage(data.image_url || null);

      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
        200
      );
    } catch (err) {
      console.error(err);
      alert("Terjadi error saat memproses AI.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setPrompt("");
    setAiResult(null);
    setAiImage(null);
  };

  // === Tambahkan hasil ke Medical History ===
  const handleAddToHistory = async () => {
    if (!aiResult && !aiImage)
      return alert("Tidak ada hasil AI untuk disimpan.");

    const token = localStorage.getItem("token");
    if (!token) return alert("Kamu belum login.");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal mengambil data uploads");

      const data = await res.json();
      const latest = data.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      setMedicalHistory((prev) => {
        const updated = [latest, ...prev];
        localStorage.setItem("medicalHistory", JSON.stringify(updated));
        return updated;
      });

      handleReset();
      setModalOpen(false);
      alert("✅ Ditambahkan ke tampilan Medical History!");
    } catch (err) {
      console.error("Gagal menambahkan ke history:", err);
      alert("Terjadi kesalahan saat menambahkan ke riwayat medis.");
    }
  };

  // === Hapus hanya dari tampilan (bukan database) ===
  const handleDeleteHistory = (id: string) => {
    const updated = medicalHistory.filter((item) => item.id !== id);
    setMedicalHistory(updated);
    localStorage.setItem("medicalHistory", JSON.stringify(updated));
    alert("🗑️ Riwayat dihapus dari tampilan (database tetap aman).");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16 space-y-10">
        {/* Header */}
        <div className="bg-white/90 rounded-2xl p-10 text-gray-800 shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">
            Welcome to MediMine 👋
          </h2>
          <p className="text-gray-600 mb-10 leading-relaxed">
            Explore your AI health assistant and track your medical history seamlessly.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Assistant */}
            <div
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() => setModalOpen(true)}
            >
              <h3 className="text-lg font-semibold mb-2 text-pink-600">
                AI Assistant
              </h3>
              <p className="text-gray-600 text-sm">
                Consult AI for health analysis based on images and text.
              </p>
            </div>

            {/* Medical History */}
            <div
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              onClick={() => setHistoryOpen(true)}
            >
              <h3 className="text-lg font-semibold mb-2 text-blue-600">
                Medical History
              </h3>
              <p className="text-gray-600 text-sm">
                Your saved analyses from AI will appear here.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* === MODAL AI ASSISTANT === */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-3xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                onClick={() => {
                  setModalOpen(false);
                  handleReset();
                }}
                className="absolute top-4 right-4 text-gray-700 font-bold text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">
                AI Assistant 🧠
              </h2>

              {/* Upload + Prompt Section */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                {/* Upload Area */}
                <div
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex-1 flex flex-col gap-2 border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-pink-400 transition-colors cursor-pointer"
                  onClick={() =>
                    document.getElementById("imageInput")?.click()
                  }
                >
                  <label className="block font-semibold text-gray-700">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && handleImageUpload(e.target.files[0])
                    }
                    className="hidden"
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 h-48">
                      Drop image here or click to upload
                    </div>
                  )}
                </div>

                {/* Prompt Input */}
                <div className="flex-1 flex flex-col gap-2">
                  <label className="block font-semibold text-gray-700">
                    AI Prompt
                  </label>
                  <textarea
                    placeholder="Tulis prompt AI di sini..."
                    className="flex-1 p-2 border rounded-lg h-32 resize-none"
                    value={prompt}
                    onChange={(e) => {
                      setPrompt(e.target.value);
                      setAiResult(null);
                      setAiImage(null);
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-pink-700 transition-all flex-1 ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Processing..." : "Submit"}
                    </button>
                    <button
                      onClick={handleReset}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-400 transition-all flex-1"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Result */}
              <AnimatePresence>
                {(aiResult || aiImage) && (
                  <motion.div
                    ref={resultRef}
                    className="mt-6 p-5 bg-gray-100 rounded-lg border shadow-md flex flex-col gap-4 max-h-[60vh] overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <h3 className="text-xl font-semibold text-blue-700">
                      AI Result
                    </h3>
                    {aiResult && (
                      <div className="whitespace-pre-wrap">{aiResult}</div>
                    )}
                    {aiImage && (
                      <img
                        src={aiImage}
                        alt="AI Result"
                        className="w-full h-64 object-contain rounded-lg"
                      />
                    )}
                    <button
                      onClick={handleAddToHistory}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-green-700 transition-all"
                    >
                      Enter into Medical History
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MODAL MEDICAL HISTORY === */}
      <AnimatePresence>
        {historyOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setHistoryOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setHistoryOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                ✖
              </button>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">
                🩺 Medical History
              </h2>

              {medicalHistory.length === 0 ? (
                <p className="text-gray-500 text-center">
                 There is no medical history.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {medicalHistory.map((item) => (
                    <div
                      key={item.id}
                      className="relative p-4 border border-gray-200 rounded-xl shadow-sm bg-gray-50"
                    >
                      <button
                        onClick={() => handleDeleteHistory(item.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                      <p className="text-gray-800">{item.ai_result}</p>
                      <p className="text-sm italic text-gray-600 mt-1">
                        Prompt: {item.prompt}
                      </p>
                      <p className="text-xs text-gray-400">
                        Created: {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
