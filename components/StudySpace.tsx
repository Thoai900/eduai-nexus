
import React, { useState, useEffect, useRef } from 'react';
import { generateFlashcards, generateQuiz, generateSummary, extractTextFromFile, createStudyChatSession, generateRelatedTopics } from '../services/geminiService';
import { Flashcard, QuizQuestion, ChatMessage, RelatedTopic } from '../types';
import { Chat } from '@google/genai';
import TypewriterMarkdown from './TypewriterMarkdown';
import { Brain, Sparkles, Plus, CheckCircle2, XCircle, RefreshCw, Zap, FileText, Wrench, Eye, FileVideo, FileImage } from 'lucide-react';

type ToolTab = 'CHAT' | 'SUMMARY' | 'FLASHCARDS' | 'QUIZ' | 'EXPAND';
type ViewMode = 'TEXT' | 'VISUAL';
type MobileView = 'DOC' | 'TOOLS';
type SupportedFileType = 'IMAGE' | 'PDF' | 'VIDEO' | 'OTHER';

interface StudySpaceProps {
  initialContent?: string;
}

const LoadingSkeleton = ({ count = 3, type = 'line' }: { count?: number, type?: 'line' | 'card' }) => (
  <div className="space-y-4 w-full animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      type === 'card' ? (
        <div key={i} className="h-40 bg-slate-200 rounded-[2rem] w-full"></div>
      ) : (
        <div key={i} className="space-y-2">
           <div className="h-4 bg-slate-200 rounded w-3/4"></div>
           <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      )
    ))}
  </div>
);

const StudySpace: React.FC<StudySpaceProps> = ({ initialContent }) => {
  const [documentTitle, setDocumentTitle] = useState('Tài liệu học tập');
  const [documentText, setDocumentText] = useState('');
  const [isEditingDoc, setIsEditingDoc] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('TEXT');
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<SupportedFileType | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>('DOC');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [expandingTopicIndex, setExpandingTopicIndex] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<ToolTab>('CHAT');
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [summary, setSummary] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [relatedTopics, setRelatedTopics] = useState<RelatedTopic[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [flippedCards, setFlippedCards] = useState<{[key: number]: boolean}>({});
  const [quizAnswers, setQuizAnswers] = useState<{[key: number]: number}>({});

  // Handle initial content coming from ExecutionChat
  useEffect(() => {
    if (initialContent) {
      setDocumentText(initialContent);
      setIsEditingDoc(false); // Switch to view mode
      setDocumentTitle('Kết quả từ AI Prompt');
    }
  }, [initialContent]);

  useEffect(() => {
    return () => { if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl); };
  }, [filePreviewUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (documentText.trim()) {
      try { setChatSession(createStudyChatSession(documentText)); } catch (e) {}
    }
  }, [documentText]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !documentText.trim()) return;
    const userMsg = inputMessage;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputMessage('');
    setIsTyping(true);
    try {
      let session = chatSession || createStudyChatSession(documentText);
      const response = await session.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "AI không thể trả lời." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Lỗi kết nối. Vui lòng thử lại sau." }]);
    } finally { setIsTyping(false); }
  };

  const copyToDoc = (text: string) => {
    setDocumentText(prev => prev + "\n\n--- Trích lục từ thảo luận AI ---\n" + text);
    // Removed alert to avoid interruption flow
  };

  const addTopicToDoc = async (topic: RelatedTopic, index: number) => {
      setExpandingTopicIndex(index);
      try {
          // Generate detailed content for this topic
          const prompt = `Hãy viết một đoạn nội dung giáo dục chi tiết về chủ đề: "${topic.title}". \nBối cảnh: ${topic.description}. \nHãy giải thích rõ ràng, dễ hiểu.`;
          const session = createStudyChatSession(documentText); // Use context to maintain style
          const response = await session.sendMessage({ message: prompt });
          
          setDocumentText(prev => prev + `\n\n### Mở rộng: ${topic.title}\n` + (response.text || ""));
      } catch (e) {
          alert("Lỗi khi thêm nội dung.");
      } finally {
          setExpandingTopicIndex(null);
      }
  };

  const handleTabChange = (tab: ToolTab) => {
    setActiveTab(tab);
  };

  const triggerGeneration = async () => {
    if (!documentText.trim()) {
        alert("Vui lòng nhập nội dung tài liệu ở cột bên trái trước.");
        return;
    }

    setIsGenerating(true);
    
    // Reset specific states based on current tab before generating new
    if (activeTab === 'SUMMARY') setSummary('');
    if (activeTab === 'FLASHCARDS') { setFlashcards([]); setFlippedCards({}); }
    if (activeTab === 'QUIZ') { setQuiz([]); setQuizAnswers({}); }
    if (activeTab === 'EXPAND') setRelatedTopics([]);

    try {
      if (activeTab === 'SUMMARY') setSummary(await generateSummary(documentText));
      else if (activeTab === 'FLASHCARDS') setFlashcards(await generateFlashcards(documentText));
      else if (activeTab === 'QUIZ') setQuiz(await generateQuiz(documentText));
      else if (activeTab === 'EXPAND') setRelatedTopics(await generateRelatedTopics(documentText));
    } catch (e) { alert("Có lỗi khi phân tích nội dung."); }
    finally { setIsGenerating(false); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      const objectUrl = URL.createObjectURL(file);
      setFilePreviewUrl(objectUrl);
      
      // Determine File Type for Visual Mode
      if (file.type.startsWith('image/')) setFileType('IMAGE');
      else if (file.type === 'application/pdf') setFileType('PDF');
      else if (file.type.startsWith('video/')) setFileType('VIDEO');
      else setFileType('OTHER');

      // Default switch to visual mode if supported, otherwise text mode
      const isVisualSupported = file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.startsWith('video/');
      setViewMode(isVisualSupported ? 'VISUAL' : 'TEXT');
      
      setDocumentTitle(file.name.replace(/\.[^/.]+$/, ""));
      setIsProcessingFile(true);
      
      try {
        const text = await extractTextFromFile(file);
        setDocumentText(text);
        setIsEditingDoc(false);
      } catch (err: any) { 
          console.warn(err);
          if (!documentText) setDocumentText("Không thể trích xuất văn bản từ tệp này. Bạn có thể tự nhập ghi chú.");
      }
      finally { setIsProcessingFile(false); }
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  // --- Render Visual Preview ---
  const renderVisualContent = () => {
    if (!filePreviewUrl) return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <p>Chưa có tệp nào được chọn.</p>
      </div>
    );

    switch (fileType) {
      case 'IMAGE':
        return (
          <div className="h-full w-full flex items-center justify-center bg-slate-900 rounded-2xl overflow-hidden">
            <img src={filePreviewUrl} alt="Document Preview" className="max-w-full max-h-full object-contain" />
          </div>
        );
      case 'VIDEO':
        return (
           <div className="h-full w-full flex items-center justify-center bg-black rounded-2xl overflow-hidden">
             <video src={filePreviewUrl} controls className="max-w-full max-h-full" />
           </div>
        );
      case 'PDF':
        return (
          <iframe 
            src={filePreviewUrl} 
            className="w-full h-full rounded-2xl border border-slate-200" 
            title="PDF Preview"
          />
        );
      default:
        return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 text-slate-500 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
               <FileText size={32} />
             </div>
             <h4 className="font-bold text-lg mb-2">Định dạng tài liệu Office</h4>
             <p className="text-sm max-w-xs">
               Trình duyệt không hỗ trợ xem trước trực tiếp file này (Word/PPT). 
               Vui lòng chuyển sang chế độ <strong>"Văn bản"</strong> để xem nội dung đã được AI trích xuất.
             </p>
             <button 
               onClick={() => setViewMode('TEXT')}
               className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-200 transition-colors"
             >
               Chuyển sang xem Văn bản
             </button>
          </div>
        );
    }
  };

  // --- Render Helpers ---

  const renderEmptyState = (icon: string, title: string, desc: string, btnLabel: string) => (
      <div className="text-center bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col items-center">
         <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mb-6 text-4xl shadow-sm">{icon}</div>
         <h4 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">{title}</h4>
         <p className="text-slate-500 font-medium mb-8 leading-relaxed max-w-xs">{desc}</p>
         <button 
           onClick={triggerGeneration} 
           disabled={isGenerating || !documentText}
           className="btn-primary px-10 py-4 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-200 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
         >
           {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Zap size={18} fill="currentColor"/>}
           {btnLabel}
         </button>
      </div>
  );

  const renderFlashcards = () => (
      <div className="space-y-6">
        {isGenerating ? (
           <LoadingSkeleton count={3} type="card" />
        ) : flashcards.length === 0 ? (
           renderEmptyState('🎴', 'Flashcards Thông minh', 'Chuyển đổi nội dung thành thẻ ghi nhớ để ôn tập hiệu quả.', 'Tạo Flashcards')
        ) : (
           <>
             <div className="flex justify-between items-center px-2">
                <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs">Flashcards ({flashcards.length})</h4>
                <button onClick={triggerGeneration} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" title="Tạo lại"><RefreshCw size={16} /></button>
             </div>
             <div className="grid grid-cols-1 gap-6">
                {flashcards.map((card, idx) => (
                    <div 
                       key={idx}
                       onClick={() => setFlippedCards(prev => ({...prev, [idx]: !prev[idx]}))}
                       className="group perspective-1000 cursor-pointer h-56"
                    >
                       <div className={`relative w-full h-full duration-500 preserve-3d transition-all ${flippedCards[idx] ? 'rotate-y-180' : ''}`}>
                          {/* Front */}
                          <div className="absolute w-full h-full backface-hidden bg-white border border-slate-200 rounded-[2rem] shadow-md group-hover:shadow-xl group-hover:border-indigo-300 transition-all flex flex-col items-center justify-center p-8 text-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Mặt trước</span>
                              <div className="font-bold text-slate-800 text-lg line-clamp-4">
                                  <TypewriterMarkdown content={card.front} speed={0} />
                              </div>
                              <span className="text-xs text-indigo-400 font-medium absolute bottom-6 opacity-0 group-hover:opacity-100 transition-opacity">Nhấn để lật</span>
                          </div>
                          {/* Back */}
                          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-indigo-600 rounded-[2rem] shadow-xl flex flex-col items-center justify-center p-8 text-center text-white">
                              <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4">Mặt sau</span>
                              <div className="font-medium text-base leading-relaxed overflow-y-auto max-h-full custom-scrollbar text-white/90">
                                  <TypewriterMarkdown content={card.back} speed={0} />
                              </div>
                          </div>
                       </div>
                    </div>
                ))}
             </div>
           </>
        )}
      </div>
  );

  const renderQuiz = () => (
      <div className="space-y-8 pb-20">
         {isGenerating ? (
             <LoadingSkeleton count={3} type="card" />
         ) : quiz.length === 0 ? (
             renderEmptyState('📝', 'Kiểm tra kiến thức', 'Hệ thống tự động tạo bộ câu hỏi trắc nghiệm từ tài liệu của bạn.', 'Bắt đầu tạo câu hỏi')
         ) : (
             <>
                <div className="flex justify-between items-center px-2">
                    <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs">Bài kiểm tra ({quiz.length} câu)</h4>
                    <button onClick={triggerGeneration} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" title="Tạo bộ mới"><RefreshCw size={16} /></button>
                </div>
                {quiz.map((q, idx) => {
                    const isAnswered = quizAnswers[idx] !== undefined;
                    const isCorrect = isAnswered && quizAnswers[idx] === q.correctAnswerIndex;
                    
                    return (
                        <div key={idx} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-lg">
                            <div className="flex gap-4 mb-6">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-black text-xs flex items-center justify-center">{idx + 1}</span>
                                <div className="font-bold text-slate-800 text-base pt-1">
                                    <TypewriterMarkdown content={q.question} speed={0} />
                                </div>
                            </div>
                            <div className="space-y-3 pl-12">
                                {q.options.map((opt, oIdx) => {
                                    let btnClass = "border-slate-100 hover:bg-slate-50 text-slate-600";
                                    let icon = null;

                                    if (isAnswered) {
                                        if (oIdx === q.correctAnswerIndex) {
                                            btnClass = "bg-emerald-50 border-emerald-200 text-emerald-700 font-bold";
                                            icon = <CheckCircle2 size={16} className="text-emerald-500" />;
                                        } else if (oIdx === quizAnswers[idx]) {
                                            btnClass = "bg-red-50 border-red-200 text-red-600 font-bold";
                                            icon = <XCircle size={16} className="text-red-500" />;
                                        } else {
                                            btnClass = "opacity-50 border-slate-50 text-slate-400 cursor-not-allowed";
                                        }
                                    } else if (quizAnswers[idx] === oIdx) {
                                         btnClass = "bg-indigo-600 text-white border-indigo-600";
                                    }

                                    return (
                                        <button 
                                            key={oIdx} 
                                            onClick={() => !isAnswered && setQuizAnswers(prev => ({...prev, [idx]: oIdx}))}
                                            disabled={isAnswered}
                                            className={`w-full text-left px-5 py-4 rounded-xl text-sm border transition-all flex items-center justify-between ${btnClass}`}
                                        >
                                            <div className="flex-1"><TypewriterMarkdown content={opt} speed={0} /></div>
                                            {icon}
                                        </button>
                                    );
                                })}
                            </div>
                            {isAnswered && (
                                <div className={`mt-6 ml-12 p-4 rounded-xl text-sm leading-relaxed animate-fade ${isCorrect ? 'bg-emerald-50 text-emerald-800' : 'bg-indigo-50 text-indigo-800'}`}>
                                    <span className="font-bold block text-xs uppercase tracking-widest mb-1 opacity-70">Giải thích:</span>
                                    <TypewriterMarkdown content={q.explanation} speed={0} />
                                </div>
                            )}
                        </div>
                    );
                })}
             </>
         )}
      </div>
  );

  const renderExpansion = () => (
      <div className="space-y-6">
          {isGenerating ? (
              <LoadingSkeleton count={3} />
          ) : relatedTopics.length === 0 ? (
             renderEmptyState('✨', 'Mở rộng bài học', 'Khám phá các chủ đề liên quan và nâng cao kiến thức của bạn.', 'Gợi ý chủ đề')
          ) : (
              <>
                 <div className="flex justify-between items-center px-2">
                    <h4 className="font-black text-slate-700 uppercase tracking-widest text-xs">Mở rộng bài học</h4>
                    <button onClick={triggerGeneration} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" title="Tạo lại"><RefreshCw size={16} /></button>
                 </div>
                 <div className="grid gap-4">
                    {relatedTopics.map((topic, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg text-slate-800 group-hover:text-purple-700 transition-colors">{topic.title}</h3>
                                <button 
                                    onClick={() => addTopicToDoc(topic, idx)}
                                    disabled={expandingTopicIndex !== null}
                                    className={`p-2 rounded-full transition-all shadow-sm flex items-center justify-center w-8 h-8 ${expandingTopicIndex === idx ? 'bg-indigo-100 cursor-not-allowed' : 'bg-slate-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`}
                                    title="Thêm nội dung vào tài liệu"
                                >
                                    {expandingTopicIndex === idx ? (
                                        <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Plus size={16} />
                                    )}
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{topic.description}</p>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-lg w-fit">
                                <span className="uppercase tracking-wider">Liên hệ:</span>
                                <span className="text-slate-600 font-medium">{topic.relevance}</span>
                            </div>
                        </div>
                    ))}
                 </div>
              </>
          )}
      </div>
  );

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-100px)] bg-slate-50 overflow-hidden m-0 md:m-8 rounded-none md:rounded-[2.5rem] border-0 md:border border-slate-200 shadow-none md:shadow-2xl h-[calc(100vh-80px)]">
      
      {/* Mobile View Switcher */}
      <div className="lg:hidden p-2 bg-white border-b border-slate-200 flex gap-2">
         <button 
           onClick={() => setMobileView('DOC')} 
           className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mobileView === 'DOC' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500'}`}
         >
            <FileText size={18} /> Tài liệu
         </button>
         <button 
           onClick={() => setMobileView('TOOLS')} 
           className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mobileView === 'TOOLS' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500'}`}
         >
            <Wrench size={18} /> Công cụ AI
         </button>
      </div>

      {/* Left Column: Document & Visual */}
      <div className={`w-full lg:w-7/12 flex flex-col border-r border-slate-200 bg-white relative ${mobileView === 'DOC' ? 'flex h-full' : 'hidden lg:flex'}`}>
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4 md:px-8 bg-white/80 backdrop-blur-md shrink-0 z-10">
          <input 
            type="text" 
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-lg font-black text-slate-800 border-none focus:ring-0 w-full tracking-tight bg-transparent"
          />
          <div className="flex items-center gap-2 md:gap-4">
             {filePreviewUrl && (
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setViewMode('VISUAL')} 
                        className={`px-2 md:px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${viewMode === 'VISUAL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                        title="Xem tài liệu gốc"
                    >
                        <Eye size={14} /> <span className="hidden sm:inline">Visual</span>
                    </button>
                    <button 
                        onClick={() => setViewMode('TEXT')} 
                        className={`px-2 md:px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${viewMode === 'TEXT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                        title="Xem văn bản AI trích xuất"
                    >
                        <FileText size={14} /> <span className="hidden sm:inline">Text</span>
                    </button>
                </div>
             )}
             <button 
                onClick={() => setIsEditingDoc(!isEditingDoc)} 
                disabled={viewMode === 'VISUAL'}
                className={`px-3 md:px-5 py-1.5 text-xs font-bold rounded-xl transition-all ${isEditingDoc ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'} ${viewMode === 'VISUAL' ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Chỉnh sửa văn bản"
             >
                {isEditingDoc ? '💾' : '✏️'}
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white p-6 md:p-14 relative custom-scrollbar">
          {isProcessingFile && (
            <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center backdrop-blur-md">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Đang xử lý nội dung...</h3>
                <p className="text-sm text-slate-400 mt-2 font-medium">Sức mạnh AI đang phân tích dữ liệu</p>
            </div>
          )}

          {!documentText && !filePreviewUrl && isEditingDoc ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
               <div onClick={triggerFileInput} className="w-full max-w-lg border-2 border-indigo-100 border-dashed rounded-[3rem] p-8 md:p-16 hover:bg-indigo-50/30 hover:border-indigo-400 transition-all cursor-pointer group">
                 <div className="text-4xl md:text-6xl mb-6 group-hover:scale-125 transition-transform duration-500">📄</div>
                 <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">Bắt đầu học ngay</h3>
                 <p className="text-sm text-slate-500 mb-8 max-w-xs mx-auto font-medium">
                     Tải lên tài liệu (PDF, Word, PPT), Hình ảnh hoặc Video để AI bắt đầu hỗ trợ bạn.
                 </p>
                 <span className="btn-primary px-8 py-3 rounded-2xl text-sm font-bold shadow-xl block w-full">Chọn tệp tài liệu</span>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf, .docx, .doc, .pptx, .ppt, .txt, image/*, video/*" 
                    onChange={handleFileChange} 
                 />
               </div>
            </div>
          ) : (
            viewMode === 'VISUAL' ? (
                // --- VISUAL MODE ---
                <div className="h-full flex flex-col">
                    {renderVisualContent()}
                </div>
            ) : (
                // --- TEXT MODE ---
                isEditingDoc ? (
                <textarea 
                    className="w-full h-full resize-none border-none focus:ring-0 text-base md:text-lg leading-relaxed text-slate-800 bg-transparent font-serif p-0"
                    value={documentText}
                    placeholder="Dán nội dung bài học vào đây..."
                    onChange={(e) => setDocumentText(e.target.value)}
                />
                ) : (
                <div className="prose prose-indigo max-w-none text-slate-800 font-serif text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                    {/* Use speed=0 to prevent re-typing effect when appending content */}
                    <TypewriterMarkdown content={documentText} speed={0} />
                </div>
                )
            )
          )}
        </div>
      </div>

      {/* Right Column: AI Tools */}
      <div className={`w-full lg:w-5/12 flex-col bg-slate-50/50 ${mobileView === 'TOOLS' ? 'flex h-full' : 'hidden lg:flex'}`}>
        <div className="flex px-4 pt-4 gap-2 border-b border-slate-200 bg-white shrink-0 overflow-x-auto no-scrollbar mask-gradient-x">
          {[
            { id: 'CHAT', label: 'Hỏi đáp', icon: '💬' },
            { id: 'EXPAND', label: 'Mở rộng', icon: '✨' },
            { id: 'FLASHCARDS', label: 'Thẻ nhớ', icon: '🎴' },
            { id: 'QUIZ', label: 'Kiểm tra', icon: '📝' },
            { id: 'SUMMARY', label: 'Tóm tắt', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as ToolTab)}
              className={`flex-1 min-w-[70px] md:min-w-[80px] py-3 md:py-4 text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all rounded-t-2xl flex flex-col items-center justify-center gap-1 flex-shrink-0 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-indigo-500 bg-transparent hover:bg-slate-100'}`}
            >
              <span className="text-sm md:text-base">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative custom-scrollbar">
          {activeTab === 'CHAT' && (
            <div className="space-y-6">
              {messages.length === 0 ? (
                <div className="text-center opacity-40 mt-32">
                  <div className="text-6xl mb-6">💡</div>
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Trợ lý bài học sẵn sàng</p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isLastModelMsg = msg.role === 'model' && idx === messages.length - 1;
                  return (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] p-5 rounded-3xl text-sm leading-relaxed shadow-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'}`}>
                        {msg.role === 'model' ? (
                          <div>
                            <TypewriterMarkdown content={msg.text} speed={isLastModelMsg ? 10 : 0} />
                            <button 
                              onClick={() => copyToDoc(msg.text)}
                              className="mt-4 text-[10px] font-black uppercase text-indigo-500 border-t border-slate-50 pt-3 flex items-center gap-2 hover:underline"
                            >
                              ➕ Thêm vào tài liệu của tôi
                            </button>
                          </div>
                        ) : msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              {isTyping && (
                <div className="flex gap-2 p-4 bg-white rounded-3xl w-max shadow-sm border border-slate-50">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {activeTab === 'SUMMARY' && (
            <div className="space-y-4">
              {isGenerating ? (
                  <div className="flex flex-col items-center py-12">
                     <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                     <p className="text-xs font-bold text-indigo-500 uppercase">Đang cô đọng...</p>
                  </div>
              ) : !summary ? (
                 renderEmptyState('📋', 'Tóm tắt nội dung', 'Cô đọng ý chính, giúp bạn nắm bắt thông tin nhanh chóng.', 'Tạo tóm tắt')
              ) : (
                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                   <div className="text-sm font-medium leading-loose text-slate-700">
                     <TypewriterMarkdown content={summary} speed={5} />
                   </div>
                   <div className="mt-6 flex justify-end">
                      <button onClick={triggerGeneration} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-full transition-all" title="Tạo lại"><RefreshCw size={16} /></button>
                   </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'FLASHCARDS' && renderFlashcards()}

          {activeTab === 'QUIZ' && renderQuiz()}

          {activeTab === 'EXPAND' && renderExpansion()}
        </div>

        {activeTab === 'CHAT' && (
          <div className="p-4 md:p-6 bg-white border-t border-slate-100 shrink-0">
            <div className="relative flex items-center bg-slate-100 rounded-[2rem] border border-slate-100 p-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Hỏi trợ lý bài học..."
                className="flex-1 bg-transparent border-none text-sm font-bold focus:ring-0 px-4 md:px-6 py-3 md:py-4"
              />
              <button onClick={handleSendMessage} className="p-2 md:p-3 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudySpace;
