"use client";

import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import {
  Upload,
  FileText,
  Copy,
  Download,
  Loader2,
  X,
  ImageIcon,
  Check,
  Languages,
  Sparkles
} from "lucide-react";
import { createWorker } from "tesseract.js";

// Supported languages for the mock converter
type Language = "en" | "km" | "ko";

const LANGUAGE_CODES: Record<Language, string> = {
  en: "eng",
  km: "khm",
  ko: "kor",
};

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "km", name: "Khmer (ភាសាខ្មែរ)", flag: "🇰🇭" },
  { code: "ko", name: "Korean (한국어)", flag: "🇰🇷" },
];

// Mock texts representing realistic OCR outputs for each language
const MOCK_EXTRACTED_TEXTS: Record<Language, string> = {
  en: `IMAGE TO TEXT CONVERTER (OCR REPORT)
----------------------------------------
Date: ${new Date().toLocaleDateString()}
Status: Success
Language: English (US)

"Success is not final, failure is not fatal: it is the courage to continue that counts."
— Winston Churchill

Key Features of this tool:
1. High-speed OCR simulation
2. Cross-platform responsive layout
3. Multi-language support (English, Khmer, Korean)
4. Instant copy-to-clipboard and TXT downloads

This is a premium dark-themed interface built with Next.js and Tailwind CSS. You can modify this text directly, add notes, or export it to your computer!`,
  km: `របាយការណ៍បម្លែងរូបភាពទៅជាអត្ថបទ (OCR)
----------------------------------------
កាលបរិច្ឆេទ: ${new Date().toLocaleDateString()}
ស្ថានភាព: ជោគជ័យ
ភាសា: ភាសាខ្មែរ (Khmer)

"ការអប់រំ គឺជាអាវុធដ៏មានឥទ្ធិពលបំផុត ដែលអ្នកអាចប្រើប្រាស់ដើម្បីផ្លាស់ប្តូរពិភពលោក។"
— ណិលសុន ម៉ានដេឡា (Nelson Mandela)

លក្ខណៈពិសេសរបស់កម្មវិធី៖
១. ល្បឿនបម្លែងរហ័សទាន់ចិត្ត
២. ប្លង់រចនាស្អាតប្លែក និងទាក់ទាញ
៣. គាំទ្រច្រើនភាសា (អង់គ្លេស ខ្មែរ កូរ៉េ)
៤. ចម្លង និងទាញយកជាឯកសារអត្ថបទភ្លាមៗ

អ្នកអាចកែសម្រួលអត្ថបទគំរូនេះដោយផ្ទាល់ បន្ថែមព័ត៌មាន ឬទាញយកវាទុកក្នុងកុំព្យូទ័ររបស់អ្នកបាន!`,
  ko: `이미지 텍스트 변환기 (OCR 결과)
----------------------------------------
날짜: ${new Date().toLocaleDateString()}
상태: 완료
언어: 한국어 (Korean)

"교육은 세상을 바꿀 수 있는 가장 강력한 무기다."
— 넬슨 만델라 (Nelson Mandela)

주요 기능 안내:
1. 초고속 인공지능 기반 OCR 스캔 시뮬레이션
2. 모바일/데스크톱 반응형 다크 레이아웃
3. 다국어 지원 (영어, 크메르어, 한국어)
4. 클립보드 원클릭 복사 및 텍스트 파일 저장 기능

텍스트 상자 내의 내용을 자유롭게 수정 및 편집할 수 있으며, 하단 버튼을 통해 즉시 내보내기가 가능합니다.`,
};

export default function ImageToTextTool() {
  // File states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Settings & Process states
  const [language, setLanguage] = useState<Language>("en");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processStep, setProcessStep] = useState<string>("");
  
  // Result states
  const [extractedText, setExtractedText] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File type validation helper
  const isValidFileType = (file: File): boolean => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    return validTypes.includes(file.type);
  };

  // Process file upload
  const handleFile = (selectedFile: File) => {
    setError(null);

    // Validate type
    if (!isValidFileType(selectedFile)) {
      setError("Invalid file type. Please upload a PNG, JPG, JPEG, or WEBP image.");
      return;
    }

    // Validate size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      setError("File is too large. Maximum allowed size is 10MB.");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    // Clear any previous output when a new image is loaded
    setExtractedText(""); 
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Drag and drop event handlers
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
    setProgress(0);
    setProcessStep("");
  };

  // Trigger file dialog
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Convert / OCR Processing using Tesseract.js
  const handleConvert = async () => {
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessStep("Initializing OCR engine...");
    setExtractedText("");
    setError(null);

    let worker = null;
    try {
      const tesseractLang = LANGUAGE_CODES[language];
      
      worker = await createWorker(tesseractLang, 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
            setProcessStep("Extracting characters...");
          } else {
            // Provide clean readable statuses
            let readableStatus = m.status;
            if (m.status === "loading tesseract core") {
              readableStatus = "Loading core OCR modules...";
            } else if (m.status === "loading language traineddata") {
              readableStatus = `Loading language files (${language.toUpperCase()})...`;
            } else if (m.status === "initializing api") {
              readableStatus = "Initializing OCR context...";
            }
            setProcessStep(readableStatus);
          }
        }
      });

      const { data: { text } } = await worker.recognize(file);
      
      if (!text || text.trim() === "") {
        setExtractedText("No text was detected in the uploaded image. Please try another image with clearer, higher-contrast characters.");
      } else {
        setExtractedText(text);
      }
    } catch (err: any) {
      console.error("OCR recognition error:", err);
      setError(`OCR failed: ${err?.message || "An unexpected error occurred during processing."}`);
    } finally {
      if (worker) {
        await worker.terminate();
      }
      setIsProcessing(false);
    }
  };

  // Copy to clipboard helper
  const handleCopy = async () => {
    if (!extractedText) return;
    try {
      await navigator.clipboard.writeText(extractedText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  // Download text helper
  const handleDownload = () => {
    if (!extractedText) return;
    const element = document.createElement("a");
    const fileBlob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `extracted-text-${language}-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Title Header Section */}
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/20 text-blue-400 text-sm font-medium animate-pulse">
          <Sparkles className="w-4 h-4" />
          <span>Simulated OCR Web Application</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
          Image to Text Converter
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
          Upload an image and extract text from it easily. Supports multiple languages with premium dark UI layout.
        </p>
      </div>

      {/* Main Grid: Upload & Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Side: Upload & Configuration */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 opacity-60"></div>
          
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-500" />
            Image Source
          </h2>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={!previewUrl ? triggerFileInput : undefined}
            className={`relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center min-h-[300px] transition-all duration-300 ${
              previewUrl ? "border-slate-700 bg-slate-950/40 p-4" : "cursor-pointer hover:bg-slate-950/20"
            } ${
              dragActive 
                ? "border-blue-500 bg-blue-950/20 scale-[1.01]" 
                : "border-slate-800 hover:border-blue-500/50"
            }`}
          >
            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={handleInputChange}
            />

            {previewUrl ? (
              // Preview State
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900/90 text-gray-400 hover:text-white border border-slate-700 hover:border-red-500/50 transition-colors z-10 shadow-lg"
                  title="Remove Image"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Image Display */}
                <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 max-h-[320px] w-full flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Upload Preview"
                    className="max-h-[300px] object-contain max-w-full rounded-md"
                  />
                  {/* Glowing Laser scanning line when processing */}
                  {isProcessing && (
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_#3b82f6] animate-[scan_2s_ease-in-out_infinite]"></div>
                  )}
                </div>

                {/* File Details */}
                <div className="mt-4 w-full text-center">
                  <p className="text-sm font-medium text-slate-300 truncate max-w-xs mx-auto">
                    {file?.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(file ? file.size / (1024 * 1024) : 0).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ) : (
              // Empty/Upload State
              <div className="text-center px-4 py-8 pointer-events-none">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-950/30 flex items-center justify-center border border-blue-500/10 mb-4 group-hover:scale-110 group-hover:border-blue-500/30 transition-all duration-300">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200">Drag & Drop Image</h3>
                <p className="text-sm text-slate-400 mt-2">
                  or <span className="text-blue-400 font-medium">browse files</span> from your device
                </p>
                <p className="text-xs text-slate-500 mt-4">
                  Supports PNG, JPG, JPEG, WEBP up to 10MB
                </p>
              </div>
            )}
          </div>

          {/* Validation Error Message */}
          {error && (
            <div className="mt-4 p-3 rounded-lg border border-red-500/20 bg-red-950/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Language Selector */}
          <div className="mt-6 space-y-2">
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-500" />
              OCR Language Selection
            </label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  disabled={isProcessing}
                  className={`py-2 px-3 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    language === lang.code
                      ? "border-blue-500 bg-blue-600/10 text-blue-400"
                      : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                  } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Process Trigger Button & Progress Info */}
          <div className="mt-6 space-y-4">
            {isProcessing ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-blue-400 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {processStep}
                  </span>
                  <span className="text-white">{progress}%</span>
                </div>
                {/* Progress Bar Container */}
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 h-2.5 rounded-full transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConvert}
                disabled={!file}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  file
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-[0.99] cursor-pointer"
                    : "bg-slate-800/80 border border-slate-700/50 text-slate-500 cursor-not-allowed"
                }`}
              >
                <FileText className="w-5 h-5" />
                Convert to Text
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Results Section */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[515px] group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 opacity-60"></div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Extracted Text
            </h2>
            {extractedText && (
              <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                Conversion Ready
              </span>
            )}
          </div>

          {/* Text Area Card */}
          <div className="relative flex-grow flex flex-col">
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              disabled={isProcessing}
              placeholder="Your extracted text will appear here. You can click 'Convert to Text' after selecting an image, and you will be able to edit the resulting text right in this box."
              className="w-full flex-grow min-h-[300px] lg:min-h-[340px] p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 font-mono text-sm leading-relaxed resize-none transition-colors"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px] rounded-xl flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <span className="text-slate-400 text-sm font-medium">Extracting characters...</span>
              </div>
            )}
          </div>

          {/* Bottom Actions for Text Area */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              disabled={!extractedText || isProcessing}
              className={`py-2.5 px-4 rounded-xl border text-sm font-medium flex items-center gap-2 transition-all ${
                extractedText && !isProcessing
                  ? isCopied
                    ? "border-green-500/30 bg-green-950/10 text-green-400"
                    : "border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300 hover:text-white active:scale-95 cursor-pointer"
                  : "border-slate-800/40 bg-slate-950/10 text-slate-600 cursor-not-allowed"
              }`}
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {isCopied ? "Copied!" : "Copy Text"}
            </button>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownload}
              disabled={!extractedText || isProcessing}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                extractedText && !isProcessing
                  ? "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/10 active:scale-95 cursor-pointer"
                  : "bg-slate-800/40 text-slate-600 cursor-not-allowed"
              }`}
            >
              <Download className="w-4 h-4" />
              Download TXT
            </button>
          </div>
        </div>

      </div>

      {/* Embedded scanning CSS animation rule */}
      <style jsx global>{`
        @keyframes scan {
          0%, 100% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
        }
      `}</style>
    </div>
  );
}
