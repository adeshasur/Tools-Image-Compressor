"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileImage, 
  UploadCloud, 
  Download, 
  X, 
  Zap, 
  CheckCircle2, 
  Scaling, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [compressing, setCompressing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setOriginalFile(file);
      setCompressedFile(null);
      // Auto-compress on first drop
      processCompression(file, quality);
    }
  };

  const processCompression = async (file, q) => {
    if (!file) return;
    setCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: q,
      };
      const compressedBlob = await imageCompression(file, options);
      const newFile = new File([compressedBlob], file.name, {
        type: file.type,
      });
      setCompressedFile(newFile);
    } catch (error) {
      console.error("Compression error:", error);
    } finally {
      setCompressing(false);
    }
  };

  const handleQualityChange = (newQ) => {
    setQuality(newQ);
    if (originalFile) {
      processCompression(originalFile, newQ);
    }
  };

  const downloadImage = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed-${originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const savingsPercent = originalFile && compressedFile 
    ? Math.round(((originalFile.size - compressedFile.size) / originalFile.size) * 100)
    : 0;

  return (
    <div className="relative flex flex-col min-h-screen">
      <div className="noise-mask" />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-8 md:px-12 md:py-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center text-white shadow-glass">
              <Scaling className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold tracking-tight text-ink">Image Compressor</h1>
              <p className="text-xs text-ink/40 font-medium uppercase tracking-[0.2em] mt-0.5">Elite Productivity Tool</p>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-ink/5 bg-white/40 backdrop-blur-sm text-[11px] font-bold text-ink/60">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            CLIENT-SIDE PRIVACY
          </div>
        </div>
      </header>

      {/* Main UI */}
      <main className="relative z-10 flex-grow px-6 pb-12 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          
          {/* Left: Input & Controls */}
          <section className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative group h-[400px] flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed transition-all duration-500 overflow-hidden ${
                dragActive ? "border-gold bg-gold/5 scale-[0.99]" : "border-ink/10 bg-white/40 hover:border-ink/20"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                const file = e.dataTransfer.files[0];
                handleFile(file);
              }}
            >
              {originalFile ? (
                <div className="absolute inset-0">
                  <img 
                    src={URL.createObjectURL(originalFile)} 
                    className="w-full h-full object-contain opacity-20 blur-sm scale-110" 
                    alt="Background"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-white shadow-glass flex items-center justify-center text-ink mb-4">
                      <FileImage className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-semibold text-ink/60 mb-2 truncate max-w-xs">{originalFile.name}</p>
                    <button 
                      onClick={() => setOriginalFile(null)}
                      className="px-6 py-2 rounded-full border border-ink/10 bg-white/80 text-xs font-bold text-ink/40 hover:bg-white hover:text-ink/60 transition-all"
                    >
                      REMOVE IMAGE
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-10">
                  <div className="w-20 h-20 rounded-[2rem] bg-ink flex items-center justify-center text-white mb-6 shadow-glass group-hover:scale-110 transition-transform duration-500">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-display font-medium text-ink mb-2">Drag & drop your imagery</h2>
                  <p className="text- ink/40 text-sm max-w-[280px] leading-relaxed">
                    Choose high-resolution JPG or PNG assets to optimize for performance.
                  </p>
                  <input 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>
              )}
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="glass-panel rounded-3xl p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-ink/40">Master Quality</h3>
                <span className="text-xs font-extrabold text-gold">{Math.round(quality * 100)}% Fidelity</span>
              </div>
              
              <div className="relative h-2 w-full bg-ink/5 rounded-full mb-10">
                <input 
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.01"
                  value={quality}
                  onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <motion.div 
                  className="absolute left-0 top-0 h-full bg-ink rounded-full"
                  initial={false}
                  animate={{ width: `${(quality - 0.1) / 0.8 * 100}%` }}
                />
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-ink rounded-full shadow-md"
                  initial={false}
                  animate={{ left: `${(quality - 0.1) / 0.8 * 100}%` }}
                  style={{ marginLeft: -8 }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { l: "High", v: 0.8 },
                  { l: "Medium", v: 0.5 },
                  { l: "Extreme", v: 0.2 }
                ].map((p) => (
                  <button
                    key={p.l}
                    onClick={() => handleQualityChange(p.v)}
                    className={`py-3 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all ${
                      quality === p.v 
                        ? "bg-ink text-white shadow-glass" 
                        : "bg-ink/5 text-ink/40 hover:bg-ink/10"
                    }`}
                  >
                    {p.l}
                  </button>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Right: Results Card */}
          <aside className="relative">
            <AnimatePresence mode="wait">
              {originalFile ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="lg:sticky lg:top-12 space-y-6"
                >
                  <div className="glass-soft rounded-[2.5rem] p-10 flex flex-col items-center">
                    <div className="relative w-48 h-48 bg-ink/5 rounded-3xl overflow-hidden mb-10 group">
                      {compressedFile && (
                        <img 
                          src={URL.createObjectURL(compressedFile)} 
                          className="w-full h-full object-cover" 
                          alt="Compressed Preview"
                        />
                      )}
                      {compressing && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                          <Zap className="w-8 h-8 text-gold animate-pulse" />
                        </div>
                      )}
                    </div>

                    <div className="w-full space-y-6 mb-10">
                      <div className="flex items-center justify-between pb-4 border-b border-ink/5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Input Size</span>
                        <span className="text-sm font-semibold text-ink/60">{formatSize(originalFile.size)}</span>
                      </div>
                      <div className="flex items-center justify-between pb-4 border-b border-ink/5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Output Size</span>
                        <span className="text-sm font-semibold text-ink/80">{compressedFile ? formatSize(compressedFile.size) : "Calculating..."}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Total Savings</span>
                        <div className="flex items-center gap-1.5 text-gold font-display font-bold text-lg">
                          -{savingsPercent}%
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={downloadImage}
                      disabled={!compressedFile || compressing}
                      className="w-full h-16 rounded-2xl bg-ink text-white font-bold text-sm flex items-center justify-center gap-3 shadow-glass hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      {compressing ? "Optimizing..." : "Download Ready"}
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="px-8 py-6 rounded-3xl border border-gold/10 bg-gold/5 flex gap-4">
                     <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center text-gold shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                     </div>
                     <p className="text-[13px] leading-relaxed text-gold/80 font-medium">
                        Optimization successful. Your results are generated entirely in RAM for security.
                     </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-soft rounded-[2.5rem] p-10 h-full min-h-[500px] flex flex-col items-center justify-center text-center opacity-40 grayscale"
                >
                   <FileImage className="w-12 h-12 mb-6" />
                   <p className="text-xs font-bold uppercase tracking-widest">Awaiting Input</p>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

        </div>
      </main>

      <footer className="relative z-10 px-12 py-10 opacity-20 hover:opacity-100 transition-opacity">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-t border-ink/5 pt-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest">
            © 2026 Adheesha Sooriyaarachchi
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-extrabold uppercase tracking-widest hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="text-[10px] font-extrabold uppercase tracking-widest hover:text-gold transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
