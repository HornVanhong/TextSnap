import ImageToTextTool from "@/components/ImageToTextTool";

export const metadata = {
  title: "Image to Text Converter - Extract Text from Images Free",
  description: "A modern, highly accurate simulated OCR utility to convert PNG, JPG, JPEG, and WEBP images into editable text instantly.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070b15] text-slate-100 flex flex-col justify-between selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-slate-950 to-slate-950 pointer-events-none z-0"></div>

      {/* Header navbar */}
      <header className="border-b border-slate-900/80 bg-slate-950/40 backdrop-blur-md relative z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-extrabold text-white text-lg">T</span>
            </div>
            <span className="font-bold text-white tracking-tight text-lg">
              Text<span className="text-blue-500">Snap</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Docs
            </a>
            <span className="h-4 w-px bg-slate-800"></span>
            <div className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold">
              v1.0.0
            </div>
          </div>
        </div>
      </header>

      {/* Main Tool Container */}
      <div className="relative z-10 flex-grow flex items-center justify-center py-6">
        <ImageToTextTool />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/20 py-6 relative z-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TextSnap. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
