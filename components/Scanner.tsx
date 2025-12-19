
import React, { useRef, useState } from 'react';
import { extractTextFromImage, analyzeExtractedContent, AnalyzedContentAction } from '../services/geminiService';
import { ExecutionState } from '../types';
import TypewriterMarkdown from './TypewriterMarkdown';
import { Copy, ScanLine, ImagePlus, Check, Sparkles, BookOpen, Calculator, ArrowRight } from 'lucide-react';

interface ScannerProps {
    onExecute: (data: ExecutionState) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onExecute }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzedContentAction | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File ảnh quá lớn (giới hạn 5MB).");
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setExtractedText('');
        setAnalysis(null);
        setIsCopied(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!imagePreview) return;
    setIsProcessing(true);
    setExtractedText('');
    setAnalysis(null);
    setError('');
    
    try {
      // Step 1: Extract Text
      const text = await extractTextFromImage(imagePreview);
      setExtractedText(text);

      // Step 2: Analyze and Suggest
      const analysisResult = await analyzeExtractedContent(text);
      setAnalysis(analysisResult);

    } catch (err) {
      setError("Không thể xử lý ảnh. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const executeSuggestion = (suggestion: { title: string, description: string, promptTemplate: string }) => {
      onExecute({
          title: suggestion.title,
          description: suggestion.description,
          content: suggestion.promptTemplate
      });
  };

  const getIcon = (iconName: string) => {
      if (iconName.includes('calculator')) return <Calculator size={18} />;
      if (iconName.includes('book')) return <BookOpen size={18} />;
      return <Sparkles size={18} />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 pb-24 animate-fade">
      <div className="text-center mb-10 md:mb-16">
        <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white border border-slate-100 rounded-[2rem] text-indigo-600 mb-6 shadow-xl shadow-indigo-50">
           <ScanLine size={32} />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight uppercase">Scanner AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Thông minh</span></h2>
        <p className="text-base md:text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed px-4">
          Biến hình ảnh sách giáo khoa, bài tập thành văn bản số hóa và nhận ngay gợi ý giải pháp từ AI.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-start">
        {/* Input Area */}
        <div className="space-y-6">
            <div 
              className={`relative bg-white rounded-[2.5rem] shadow-xl overflow-hidden border-2 transition-all cursor-pointer group h-80 lg:h-[550px] flex flex-col items-center justify-center ${
                  imagePreview ? 'border-indigo-100' : 'border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20'
              }`}
              onClick={triggerFileInput}
            >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-6 bg-slate-50/50" />
                    <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white px-6 py-3 rounded-full font-bold text-indigo-600 shadow-xl border border-indigo-50 flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                           <ImagePlus size={18} /> Thay đổi ảnh
                        </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-10">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center text-3xl md:text-4xl mb-4 md:mb-6 mx-auto group-hover:scale-110 transition-transform shadow-inner">
                       <ImagePlus size={32} className="md:w-10 md:h-10"/>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Tải ảnh lên</h3>
                    <p className="text-xs md:text-sm text-slate-400 font-bold mb-6 md:mb-8">Hỗ trợ JPG, PNG (Tối đa 5MB)</p>
                    <span className="px-6 py-3 md:px-8 md:py-3 bg-white border border-slate-200 rounded-2xl text-xs md:text-sm font-black text-slate-600 shadow-lg group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
                       Chọn từ thiết bị
                    </span>
                  </div>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm font-bold border border-red-100 flex items-center justify-center gap-2">
                  ⚠️ {error}
                </div>
            )}

            <button
                onClick={(e) => { e.stopPropagation(); handleProcess(); }}
                disabled={!imagePreview || isProcessing}
                className="w-full btn-primary py-4 md:py-5 rounded-[2rem] font-black uppercase text-xs md:text-sm tracking-[0.2em] shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-95"
            >
                {isProcessing ? (
                   <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>AI đang phân tích...</span>
                   </>
                ) : (
                  <>
                    <ScanLine size={20} />
                    <span>Quét & Phân tích</span>
                  </>
                )}
            </button>
        </div>

        {/* Result Area */}
        <div className="flex flex-col gap-6">
            {/* Extracted Text Box */}
            <div className="relative h-80 lg:h-[400px] bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden group hover:shadow-2xl transition-all">
                <div className="flex items-center justify-between px-6 md:px-8 py-4 md:py-5 border-b border-slate-100 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><ScanLine size={16}/></div>
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Văn bản trích xuất</span>
                    </div>
                    <button 
                    onClick={handleCopy}
                    disabled={!extractedText}
                    className={`text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-xl hover:bg-slate-50 ${isCopied ? 'text-emerald-500' : ''}`}
                    title="Sao chép"
                    >
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>
                
                <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50/30">
                    {!extractedText ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300">
                        <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-center px-10">Chưa có dữ liệu. Hãy tải ảnh và nhấn nút Quét.</p>
                        </div>
                    ) : (
                        <div className="text-slate-700 font-serif text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        <TypewriterMarkdown content={extractedText} speed={2} />
                        </div>
                    )}
                </div>
            </div>

            {/* Smart Suggestions */}
            {analysis && (
                <div className="bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl border border-indigo-100 animate-fade">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Gợi ý AI</h4>
                            <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{analysis.summary}</p>
                        </div>
                        <span className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${analysis.type === 'PROBLEM' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {analysis.type === 'PROBLEM' ? 'Bài tập' : 'Kiến thức'}
                        </span>
                    </div>

                    <div className="grid gap-3">
                        {analysis.suggestions.map((suggestion, idx) => (
                            <button 
                                key={idx}
                                onClick={() => executeSuggestion(suggestion)}
                                className="group w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-200 transition-all flex items-center gap-4 hover:shadow-lg"
                            >
                                <div className="w-10 h-10 bg-white text-indigo-500 rounded-xl flex items-center justify-center border border-indigo-50 group-hover:scale-110 transition-transform shadow-sm flex-shrink-0">
                                    {getIcon(suggestion.icon)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h5 className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">{suggestion.title}</h5>
                                    <p className="text-xs text-slate-500 truncate">{suggestion.description}</p>
                                </div>
                                <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
