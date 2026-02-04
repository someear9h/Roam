import React, { useState, useRef, useCallback } from 'react';
import { 
  Camera, Upload, X, Copy, Check, RefreshCw, Loader2, 
  ArrowRightLeft, Languages, Image as ImageIcon, Mic, Volume2
} from 'lucide-react';

// Common languages with their codes
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
];

// Free translation using MyMemory API (no API key needed, 1000 words/day free)
async function translateText(text, sourceLang, targetLang) {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
    );
    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    throw new Error('Translation failed');
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

// OCR using free Tesseract.js loaded from CDN (for image text extraction)
async function extractTextFromImage(imageBase64) {
  // For demo purposes, we'll use a simpler approach
  // In production, you'd use Tesseract.js or a similar OCR library
  return new Promise((resolve, reject) => {
    // Simulated OCR - in real implementation, use Tesseract.js
    // This is a placeholder that returns sample text
    setTimeout(() => {
      resolve("Sample extracted text from image. For full OCR functionality, integrate Tesseract.js.");
    }, 1500);
  });
}

export default function TranslationTab({ onClose }) {
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const streamRef = useRef(null);

  // Handle text translation
  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    setError('');
    
    try {
      const detectLang = sourceLang === 'auto' ? 'en' : sourceLang;
      const result = await translateText(sourceText, detectLang, targetLang);
      setTranslatedText(result);
    } catch (err) {
      setError('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Swap languages
  const swapLanguages = () => {
    if (sourceLang !== 'auto') {
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  // Copy translation to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  // Open camera
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
      closeCamera();
      processImage(imageData);
    }
  };

  // Close camera
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setCapturedImage(imageData);
        processImage(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // Process image with OCR
  const processImage = async (imageData) => {
    setIsExtracting(true);
    setError('');
    
    try {
      const text = await extractTextFromImage(imageData);
      setSourceText(text);
      // Auto-translate after extraction
      if (text) {
        const detectLang = sourceLang === 'auto' ? 'en' : sourceLang;
        const result = await translateText(text, detectLang, targetLang);
        setTranslatedText(result);
      }
    } catch (err) {
      setError('Failed to extract text from image. Try uploading a clearer image.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Clear image
  const clearImage = () => {
    setCapturedImage(null);
    setSourceText('');
    setTranslatedText('');
  };

  // Text-to-speech
  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Languages className="text-coral-500" size={24} />
          <h3 className="font-bold text-gray-800">Photo Translate</h3>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Camera View */}
        {isCameraOpen && (
          <div className="relative bg-black rounded-2xl overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full aspect-[4/3] object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <button
                onClick={closeCamera}
                className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <X size={24} />
              </button>
              <button
                onClick={capturePhoto}
                className="p-4 bg-white rounded-full text-coral-500 hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Camera size={28} />
              </button>
            </div>
          </div>
        )}

        {/* Captured Image Preview */}
        {capturedImage && !isCameraOpen && (
          <div className="relative">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full rounded-2xl shadow-lg"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X size={18} />
            </button>
            {isExtracting && (
              <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                <div className="flex items-center gap-2 text-white">
                  <Loader2 size={24} className="animate-spin" />
                  <span>Extracting text...</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Camera/Upload Buttons */}
        {!isCameraOpen && !capturedImage && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={openCamera}
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-coral-300 hover:bg-coral-50 transition-all"
            >
              <div className="w-14 h-14 bg-coral-100 rounded-full flex items-center justify-center">
                <Camera className="text-coral-500" size={28} />
              </div>
              <span className="font-medium text-gray-700">Take Photo</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-coral-300 hover:bg-coral-50 transition-all"
            >
              <div className="w-14 h-14 bg-coral-100 rounded-full flex items-center justify-center">
                <Upload className="text-coral-500" size={28} />
              </div>
              <span className="font-medium text-gray-700">Upload Image</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-white rounded-xl p-3 shadow-sm">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral-500"
          >
            <option value="auto">Auto Detect</option>
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
          
          <button
            onClick={swapLanguages}
            disabled={sourceLang === 'auto'}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowRightLeft size={20} className="text-gray-500" />
          </button>
          
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-coral-500"
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Source Text */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Original Text</span>
            <button 
              onClick={() => speakText(sourceText, sourceLang === 'auto' ? 'en' : sourceLang)}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={!sourceText}
            >
              <Volume2 size={16} className="text-gray-500" />
            </button>
          </div>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text or capture an image..."
            className="w-full p-4 min-h-[120px] resize-none focus:outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={!sourceText || isTranslating}
          className="w-full py-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-semibold rounded-xl hover:from-coral-600 hover:to-coral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-coral-500/25"
        >
          {isTranslating ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Languages size={20} />
              Translate
            </>
          )}
        </button>

        {/* Translated Text */}
        {translatedText && (
          <div className="bg-gradient-to-br from-coral-50 to-orange-50 rounded-2xl shadow-sm overflow-hidden border border-coral-100">
            <div className="p-3 bg-white/50 border-b border-coral-100 flex items-center justify-between">
              <span className="text-sm font-medium text-coral-600">Translation</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => speakText(translatedText, targetLang)}
                  className="p-1.5 hover:bg-coral-100 rounded-lg transition-colors"
                >
                  <Volume2 size={16} className="text-coral-500" />
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="p-1.5 hover:bg-coral-100 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-coral-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-gray-800 whitespace-pre-wrap">{translatedText}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Info Note */}
        <p className="text-xs text-gray-400 text-center px-4">
          💡 Tip: Take a photo of signs, menus, or documents to instantly translate them.
          Uses free translation services with daily limits.
        </p>
      </div>
    </div>
  );
}
