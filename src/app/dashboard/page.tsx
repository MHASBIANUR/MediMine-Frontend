"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  // AI Assistant States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // History
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);

  // Refs
  const dropRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Load history on first mount
  useEffect(() => {
    const saved = localStorage.getItem("medicalHistory");
    if (saved) setMedicalHistory(JSON.parse(saved));
  }, []);

  // FILE UPLOAD
  const handleImageUpload = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Reset result every new upload
    setAiResult(null);
    setAiImage(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleImageUpload(e.dataTransfer.files[0]);
  };

  // SUBMIT TO BACKEND
  const handleSubmit = async () => {
    if (!prompt && !imageFile) return alert("Isi prompt atau upload gambar dulu.");

    setLoading(true);
    try {
      const formData = new FormData();
      if (prompt) formData.append("prompt", prompt);
      if (imageFile) formData.append("image", imageFile);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda belum login.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/analyze`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Gagal memproses AI");

      const data = await res.json();
      setAiResult(data.message || "Tidak ada hasil AI.");
      setAiImage(data.image_url || null);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err: any) {
      alert(err.message || "Error memproses AI.");
    } finally {
      setLoading(false);
    }
  };

  // RESET INPUT
  const handleReset = () => {
    setImageFile(null);
    setImagePreview(null);
    setPrompt("");
    setAiResult(null);
    setAiImage(null);
  };

  // SAVE TO HISTORY (local only)
  const handleAddToHistory = async () => {
    if (!aiResult && !aiImage) return alert("Tidak ada hasil AI.");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Anda belum login.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal mengambil data uploads");

      const data = await res.json();
      
      const latest = data.sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

      const historyItem = {
        ...latest,        
        uploaded_image: imagePreview, 
        ai_generated_image: aiImage || null,
      };

      const updated = [historyItem, ...medicalHistory];
      setMedicalHistory(updated);
      localStorage.setItem("medicalHistory", JSON.stringify(updated));

      handleReset();
      setModalOpen(false);
      alert("Berhasil ditambahkan ke Medical History!");
    } catch (err: any) {
      alert(err.message || "Tidak dapat menambahkan ke riwayat medis.");
    }
  };

  const handleDeleteHistory = (id: string) => {
    const updated = medicalHistory.filter((item) => item.id !== id);
    setMedicalHistory(updated);
    localStorage.setItem("medicalHistory", JSON.stringify(updated));
    alert("Riwayat dihapus dari tampilan (database aman).");
  };

  // RENDER SECTION
  return (
    <div className="min-h-screen w-full bg-linear-to-r from-cyan-400 via-blue-500 to-purple-500">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16 space-y-10">
        <div className="bg-white/90 rounded-2xl p-10 text-gray-800 shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">Welcome to MediMine 👋</h2>
          <p className="text-gray-600 mb-10">
            Your personal AI medical assistant & history tracker.
          </p>

          {/* MENU CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
              onClick={() => setModalOpen(true)}
            >
              <h3 className="text-lg font-semibold mb-2 text-pink-600">AI Assistant</h3>
              <p className="text-gray-600 text-sm">
                Analyze symptoms & descriptions using AI.
              </p>
            </div>

            <div
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
              onClick={() => setHistoryOpen(true)}
            >
              <h3 className="text-lg font-semibold mb-2 text-blue-600">Medical History</h3>
              <p className="text-gray-600 text-sm">View your AI analysis history.</p>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: AI ASSISTANT */}
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
              {/* CLOSE BUTTON */}
              <button
                onClick={() => {
                  setModalOpen(false);
                  handleReset();
                }}
                className="absolute top-4 right-4 text-gray-700 text-xl"
              >
                ✕
              </button>

              <h2 className="text-2xl font-bold mb-4 text-blue-700">
                AI Assistant 🧠
              </h2>

              {/* UPLOAD + PROMPT */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">

                {/* Upload */}
                <div
                  ref={dropRef}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex-1 flex flex-col gap-2 border-2 border-dashed border-gray-300 rounded-lg p-2 hover:border-pink-400 cursor-pointer transition"
                  onClick={() => document.getElementById("imageInput")?.click()}
                >
                  <label className="font-semibold text-gray-700">Upload Image</label>

                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                  />

                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        className="w-full h-48 object-contain rounded-lg"
                      />
                
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setImagePreview(null); 
                        }}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full px-2 py-1 hover:bg-black/70 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 h-48">
                      Drop image here or click to upload
                    </div>
                  )}
                </div>

                {/* Prompt */}
                <div className="flex-1 flex flex-col gap-2">
                  <label className="font-semibold text-gray-700">AI Prompt</label>
                  <textarea
                    placeholder="Tulis prompt atau gejala..."
                    className="p-2 border rounded-lg h-32 resize-none"
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
                      className={`bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md flex-1 transition ${loading ? "opacity-70" : "hover:bg-pink-700"
                        }`}
                    >
                      {loading ? "Processing..." : "Submit"}
                    </button>

                    <button
                      onClick={handleReset}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold flex-1 hover:bg-gray-400 transition"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* AI RESULT */}
              <AnimatePresence>
                {(aiResult) && (   
                  <motion.div
                    ref={resultRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-5 bg-gray-100 rounded-lg border shadow-md flex flex-col gap-4 max-h-[60vh] overflow-y-auto"
                  >
                    <h3 className="text-xl font-semibold text-blue-700">AI Result</h3>

                    {aiResult && (
                      <div className="whitespace-pre-wrap">{aiResult}</div>
                    )}

                    <button
                      onClick={handleAddToHistory}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                    >
                      Save to Medical History
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MEDICAL HISTORY */}
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
              {/* Close */}
              <button
                onClick={() => setHistoryOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
              >
                ✖
              </button>

              <h2 className="text-2xl font-bold text-blue-700 mb-4">🩺 Medical History</h2>

              {medicalHistory.length === 0 ? (
                <p className="text-gray-500 text-center">
                  There is no medical history.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {medicalHistory.map((item) => (
                    <div
                      key={item.id}
                      className="relative p-4 border rounded-xl shadow-sm bg-gray-50"
                    >
                      <button
                        onClick={() => handleDeleteHistory(item.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>

                      {item.ai_generated_image && (
                        <img
                          src={item.ai_generated_image}
                          alt="AI Generated"
                          className="w-full h-40 object-contain rounded-lg mb-3"
                        />
                      )}
        
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
