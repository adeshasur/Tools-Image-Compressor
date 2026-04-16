"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { 
  UploadCloud, 
  Download, 
  ArrowLeft,
  Settings,
  Image as ImageIcon,
  Zap,
  Info
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
      const newFile = new File([compressedBlob], file.name, { type: file.type });
      setCompressedFile(newFile);
    } catch (error) {
      console.error("Compression error:", error);
    } finally {
      setCompressing(false);
    }
  };

  const downloadImage = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = `optimized-${originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] font-sans selection:bg-blue-100">
      {/* Precision Background Grid */}
      <div 
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#000 1.2px, transparent 1.2px), linear-gradient(90deg, #000 1.2px, transparent 1.2px)",
          backgroundSize: "18px 18px"
        }}
      />

      {/* Floating Suite Navbar */}
      <nav className="relative z-10 max-w-4xl mx-auto pt-10 px-4">
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-2xl border border-white/40 px-8 py-5 rounded-[40px] shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
          <span className="text-[15px] font-semibold text-gray-900">Adheesha Sooriyaarachchi</span>
          <a 
            href="https://info-adheesha.vercel.app/"
            className="flex items-center gap-2 bg-gray-900 text-white text-[13px] font-medium px-6 py-2.5 rounded-full hover:bg-black transition-all shadow-md active:scale-95"
          >
            Back to Portfolio
          </a>
        </div>
      </nav>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left: Input Skeleton */}
          <div className="flex-1 md:pr-16 md:border-r border-gray-200 flex flex-col pt-4">
            <div className="mb-10">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.24em] mb-2">Original Asset</h2>
              <p className="text-sm text-gray-400 font-medium">Auto-calibrating while you adjust.</p>
            </div>

            <div 
              className={`flex-grow relative group flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed transition-all duration-500 ${
                dragActive ? "border-blue-400 bg-blue-50/20 scale-[0.99]" : "border-gray-200/60 hover:border-gray-300"
              } ${originalFile ? "bg-white/40" : "bg-white/5"}`}
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
                <div className="text-center p-8 w-full h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 border border-gray-50 group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[240px] mb-1">{originalFile.name}</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-10">{formatSize(originalFile.size)}</p>
                  
                  <button 
                    onClick={() => setOriginalFile(null)}
                    className="text-[10px] font-black uppercase tracking-[0.24em] text-red-400 hover:text-red-500 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              ) : (
                <div className="text-center p-8 flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-8 h-8 text-gray-200" />
                  </div>
                  <p className="text-sm font-medium text-gray-400 mb-10 max-w-[200px] leading-relaxed">
                    Drop asset here or browse your local system.
                  </p>
                  <label className="relative overflow-hidden group/btn px-10 py-4 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400 cursor-pointer hover:bg-gray-50 hover:text-gray-600 transition-all shadow-sm">
                    <span>Browse Local</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleFile(e.target.files[0])} 
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center gap-4 text-gray-400 opacity-60">
               <Info className="w-4 h-4 shrink-0" />
               <p className="text-xs font-medium leading-relaxed">Localized processing. Your data never leaves this device.</p>
            </div>
          </div>

          {/* Right: Optimization Flow */}
          <div className="flex-1 md:pl-16 flex flex-col pt-4">
            <div className="mb-12">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.24em] mb-2">Live Optimization</h2>
              <p className="text-sm text-gray-400 font-medium">Fine-tune the output fidelity matrix.</p>
            </div>

            <div className="space-y-12 flex-grow">
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-400">Quality Preset</span>
                     <span className="text-base font-bold text-gray-900">{Math.round(quality * 100)}%</span>
                  </div>
                  <input 
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.01"
                    value={quality}
                    onChange={(e) => {
                      const newQ = parseFloat(e.target.value);
                      setQuality(newQ);
                      if (originalFile) processCompression(originalFile, newQ);
                    }}
                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.24em] text-gray-300">
                    <span>Performance</span>
                    <span>Balanced</span>
                    <span>High Fidelity</span>
                  </div>
               </div>

               <div className="p-8 rounded-[2.5rem] border border-gray-200/60 bg-white/20 space-y-6">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-300 mb-1">Savings</p>
                        <div className="text-4xl font-bold text-gray-900 tracking-tight">
                           {originalFile && compressedFile ? `-${Math.round(((originalFile.size - compressedFile.size) / originalFile.size) * 100)}%` : "--"}
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-300 mb-2">Status</p>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.24em] px-4 py-2 rounded-full ${compressedFile && !compressing ? "bg-black text-white" : "bg-gray-100 text-gray-300"}`}>
                           {compressing ? "CALIBRATING..." : compressedFile ? "PROCESSED" : "IDLE"}
                        </span>
                     </div>
                  </div>
                  
                  <div className="pt-8 border-t border-gray-100 grid grid-cols-2 gap-8">
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-300 mb-1">Original</p>
                        <p className="text-sm font-bold text-gray-400 tracking-tight">{originalFile ? formatSize(originalFile.size) : "--"}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-300 mb-1">Optimized</p>
                        <p className="text-sm font-bold text-gray-900 tracking-tight">{compressedFile ? formatSize(compressedFile.size) : "--"}</p>
                     </div>
                  </div>
               </div>
            </div>

            <button
               onClick={downloadImage}
               disabled={!compressedFile || compressing}
               className="mt-12 w-full h-16 bg-black text-white rounded-3xl flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-[0.18em] shadow-xl shadow-black/10 hover:shadow-2xl hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-20 disabled:translate-y-0 disabled:shadow-none"
            >
               {compressing ? "Optimizing..." : "Download Optimized Asset"}
               <Download className="w-5 h-5 transition-transform group-hover:translate-y-1" />
            </button>
          </div>

        </div>
      </main>

      <footer className="text-center py-20 opacity-20">
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-500">
           © 2026 Adheesha Sooriyaarachchi • Built for Productivity
        </p>
      </footer>
    </div>
  );
}
