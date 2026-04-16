"use client";

import { useState, useCallback, useEffect } from "react";
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
  ArrowRight,
  Monitor,
  ShieldCheck
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
      processCompression(file, quality);
    }
  };

  const processCompression = async (file, q) => {
    if (!file) return;
    setCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 2560,
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
    link.download = `elite-compressed-${originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const savingsPercent = originalFile && compressedFile 
    ? Math.round(((originalFile.size - compressedFile.size) / originalFile.size) * 100)
    : 0;

  return (
    <div className="relative flex flex-col min-h-screen selection:bg-gold/20 selection:text-gold selection:font-bold">
      {/* Background Layers */}
      <div className="fixed inset-0 z-0 bg-white/40" />
      <div 
        className="tools-grid-animated fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(17,24,39,0.06) 1.2px, transparent 1.2px), linear-gradient(90deg, rgba(17,24,39,0.06) 1.2px, transparent 1.2px)",
          backgroundSize: "42px 42px"
        }}
      />
      <div className="noise-mask fixed inset-0 z-[1]" />
      
      {/* Header */}
      <header className="relative z-10 px-6 py-10 md:px-12 md:py-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink/5 bg-white/70 backdrop-blur-md text-[10px] font-extrabold tracking-[0.2em] text-gold uppercase shadow-sm">
              <Sparkles className="w-3 h-3" />
              Creative Utility
            </div>
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-ink flex items-center justify-center text-white shadow-glass rotate-[-4deg]">
                  <Scaling className="w-7 h-7" />
               </div>
               <div>
                  <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-[-0.06em] text-ink">Image Compressor</h1>
                  <p className="text-sm text-ink/40 font-bold uppercase tracking-[0.3em] mt-1">High-Fidelity Assets</p>
               </div>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-gold/10 bg-gold/5 backdrop-blur-md text-[11px] font-bold text-gold/80 shadow-inner">
            <ShieldCheck className="w-4 h-4" />
            LOCAL-FIRST ENCRYPTION
          </div>
        </div>
      </header>

      {/* Main UI */}
      <main className="relative z-10 flex-grow px-6 pb-20 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 items-start">
          
          {/* Left Side: Drag & Drop + Controls */}
          <section className="space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`relative group h-[480px] flex flex-col items-center justify-center rounded-[3rem] border border-ink/5 transition-all duration-700 overflow-hidden holographic-grain border-glow-luminous shadow-glass bg-white/60 ${
                dragActive ? "scale-[0.98] bg-gold/5" : ""
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
                <div className="absolute inset-0 flex flex-col">
                  <div className="absolute inset-0 z-0">
                    <img 
                      src={URL.createObjectURL(originalFile)} 
                      className="w-full h-full object-cover opacity-10 blur-2xl scale-125 transition-transform duration-1000 group-hover:scale-110" 
                      alt="Background"
                    />
                  </div>
                  <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-12">
                     <div className="w-24 h-24 rounded-[2rem] bg-white shadow-glass flex items-center justify-center text-ink mb-6 border border-ink/5 group-hover:rotate-6 transition-transform">
                        <FileImage className="w-10 h-10" />
                     </div>
                     <h3 className="text-lg font-display font-semibold text-ink mb-2 truncate max-w-sm">{originalFile.name}</h3>
                     <p className="text-xs font-bold text-ink/40 uppercase tracking-widest mb-8">{formatSize(originalFile.size)} FILE</p>
                     
                     <div className="flex gap-4">
                        <button 
                           onClick={() => setOriginalFile(null)}
                           className="px-8 py-3 rounded-2xl border border-ink/10 bg-white/90 text-[11px] font-extrabold text-ink/60 hover:bg-white hover:text-ink transition-all shadow-sm"
                        >
                           REPLACE
                        </button>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-12">
                   <div className="relative mb-8">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-ink flex items-center justify-center text-white shadow-[0_24px_50px_rgba(17,24,39,0.3)] group-hover:scale-110 group-hover:rotate-[8deg] transition-all duration-700">
                         <UploadCloud className="w-10 h-10" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white shadow-md animate-bounce">
                         <Sparkles className="w-4 h-4" />
                      </div>
                   </div>
                   <h2 className="text-3xl font-display font-semibold text-ink mb-4 tracking-[-0.04em]">Ingest your imagery</h2>
                   <p className="text-ink/40 text-[15px] font-medium max-w-[320px] leading-relaxed mb-10">
                      Drag high-resolution assets here to begin the optimization cycle.
                   </p>
                   <div className="relative">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        onChange={(e) => handleFile(e.target.files[0])}
                      />
                      <button className="px-10 py-4 rounded-2xl bg-white border border-ink/10 shadow-glass text-[11px] font-extrabold text-ink uppercase tracking-widest group-hover:bg-ink group-hover:text-white transition-all duration-500">
                         Browse Local
                      </button>
                   </div>
                </div>
              )}
            </motion.div>

            {/* Elite Quality Controller */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="glass-panel rounded-[2.5rem] p-10 holographic-grain border-glow-luminous"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-ink/30 mb-1">Compression Engine</h3>
                  <p className="text-xl font-display font-semibold text-ink tracking-tight">Master Fidelity</p>
                </div>
                <div className="px-5 py-2 rounded-xl bg-ink text-white font-display font-bold text-lg shadow-glass">
                   {Math.round(quality * 100)}%
                </div>
              </div>
              
              <div className="relative group/slider mb-12">
                <input 
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.01"
                  value={quality}
                  onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-ink/5 rounded-full appearance-none cursor-pointer accent-gold outline-none"
                />
                <div className="flex justify-between mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-ink/20">
                   <span>Performance</span>
                   <span>Balanced</span>
                   <span>Quality</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { l: "MAX SPEED", v: 0.2, c: "text-amber-600" },
                  { l: "BALANCED", v: 0.5, c: "text-ink/60" },
                  { l: "MAX QUALITY", v: 0.8, c: "text-gold" }
                ].map((p) => (
                  <button
                    key={p.l}
                    onClick={() => handleQualityChange(p.v)}
                    className={`h-16 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center gap-1 ${
                      Math.abs(quality - p.v) < 0.01
                        ? "bg-ink border-ink text-white shadow-glass -translate-y-1" 
                        : "bg-white/50 border-ink/5 text-ink/40 hover:bg-white hover:border-ink/10"
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-[0.15em]">{p.l}</span>
                    <span className={`text-[11px] font-extrabold ${Math.abs(quality - p.v) < 0.01 ? "text-gold/80" : "text-ink/30"}`}>{p.v * 100}%</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Right Side: Elite Summary Card */}
          <aside className="relative">
            <AnimatePresence mode="wait">
              {originalFile ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="lg:sticky lg:top-12"
                >
                  <div className="relative glass-soft rounded-[3rem] p-10 border border-ink/5 shadow-glass overflow-hidden holographic-grain border-glow-luminous bg-white/70">
                    <div className="relative w-full aspect-square bg-ink/5 rounded-[2.5rem] overflow-hidden mb-12 shadow-inner group">
                      {compressedFile && !compressing && (
                        <motion.img 
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          src={URL.createObjectURL(compressedFile)} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                          alt="Compressed Preview"
                        />
                      )}
                      
                      {compressing && (
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-4">
                           <div className="relative">
                              <Zap className="w-12 h-12 text-gold animate-pulse" />
                              <div className="absolute inset-x-[-20px] bottom-[-10px] h-1.5 bg-gold/10 rounded-full overflow-hidden">
                                 <motion.div 
                                    className="h-full bg-gold"
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                 />
                              </div>
                           </div>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Optimizing Pixels</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-8 mb-12">
                      <div className="flex items-center justify-between">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/20 mb-1">Savings</p>
                            <div className="text-4xl font-display font-bold text-gold tracking-tight">
                               -{savingsPercent}%
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink/20 mb-1">State</p>
                            <span className="inline-flex items-center h-7 px-3 rounded-full bg-ink text-white text-[10px] font-black uppercase tracking-widest">
                               PROCESSED
                            </span>
                         </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-5 rounded-3xl bg-white border border-ink/5 shadow-sm">
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-ink/30 mb-2">Source</p>
                            <p className="text-sm font-bold text-ink/60 tracking-tight">{formatSize(originalFile.size)}</p>
                         </div>
                         <div className="p-5 rounded-3xl bg-white border border-gold/10 shadow-sm">
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-gold/60 mb-2">Elite</p>
                            <p className="text-sm font-bold text-ink tracking-tight">
                               {compressedFile ? formatSize(compressedFile.size) : "..."}
                            </p>
                         </div>
                      </div>
                    </div>

                    <button
                      onClick={downloadImage}
                      disabled={!compressedFile || compressing}
                      className="group relative w-full h-20 rounded-3xl bg-ink text-white font-bold text-sm overflow-hidden shadow-[0_24px_60px_rgba(17,24,39,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      <div className="relative z-10 flex items-center justify-center gap-3">
                         {compressing ? "CALIBRATING..." : "DOWNLOAD MASTER"}
                         <Download className={`w-5 h-5 transition-transform duration-500 ${compressing ? "animate-bounce" : "group-hover:translate-y-1"}`} />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    </button>
                  </div>
                  
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="mt-6 px-8 py-6 rounded-[2rem] border border-gold/15 bg-gold/5 flex gap-4 backdrop-blur-sm"
                  >
                     <div className="w-11 h-11 rounded-2xl bg-gold/20 flex items-center justify-center text-gold shrink-0">
                        <CheckCircle2 className="w-6 h-6" />
                     </div>
                     <p className="text-[13px] leading-relaxed text-ink/60 font-medium">
                        <strong className="text-gold font-bold">Optimization Complete.</strong> High-fidelity processing applied in RAM for zero disk footprint.
                     </p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-soft rounded-[3rem] p-12 h-full min-h-[580px] flex flex-col items-center justify-center text-center holographic-grain border border-ink/5 shadow-glass bg-white/40"
                >
                   <div className="relative mb-8">
                      <Monitor className="w-16 h-16 text-ink/10" />
                      <Scaling className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-gold/20" />
                   </div>
                   <h4 className="text-xl font-display font-semibold text-ink/20 tracking-tight">System Idle</h4>
                   <p className="mt-2 text-[11px] font-black uppercase tracking-[0.3em] text-ink/10">Awaiting asset link</p>
                </motion.div>
              )}
            </AnimatePresence>
          </aside>

        </div>
      </main>

      <footer className="relative z-10 px-12 py-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 border-t border-ink/5 pt-16 mt-16">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-ink/5 flex items-center justify-center text-ink/20 font-display font-bold">IC</div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/30">
               © 2026 Adheesha Sooriyaarachchi
             </p>
          </div>
          <div className="flex gap-10">
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 hover:text-gold transition-colors">Privacy Matrix</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/20 hover:text-gold transition-colors">Elite Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
