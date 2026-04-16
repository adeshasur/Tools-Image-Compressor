"use client";

import { useEffect, useMemo, useState } from "react";
import imageCompression from "browser-image-compression";
import {
  Download,
  Image as ImageIcon,
  Info,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UploadCloud,
  Zap,
} from "lucide-react";

const clampQuality = (value) => Math.min(0.9, Math.max(0.1, value));

const formatSize = (bytes) => {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** index;

  return `${size.toFixed(size >= 100 || index === 0 ? 0 : 2)} ${units[index]}`;
};

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [compressing, setCompressing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!originalFile) {
      setPreviewUrl("");
      return undefined;
    }

    const url = URL.createObjectURL(originalFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [originalFile]);

  const processCompression = async (file, nextQuality) => {
    if (!file) return;

    setCompressing(true);
    setError("");

    try {
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 2560,
        useWebWorker: true,
        initialQuality: clampQuality(nextQuality),
      });

      const nextFile = new File([compressedBlob], file.name, {
        type: compressedBlob.type || file.type,
      });

      setCompressedFile(nextFile);
    } catch (compressionError) {
      console.error("Compression error:", compressionError);
      setCompressedFile(null);
      setError("Compression failed for this file. Try another image or a slightly higher quality level.");
    } finally {
      setCompressing(false);
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose a valid image file.");
      return;
    }

    setOriginalFile(file);
    setCompressedFile(null);
    processCompression(file, quality);
  };

  const handleReset = () => {
    setOriginalFile(null);
    setCompressedFile(null);
    setError("");
  };

  const handleDownload = () => {
    if (!compressedFile || !originalFile) return;

    const url = URL.createObjectURL(compressedFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = `optimized-${originalFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    if (!originalFile || !compressedFile) {
      return {
        savedPercent: "--",
        savedBytes: "--",
        originalSize: originalFile ? formatSize(originalFile.size) : "---",
        compressedSize: compressing ? "Processing..." : "---",
      };
    }

    const savedBytes = Math.max(originalFile.size - compressedFile.size, 0);
    const savedPercent = originalFile.size
      ? `${Math.round((savedBytes / originalFile.size) * 100)}%`
      : "0%";

    return {
      savedPercent,
      savedBytes: formatSize(savedBytes),
      originalSize: formatSize(originalFile.size),
      compressedSize: formatSize(compressedFile.size),
    };
  }, [compressedFile, compressing, originalFile]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f4f4f2] text-slate-950 selection:bg-[#d8d8d8] selection:text-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-6%] top-12 h-72 w-72 rounded-full bg-white/70 blur-3xl" />
        <div className="absolute right-[-6%] top-[18rem] h-[24rem] w-[24rem] rounded-full bg-black/8 blur-3xl" />
        <div className="absolute left-[14%] top-[34rem] h-80 w-80 rounded-full bg-black/6 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000010_1px,transparent_1px),linear-gradient(to_bottom,#00000010_1px,transparent_1px)] bg-[size:18px_18px] opacity-60" />
      </div>

      <header className="relative z-20 px-4 pt-4 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/50 bg-white/62 px-4 py-3 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-2xl md:px-6">
          <a
            href="https://info-adheesha.vercel.app"
            className="font-display text-sm font-semibold tracking-[-0.03em] text-slate-900 md:text-base"
          >
            Adheesha Sooriyaarachchi
          </a>
          <a
            href="https://info-adheesha.vercel.app/tools"
            className="inline-flex rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10"
          >
            Back to Portfolio
          </a>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col px-4 pb-10 pt-6 md:px-6 md:pb-14 md:pt-8">
        <section className="relative overflow-hidden">
          <div className="absolute left-1/4 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-black/6 blur-[120px]" />
          <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-black/4 blur-[100px]" />

          <div className="relative z-10 mb-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-600 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5" />
              Image Compressor
            </span>
            <h1 className="mt-5 bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-500 bg-clip-text font-display text-4xl font-semibold tracking-[-0.06em] text-transparent md:text-5xl">
              Compress images in the same clean toolkit style
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-500 md:text-base">
              Drop in an image, tune the quality, and download a lighter file with instant on-device processing.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 p-6 sm:p-8 md:grid-cols-2">
            <div className="flex flex-col space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Upload Image</label>
                <div
                  className={`rounded-[28px] border border-dashed p-6 transition-all duration-300 ${
                    dragActive
                      ? "border-[rgba(17,17,17,0.28)] bg-white/70 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
                      : "border-[rgba(17,17,17,0.12)] bg-white/36 hover:border-[rgba(17,17,17,0.2)] hover:bg-white/52"
                  }`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragActive(false);
                    handleFile(event.dataTransfer.files[0]);
                  }}
                >
                  {previewUrl ? (
                    <div className="space-y-5">
                      <div className="overflow-hidden rounded-[22px] border border-black/8 bg-white/70">
                        <img
                          src={previewUrl}
                          alt={originalFile?.name || "Selected preview"}
                          className="h-56 w-full object-cover"
                        />
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-900">
                            {originalFile?.name}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {formatSize(originalFile?.size || 0)} source size
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white/75 px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-black/20 hover:bg-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Clear
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[332px] flex-col items-center justify-center text-center">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5">
                        <UploadCloud className="h-7 w-7 text-zinc-500" />
                      </div>
                      <h2 className="font-display text-2xl font-semibold tracking-[-0.05em] text-zinc-900">
                        Drag and drop your image
                      </h2>
                      <p className="mt-3 max-w-xs text-sm leading-6 text-zinc-500">
                        JPG, PNG, WebP, and other standard image formats are supported for instant browser-side compression.
                      </p>
                      <label className="mt-8 inline-flex cursor-pointer items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5">
                        Browse Files
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleFile(event.target.files?.[0])}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {error ? (
                  <p className="text-xs text-red-500">{error}</p>
                ) : (
                  <p className="text-xs text-gray-400">
                    Everything runs locally in your browser. Nothing is uploaded to a server.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white/58 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-zinc-700">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Private by default</p>
                    <p className="text-xs leading-5 text-zinc-500">
                      Compression happens on-device, so the original image stays with the user.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:border-l md:border-[rgba(17,17,17,0.08)] md:pl-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-sm font-medium text-gray-700">Compression Quality</label>
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/72 px-3 py-1 text-xs font-semibold text-zinc-700">
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      {Math.round(quality * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.01"
                    value={quality}
                    onChange={(event) => {
                      const nextQuality = parseFloat(event.target.value);
                      setQuality(nextQuality);
                      if (originalFile) processCompression(originalFile, nextQuality);
                    }}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-black/10 accent-black"
                  />
                  <div className="flex justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                    <span>Smaller</span>
                    <span>Balanced</span>
                    <span>Sharper</span>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white/58 p-4 backdrop-blur-xl">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">Reduction</p>
                    <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em] text-zinc-950">
                      {originalFile && compressedFile ? `-${stats.savedPercent}` : "--"}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">{stats.savedBytes} saved</p>
                  </div>

                  <div className="rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white/58 p-4 backdrop-blur-xl">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">Source</p>
                    <p className="mt-3 text-lg font-semibold text-zinc-900">{stats.originalSize}</p>
                    <p className="mt-2 text-xs text-zinc-500">Before compression</p>
                  </div>

                  <div className="rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white/58 p-4 backdrop-blur-xl">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">Result</p>
                    <p className="mt-3 text-lg font-semibold text-zinc-900">{stats.compressedSize}</p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {compressing ? "Recompressing now" : compressedFile ? "Ready to download" : "Waiting for image"}
                    </p>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[rgba(17,17,17,0.12)] bg-[rgba(255,255,255,0.58)] p-6 backdrop-blur-2xl">
                  {compressing ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                          <Zap className="h-5 w-5 animate-pulse text-zinc-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">Optimizing image</p>
                          <p className="text-xs text-zinc-500">Recalculating a smaller version with your latest quality setting.</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 rounded-full bg-black/6">
                          <div className="h-full w-2/3 animate-pulse rounded-full bg-black/20" />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="h-24 animate-pulse rounded-2xl bg-black/5" />
                          <div className="h-24 animate-pulse rounded-2xl bg-black/5" />
                        </div>
                      </div>
                    </div>
                  ) : compressedFile ? (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 text-zinc-900">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">Compression ready</p>
                          <p className="text-xs text-zinc-500">Download the optimized asset or adjust the quality slider again.</p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-black/8 bg-white/70 p-4">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">Original</p>
                          <p className="mt-2 text-sm font-semibold text-zinc-900">{originalFile?.name}</p>
                          <p className="mt-1 text-xs text-zinc-500">{stats.originalSize}</p>
                        </div>
                        <div className="rounded-2xl border border-black/8 bg-white/70 p-4">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">Compressed</p>
                          <p className="mt-2 text-sm font-semibold text-zinc-900">{compressedFile.name}</p>
                          <p className="mt-1 text-xs text-zinc-500">{stats.compressedSize}</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">Quick note</p>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                          Lower quality creates smaller files faster. Higher quality keeps more detail but reduces the savings.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(17,17,17,0.12)] bg-white/30 p-8 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5">
                        <ImageIcon className="h-6 w-6 text-zinc-500" />
                      </div>
                      <h3 className="font-display text-2xl font-semibold tracking-[-0.05em] text-zinc-900">
                        Result panel
                      </h3>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500">
                        Choose an image to preview the compression result, file savings, and download state here.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!compressedFile || compressing}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    <Download className="h-4 w-4" />
                    {compressing ? "Processing..." : "Download Optimized Image"}
                  </button>
                  <div className="flex items-center gap-2 rounded-xl border border-[rgba(17,17,17,0.08)] bg-white/58 px-4 py-3 text-xs leading-5 text-zinc-500 backdrop-blur-xl sm:max-w-[220px]">
                    <Info className="h-4 w-4 shrink-0 text-zinc-600" />
                    Works best for photos, screenshots, and product images.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 pb-8 text-center text-xs text-gray-400">
        Powered by Adheesha Sooriyaarachchi | 2026
      </footer>
    </div>
  );
}
