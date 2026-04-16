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
    link.download = `compressed-${originalFile.name}`;
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
      {/* Background Grid */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#000 1.2px, transparent 1.2px), linear-gradient(90deg, #000 1.2px, transparent 1.2px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Standard Adheesha Navbar */}
      <nav className="relative z-10 max-w-4xl mx-auto pt-8 px-4">
        <div className="flex items-center justify-between bg-white/70 backdrop-blur-xl border border-white/40 px-6 py-4 rounded-[2rem] shadow-sm">
          <span className="text-sm font-semibold text-gray-800">Adheesha Sooriyaarachchi</span>
          <a 
            href="https://info-adheesha.vercel.app/"
            className="flex items-center gap-2 bg-gray-900 text-white text-xs font-medium px-5 py-2.5 rounded-full hover:bg-black transition-all shadow-md active:scale-95"
          >
            Back to Portfolio
          </a>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-xl overflow-hidden min-h-[520px] flex flex-col md:flex-row">
          
          {/* Left Pane: Ingest */}
          <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col">
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Input Image</h2>
              <p className="text-xs text-gray-400 font-medium">Auto-optimization while you adjust.</p>
            </div>

            <div 
              className={`flex-grow relative group flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed transition-all duration-500 ${
                dragActive ? "border-blue-400 bg-blue-50/30 scale-[0.98]" : "border-gray-100 hover:border-gray-200"
              } ${originalFile ? "bg-white/40" : "bg-gray-50/20"}`}
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
                <div className="text-center p-6 w-full h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-gray-50">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 truncate max-w-[200px] mb-1">{originalFile.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">{formatSize(originalFile.size)}</p>
                  
                  <button 
                    onClick={() => setOriginalFile(null)}
                    className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
                  >
                    Remove Asset
                  </button>
                </div>
              ) : (
                <div className="text-center p-6 flex flex-col items-center">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6 text-gray-300" />
                  </div>
                  <p className="text-xs font-medium text-gray-400 mb-8 max-w-[150px] leading-relaxed">
                    Drop your image here or browse local files
                  </p>
                  <label className="relative overflow-hidden group/btn px-8 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer hover:bg-gray-100 hover:text-gray-600 transition-all">
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

            <div className="mt-8 flex items-center gap-3 text-gray-400">
               <Info className="w-4 h-4 opacity-40 shrink-0" />
               <p className="text-[10px] font-medium leading-relaxed">Images stay on your device. Zero data is sent to servers.</p>
            </div>
          </div>

          {/* Right Pane: Optimization */}
          <div className="flex-1 p-8 md:p-12 bg-white/30 flex flex-col">
            <div className="mb-10">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Live Optimization</h2>
              <p className="text-xs text-gray-400 font-medium">Fine-tune your fidelity matrix.</p>
            </div>

            <div className="space-y-10 flex-grow">
               <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quality Preset</span>
                     <span className="text-sm font-bold text-gray-800">{Math.round(quality * 100)}%</span>
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
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-300">
                    <span>Performance</span>
                    <span>Standard</span>
                    <span>High Fidelity</span>
                  </div>
               </div>

               <div className="p-6 rounded-2xl border border-gray-50 bg-gray-50/40 space-y-4">
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-1">Savings</p>
                        <div className="text-3xl font-bold text-green-500 tracking-tight">
                           {originalFile && compressedFile ? `-${Math.round(((originalFile.size - compressedFile.size) / originalFile.size) * 100)}%` : "--"}
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-300 mb-1">Status</p>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${compressedFile && !compressing ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                           {compressing ? "CALIBRATING..." : compressedFile ? "PROCESSED" : "IDLE"}
                        </span>
                     </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-300 mb-1">Original</p>
                        <p className="text-xs font-bold text-gray-400">{originalFile ? formatSize(originalFile.size) : "--"}</p>
                     </div>
                     <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-300 mb-1">Optimized</p>
                        <p className="text-xs font-bold text-gray-900">{compressedFile ? formatSize(compressedFile.size) : "--"}</p>
                     </div>
                  </div>
               </div>
            </div>

            <button
               onClick={downloadImage}
               disabled={!compressedFile || compressing}
               className="w-full h-14 bg-black text-white rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-black/10 hover:shadow-xl hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none"
            >
               {compressing ? "Calibrating..." : "Download Optimized PNG"}
               <Download className="w-4 h-4" />
            </button>
          </div>

        </div>
      </main>

      <footer className="text-center py-12 opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
           © 2026 Adheesha Sooriyaarachchi • Private Local-First Image Processing
        </p>
      </footer>
    </div>
  );
}
