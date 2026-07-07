# TextSnap — Image to Text OCR Converter

A premium, modern client-side **Image to Text (OCR) Converter** web application. Built using the Next.js App Router, TypeScript, Tailwind CSS, and Tesseract.js.

Developed with ❤️ by **Horn Vanhong**.

---

## 🌟 Key Features

*   **Premium Dark UI**: Built with a responsive, glassmorphic layout, featuring beautiful gradient text, micro-animations, and glow effects.
*   **Drag and Drop File Support**: Smooth visual drop-zone with file size and file type validation:
    *   **Allowed Formats**: PNG, JPG, JPEG, WEBP.
    *   **Size Limit**: Maximum 10MB.
*   **Real Client-Side OCR**: Utilizes **Tesseract.js** for high-precision, client-side character recognition. No backend or external databases are used.
*   **Live Scanning Feedback**: Live status updates showing the engine status (e.g. loading language data, loading core files, recognizing characters) with a smooth progress bar and laser scanning visual overlays.
*   **Multi-Language OCR Support**:
    *   🇺🇸 English (`eng`)
    *   🇰🇭 Khmer (`khm`)
    *   🇰🇷 Korean (`kor`)
*   **Editable Results Box**: Extracted text appears in an interactive mono-spaced textarea that users can inspect and edit manually.
*   **Actionable Utilities**:
    *   **Copy to Clipboard**: Quick copy with active status animation indicators.
    *   **Download TXT**: Saves the extracted content directly to your local system as a `.txt` file.

---

## 🛠️ Technology Stack

*   **Core Framework**: Next.js (App Router)
*   **Programming Language**: TypeScript
*   **Styling Engine**: Tailwind CSS
*   **Icons**: Lucide React
*   **OCR Processor**: Tesseract.js

---

## 🚀 Getting Started

Follow these steps to run the application locally on your computer:

### 1. Clone & Navigate
```bash
git clone https://github.com/HornVanhong/TextSnap.git
cd TextSnap
```

### 2. Install Dependencies
Install all required package modules:
```bash
npm install
```

### 3. Run the Development Server
Launch the local Hot-Reload server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** (or the port specified in your console logs) in your browser to try the application.

### 4. Build for Production
To build a static, optimized bundle:
```bash
npm run build
npm start
```

---

## 📄 License
This project is open-source and available under the MIT License. Developed by **Horn Vanhong**.
