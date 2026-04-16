"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { 
  UploadCloud, 
  Download, 
  Image as ImageIcon,
  Zap,
  Info,
  Trash2
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
    <div className="relative min-h-screen font-sans selection:bg-blue-100/30">
      {/* Background Grid Layer (Exact Suite Sync) */}
      <div 
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#000 1.2px, transparent 1.2px), linear-gradient(90deg, #000 1.2px, transparent 1.2px)",
          backgroundSize: "18px 18px"
        }}
      />

      {/* Floating Suite Navbar (Exact Suite Sync) */}
      <nav className="relative z-10 max-w-[52rem] mx-auto pt-10 px-4">
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-2xl border border-white/40 px-8 py-[18px] rounded-[40px] shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
          <span className="text-[15px] font-semibold text-[#111111]">
            Adheesha Sooriyaarachchi
          </span>
          <a 
            href="https://info-adheesha.vercel.app/"
            className="flex items-center gap-2 bg-[#020617] text-white text-[13px] font-medium px-6 py-[10px] rounded-full hover:bg-black transition-all shadow-md active:scale-95"
          >
            Back to Portfolio
          </a>
        </div>
      </nav>

      {/* Main Content Area: Cardless Skeleton (Exact Suite Sync) */}
      <main className="relative z-10 max-w-4xl mx-auto mt-20 px-8 pb-32">
        <div className="flex flex-col md:flex-row gap-16 md:gap-0">
          
          {/* Left Column: Input Selection */}
          <div className="flex-1 md:pr-20 md:border-r border-[#111111]/[0.08] flex flex-col min-h-[480px]">
            <div className="mb-10 pt-2">
              <h2 className="text-[11px] font-bold text-[#111111]/30 uppercase tracking-[0.24em] mb-2">Original Asset</h2>
              <p className="text-[13px] text-[#111111]/40 font-medium">Auto-calibrating while you adjust parameters.</p>
            </div>

            <div 
              className={`flex-grow relative rounded-[2.5rem] p-10 flex flex-col items-center justify-center transition-all duration-300 border-2 border-dashed ${
                dragActive ? "border-[#111111]/40 bg-white/40" : "border-[#111111]/10 hover:border-[#111111]/20"
              } bg-white/10`}
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
                <div className="flex flex-col items-center text-center">
                   <div className="w-20 h-20 rounded-[1.25rem] bg-white shadow-sm flex items-center justify-center text-[#111111]/20 mb-6 border border-[#111111]/5">
                      <ImageIcon className="w-8 h-8" />
                   </div>
                   <h3 className="text-[14px] font-semibold text-[#111111] mb-1 truncate max-w-[200px]">{originalFile.name}</h3>
                   <p className="text-[10px] font-bold text-[#111111]/20 uppercase tracking-widest mb-10">{formatSize(originalFile.size)}</p>
                   
                   <button 
                     onClick={() => setOriginalFile(null)}
                     className="text-[10px] font-bold text-red-400 uppercase tracking-[0.24em] hover:text-red-500 transition-colors"
                   >
                     Clear Selection
                   </button>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                   <div className="w-16 h-16 rounded-[1.25rem] bg-[#111111]/5 flex items-center justify-center mb-8">
                      <UploadCloud className="w-6 h-6 text-[#111111]/20" />
                   </div>
                   <p className="text-[13px] text-[#111111]/40 font-medium max-w-[180px] leading-relaxed mb-10">
                      Drop your image here or browse your local file system.
                   </p>
                   <label className="bg-[#111111]/5 hover:bg-[#111111]/10 px-8 py-3 rounded-full text-[13px] font-semibold text-[#111111]/60 cursor-pointer transition-colors">
                      Browse Files
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

            <div className="mt-8 flex items-center gap-3 py-4 px-6 rounded-2xl bg-[#111111]/[0.02] border border-[#111111]/[0.03]">
               <Info className="w-4 h-4 text-[#111111]/20 shrink-0" />
               <p className="text-[12px] text-[#111111]/40 font-medium leading-normal">
                 Processing takes place entirely on your device for absolute local privacy.
               </p>
            </div>
          </div>

          {/* Right Column: Optimization Flow */}
          <div className="flex-1 md:pl-20 flex flex-col pt-2 min-h-[480px]">
            <div className="mb-10 pt-2">
              <h2 className="text-[11px] font-bold text-[#111111]/30 uppercase tracking-[0.24em] mb-2">Live Compression</h2>
              <p className="text-[13px] text-[#111111]/40 font-medium">Fine-tune the fidelity of your output asset.</p>
            </div>

            <div className="space-y-12 flex-grow">
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#111111]/30">Quality Preset</span>
                     <span className="text-[14px] font-bold text-[#111111]">{Math.round(quality * 100)}%</span>
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
                    className="w-full h-1 bg-[#111111]/10 rounded-full appearance-none cursor-pointer accent-[#111111]"
                  />
                  <div className="flex justify-between text-[11px] font-bold uppercase tracking-[0.24em] text-[#111111]/20">
                     <span>Performance</span>
                     <span>Balanced</span>
                     <span>Fidelity</span>
                  </div>
               </div>

               <div className="p-8 rounded-[2rem] border border-[#111111]/[0.04] bg-white/20 shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[10px] font-bold text-[#111111]/20 uppercase tracking-[0.24em] mb-1">Savings</p>
                        <div className="text-4xl font-semibold text-[#111111] tracking-tight">
                           {originalFile && compressedFile ? `-${Math.round(((originalFile.size - compressedFile.size) / originalFile.size) * 100)}%` : "--"}
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-[#111111]/20 uppercase tracking-[0.24em] mb-2">Cycle</p>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.24em] px-3 py-1.5 rounded-full ${compressedFile && !compressing ? "bg-[#111111] text-white" : "bg-[#111111]/5 text-[#111111]/20"}`}>
                           {compressing ? "CALIBRATING" : compressedFile ? "READY" : "IDLE"}
                        </span>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-[#111111]/5 grid grid-cols-2 gap-8">
                     <div>
                        <p className="text-[10px] font-bold text-[#111111]/20 uppercase tracking-[0.24em] mb-1">Source</p>
                        <p className="text-[13px] font-semibold text-[#111111]/40 tracking-tight">{originalFile ? formatSize(originalFile.size) : "---"}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-[#111111]/20 uppercase tracking-[0.24em] mb-1">Result</p>
                        <p className="text-[13px] font-semibold text-[#111111] tracking-tight">{compressedFile ? formatSize(compressedFile.size) : "---"}</p>
                     </div>
                  </div>
               </div>
            </div>

            <button
               onClick={downloadImage}
               disabled={!compressedFile || compressing}
               className="group relative w-full h-[64px] bg-[#111111] text-white rounded-[1.25rem] flex items-center justify-center gap-3 text-[13px] font-semibold uppercase tracking-[0.24em] shadow-lg shadow-[#111111]/10 hover:shadow-xl hover:translate-y-[-1px] active:scale-[0.98] transition-all disabled:opacity-20 disabled:translate-y-0 disabled:shadow-none"
            >
               {compressing ? "Processing..." : "Download Asset"}
               <Download className={`w-4 h-4 transition-transform ${compressing ? "animate-bounce" : "group-hover:translate-y-0.5"}`} />
            </button>
          </div>

        </div>
      </main>

      <footer className="relative z-10 py-20 opacity-20 text-center">
         <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[#111111]">
            © 2026 Adheesha Sooriyaarachchi • Built for Productivity
         </p>
      </footer>
    </div>
  );
}
