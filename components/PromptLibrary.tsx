
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PromptTemplate, UserRole, UserProfile, ExecutionState, AIMode } from '../types';
import { generateSmartPrompt, runGeminiPrompt } from '../services/geminiService';
import { DataService } from '../services/firebaseService';
import { SAMPLE_PROMPTS } from '../constants';
import TypewriterMarkdown from './TypewriterMarkdown';
import { Pencil, Heart, Zap, Brain, Trash2 } from 'lucide-react';

interface PromptLibraryProps {
    user: UserProfile;
    onExecute: (data: ExecutionState) => void;
}

const PromptLibrary: React.FC<PromptLibraryProps> = ({ user, onExecute }) => {
  const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [userIdea, setUserIdea] = useState('');
  const [smartPrompt, setSmartPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveModalPos, setSaveModalPos] = useState<{ x: number, y: number } | null>(null);
  
  // Update state to include 'content' and 'id' for editing
  const [formPromptData, setFormPromptData] = useState({
    id: '',
    title: '',
    description: '',
    content: '',
    category: 'Tổng hợp',
    role: UserRole.STUDENT,
    isPublic: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const [activeQuickTest, setActiveQuickTest] = useState<PromptTemplate | null>(null);
  const [quickTestResult, setQuickTestResult] = useState<string | null>(null);
  const [isQuickTesting, setIsQuickTesting] = useState(false);
  const [quickTestPos, setQuickTestPos] = useState<{ x: number, y: number } | null>(null);
  const [quickTestVars, setQuickTestVars] = useState<Record<string, string>>({});
  const [quickTestMode, setQuickTestMode] = useState<AIMode>('FAST');
  const popupRef = useRef<HTMLDivElement>(null);
  const savePopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadPrompts(); }, [user]);

  const loadPrompts = async () => {
    setIsLoading(true);
    try {
        const dbPrompts = await DataService.getPrompts(user);
        const combinedPrompts = [...dbPrompts, ...SAMPLE_PROMPTS.filter(s => !dbPrompts.find(d => d.id === s.id))];
        setPrompts(combinedPrompts);
    } catch (e) { setPrompts(SAMPLE_PROMPTS); }
    finally { setIsLoading(false); }
  };

  const extractVariables = (text: string) => {
    return Array.from(new Set((text.match(/\[([^\]]+)\]/g) || []).map(m => m.slice(1, -1))));
  };

  const calculatePopupPos = (e: React.MouseEvent, width: number) => {
    // For mobile, we might just center it or use a modal, but let's try to keep it simple first
    if (window.innerWidth < 768) {
        return { x: 20, y: window.scrollY + 100 };
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let x = rect.left;
    if (x + width > window.innerWidth) {
      x = window.innerWidth - width - 20;
    }
    return { x, y: rect.top + window.scrollY };
  };

  const initiateQuickTest = (e: React.MouseEvent, prompt: PromptTemplate) => {
    e.stopPropagation();
    setQuickTestPos(calculatePopupPos(e, 400));
    setActiveQuickTest(prompt);
    setQuickTestResult(null);
    setQuickTestMode('FAST'); // Default to fast
    const vars = extractVariables(prompt.content);
    const initialVals: Record<string, string> = {};
    vars.forEach(v => initialVals[v] = '');
    setQuickTestVars(initialVals);
    setShowSaveModal(false); 
  };

  const initiateSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSaveModalPos(calculatePopupPos(e, 450));
    setIsEditingMode(false);
    setFormPromptData({
      id: '',
      title: userIdea.split('\n')[0].slice(0, 50),
      description: userIdea,
      content: smartPrompt, // Pre-fill with smart generated content
      category: 'Tổng hợp',
      role: UserRole.STUDENT,
      isPublic: true
    });
    setShowSaveModal(true);
    setActiveQuickTest(null);
  };

  const initiateEdit = (e: React.MouseEvent, prompt: PromptTemplate) => {
    e.stopPropagation();
    setSaveModalPos(calculatePopupPos(e, 450));
    setIsEditingMode(true);
    setFormPromptData({
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        content: prompt.content,
        category: prompt.category,
        role: prompt.role,
        isPublic: prompt.isPublic
    });
    setShowSaveModal(true);
    setActiveQuickTest(null);
  };

  const handleDeletePrompt = async (e: React.MouseEvent, prompt: PromptTemplate) => {
      e.stopPropagation();
      if (!window.confirm("Bạn có chắc chắn muốn xóa prompt này không? Hành động này không thể hoàn tác.")) return;

      try {
          const success = await DataService.deletePrompt(prompt.id, user);
          if (success) {
              // Update local state to remove the prompt immediately
              setPrompts(prev => prev.filter(p => p.id !== prompt.id));
              alert("Đã xóa prompt thành công.");
          }
      } catch (error) {
          console.error("Delete failed", error);
          alert("Không thể xóa prompt. Vui lòng thử lại.");
      }
  };

  const handleRunQuickTest = async () => {
    if (!activeQuickTest) return;
    setIsQuickTesting(true);
    setQuickTestResult('');
    let finalPrompt = activeQuickTest.content;
    Object.entries(quickTestVars).forEach(([key, value]) => {
      finalPrompt = finalPrompt.replace(`[${key}]`, value || `[${key}]`);
    });
    try {
      const res = await runGeminiPrompt(
        finalPrompt + "\n\n(Lưu ý: Trả lời cực kỳ súc tích, tóm gọn trong tối đa 2 đoạn văn)", 
        quickTestMode
      );
      setQuickTestResult(res);
    } catch (e) {
      setQuickTestResult("Lỗi khi kết nối AI.");
    } finally {
      setIsQuickTesting(false);
    }
  };

  const handleLike = async (e: React.MouseEvent, prompt: PromptTemplate) => {
    e.stopPropagation();
    if (user.id === 'guest') {
      alert("Vui lòng đăng nhập để yêu thích prompt này!");
      return;
    }

    // Optimistic Update
    const isLiked = prompt.likedBy?.includes(user.id);
    const updatedPrompts = prompts.map(p => {
      if (p.id === prompt.id) {
        const likedBy = p.likedBy ? [...p.likedBy] : [];
        if (isLiked) {
          const idx = likedBy.indexOf(user.id);
          if (idx > -1) likedBy.splice(idx, 1);
        } else {
          likedBy.push(user.id);
        }
        return {
          ...p,
          likes: Math.max(0, (p.likes || 0) + (isLiked ? -1 : 1)),
          likedBy
        };
      }
      return p;
    });
    setPrompts(updatedPrompts);

    // Call API
    try {
      await DataService.toggleLikePrompt(prompt.id, user.id);
    } catch (error) {
      console.error("Like failed", error);
      // Revert if needed, but keeping it simple for now
    }
  };

  const categories = useMemo(() => {
    const cats = Array.from(new Set(prompts.map(p => p.category)));
    return ['ALL', ...cats];
  }, [prompts]);

  const filteredPrompts = prompts.filter(p => {
    if (filterRole !== 'ALL' && p.role !== filterRole) return false;
    if (filterCategory !== 'ALL' && p.category !== filterCategory) return false;
    const search = searchTerm.toLowerCase();
    if (searchTerm && !p.title.toLowerCase().includes(search) && !p.description.toLowerCase().includes(search)) return false;
    return true;
  });

  const handleSmartCreate = async () => {
    if (!userIdea.trim()) return;
    setIsGenerating(true);
    try {
      const res = await generateSmartPrompt(userIdea);
      setSmartPrompt(res.content);
    } catch (e) { alert("Lỗi tạo prompt."); }
    finally { setIsGenerating(false); }
  };

  const handleSaveOrUpdatePrompt = async () => {
    if (!formPromptData.title.trim() || !formPromptData.content.trim()) return;
    setIsSaving(true);
    try {
      const template: PromptTemplate = {
        id: formPromptData.id,
        title: formPromptData.title,
        description: formPromptData.description,
        content: formPromptData.content,
        tags: [formPromptData.category],
        role: formPromptData.role,
        category: formPromptData.category,
        authorId: isEditingMode ? undefined : user.id, // Only set author on create if needed, but existing logic handles it
        isPublic: formPromptData.isPublic,
        createdAt: Date.now()
      };

      if (isEditingMode) {
          // Preserve authorId
          const existingPrompt = prompts.find(p => p.id === formPromptData.id);
          if (existingPrompt) {
            template.authorId = existingPrompt.authorId;
            template.likes = existingPrompt.likes;
            template.likedBy = existingPrompt.likedBy;
          }
          
          await DataService.updatePrompt(template, user);
          alert("Cập nhật thành công!");
      } else {
          template.authorId = user.id;
          await DataService.addPrompt(template);
          alert("Đã lưu prompt thành công!");
          setSmartPrompt('');
          setUserIdea('');
      }

      await loadPrompts();
      setShowSaveModal(false);
    } catch (e) {
      alert("Lỗi khi lưu/cập nhật prompt.");
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative min-h-screen pb-24">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="w-full lg:w-1/3 order-2 lg:order-1">
           <div className="sticky top-24 md:top-28 bg-white rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-indigo-100/50 border border-slate-100">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                 <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                 Kiến tạo thông minh
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2">Smart Architect</h2>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">Mô tả ý tưởng của bạn, AI sẽ thiết kế một Prompt chuẩn xác.</p>
              
              <div className="space-y-6">
                 <textarea 
                   className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 min-h-[140px] transition-all shadow-inner custom-scrollbar"
                   placeholder="VD: Tạo bộ câu hỏi ôn tập môn Sinh học về quá trình quang hợp cho học sinh lớp 11..."
                   value={userIdea}
                   onChange={e => setUserIdea(e.target.value)}
                 />
                 <button 
                   onClick={handleSmartCreate}
                   disabled={isGenerating}
                   className="w-full btn-primary py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 transition-all hover:scale-[1.02]"
                 >
                   {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Thiết kế Prompt ✨"}
                 </button>

                 {smartPrompt && (
                   <div className="mt-8 animate-fade space-y-4">
                      <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100">
                        <label className="text-[9px] font-black text-indigo-400 uppercase mb-2 block">Kết quả kiến tạo:</label>
                        <div className="text-[11px] font-mono leading-relaxed text-indigo-900 bg-white/70 p-4 rounded-xl border border-indigo-100/50 max-h-56 overflow-auto mb-5 custom-scrollbar shadow-sm">
                           {smartPrompt}
                        </div>
                        <div className="flex flex-col gap-3">
                          <button 
                            onClick={() => onExecute({ title: "Prompt mới kiến tạo", content: smartPrompt, description: userIdea })} 
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                          >
                            Dùng ngay 🚀
                          </button>
                          <button 
                            onClick={initiateSave}
                            className="w-full py-4 bg-white border border-indigo-100 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all shadow-sm"
                          >
                            Lưu thư viện 💾
                          </button>
                        </div>
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>

        <div className="w-full lg:w-2/3 space-y-8 md:space-y-10 order-1 lg:order-2">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Thư viện Mẫu</h1>
                <p className="text-sm md:text-base text-slate-500 font-medium italic">Khám phá các câu lệnh tối ưu bậc nhất cho giáo dục.</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-2xl shadow-inner border border-slate-200 w-full md:w-auto">
                 <button onClick={() => setFilterRole('ALL')} className={`flex-1 md:flex-none px-4 md:px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all ${filterRole === 'ALL' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-indigo-500'}`}>Tất cả</button>
                 <button onClick={() => setFilterRole(UserRole.STUDENT)} className={`flex-1 md:flex-none px-4 md:px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all ${filterRole === UserRole.STUDENT ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-indigo-500'}`}>Học sinh</button>
                 <button onClick={() => setFilterRole(UserRole.TEACHER)} className={`flex-1 md:flex-none px-4 md:px-5 py-2.5 rounded-xl text-[10px] md:text-xs font-bold transition-all ${filterRole === UserRole.TEACHER ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-indigo-500'}`}>Giáo viên</button>
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 min-w-[280px] relative group">
                 <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">🔍</span>
                 <input 
                   type="text" 
                   placeholder="Tìm kiếm tiêu đề hoặc mô tả..." 
                   className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 md:py-4.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:border-slate-300"
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
              <select 
                className="w-full md:w-auto bg-white border border-slate-200 rounded-2xl px-6 md:px-8 py-4 md:py-4.5 text-sm font-black text-slate-700 focus:ring-2 focus:ring-indigo-500 shadow-sm transition-all hover:border-slate-300"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
              >
                <option value="ALL">Tất cả môn học</option>
                {categories.filter(c => c !== 'ALL').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {filteredPrompts.map(prompt => {
                const isLiked = prompt.likedBy?.includes(user.id);
                return (
                  <div key={prompt.id} className="group bg-white border border-slate-100 rounded-[3rem] p-6 md:p-8 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 flex flex-col h-full relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-indigo-50 rounded-bl-[5rem] -mr-8 -mt-8 md:-mr-12 md:-mt-12 group-hover:bg-indigo-600 transition-all duration-700 ease-out"></div>
                     
                     <div className="relative z-10 flex justify-between items-start mb-6 md:mb-8">
                        <div className="flex gap-2">
                          <span className="bg-slate-50 text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 md:px-4 py-2 rounded-xl border border-slate-100 group-hover:text-white group-hover:bg-white/20 transition-all">{prompt.category}</span>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-slate-50 shadow-sm flex items-center justify-center text-lg md:text-xl group-hover:scale-110 transition-transform">🎓</div>
                            <button 
                              onClick={(e) => handleLike(e, prompt)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${isLiked ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-red-50 hover:text-red-400'}`}
                            >
                               <Heart size={14} className={isLiked ? "fill-current" : ""} />
                               <span>{prompt.likes || 0}</span>
                            </button>
                        </div>
                     </div>
  
                     <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-3 md:mb-4 uppercase tracking-tighter leading-tight group-hover:text-indigo-900 transition-colors">{prompt.title}</h3>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 md:mb-10 flex-1 line-clamp-3 group-hover:text-slate-600">{prompt.description}</p>
                     
                     <div className="flex gap-2 md:gap-3 pt-6 md:pt-8 border-t border-slate-50">
                        <button 
                          onClick={() => onExecute({ title: prompt.title, description: prompt.description, content: prompt.content })} 
                          className="flex-1 bg-indigo-600 text-white py-4 md:py-4.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:translate-y-0"
                        >
                          Thực thi 🚀
                        </button>
                        <button 
                          onClick={(e) => initiateQuickTest(e, prompt)} 
                          className="px-4 md:px-6 py-4 md:py-4.5 bg-slate-100 text-slate-600 rounded-2xl text-[10px] font-black hover:bg-indigo-50 hover:text-indigo-600 transition-all uppercase tracking-widest border border-transparent hover:border-indigo-100"
                        >
                          Test
                        </button>
                        {user.id === prompt.authorId && (
                            <>
                                <button
                                  onClick={(e) => initiateEdit(e, prompt)}
                                  className="px-3 md:px-4 py-4 md:py-4.5 bg-orange-50 text-orange-500 rounded-2xl hover:bg-orange-100 hover:scale-110 transition-all border border-orange-100/50"
                                  title="Chỉnh sửa"
                                >
                                   <Pencil size={14} />
                                </button>
                                <button
                                  onClick={(e) => handleDeletePrompt(e, prompt)}
                                  className="px-3 md:px-4 py-4 md:py-4.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 hover:scale-110 transition-all border border-red-100/50"
                                  title="Xóa"
                                >
                                   <Trash2 size={14} />
                                </button>
                            </>
                        )}
                     </div>
                  </div>
                );
              })}
              {filteredPrompts.length === 0 && !isLoading && (
                <div className="col-span-full py-24 md:py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                    <div className="text-5xl md:text-6xl mb-6 grayscale opacity-30">🔍</div>
                    <p className="text-lg md:text-xl font-black text-slate-400 uppercase tracking-widest">Không tìm thấy mẫu phù hợp</p>
                    <p className="text-sm text-slate-400 mt-2 font-medium">Hãy thử thay đổi từ khóa hoặc bộ lọc</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {showSaveModal && saveModalPos && (
        <div 
          className="absolute z-[110] w-full max-w-md animate-fade shadow-2xl"
          style={{ 
              left: window.innerWidth < 768 ? '50%' : `${saveModalPos.x}px`, 
              top: window.innerWidth < 768 ? '100px' : `${saveModalPos.y + 40}px`,
              transform: window.innerWidth < 768 ? 'translateX(-50%)' : 'none'
          }}
        >
          <div ref={savePopupRef} className="glass-panel p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-white shadow-2xl bg-white/95 backdrop-blur-3xl relative">
             <button onClick={() => setShowSaveModal(false)} className="absolute top-6 right-6 md:top-8 md:right-8 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all hover:scale-110 shadow-sm">✕</button>
             <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-6 md:mb-8 shadow-inner">
                 {isEditingMode ? <Pencil size={24} /> : '💾'}
             </div>
             <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                 {isEditingMode ? "Cập nhật Prompt" : "Lưu Prompt mới"}
             </h3>
             <p className="text-sm text-slate-500 mb-8 md:mb-10 font-medium italic">
                 {isEditingMode ? "Chỉnh sửa thông tin và nội dung prompt." : "Hoàn thiện hồ sơ để lưu trữ vào thư viện tri thức."}
             </p>
             
             <div className="space-y-5 md:space-y-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Tiêu đề (Bắt buộc) *</label>
                  <input 
                    type="text"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 shadow-inner"
                    value={formPromptData.title}
                    onChange={e => setFormPromptData({...formPromptData, title: e.target.value})}
                    placeholder="VD: Phân tích tế bào quang hợp..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Nội dung Prompt *</label>
                  <textarea 
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4.5 text-sm font-mono text-slate-700 focus:ring-2 focus:ring-indigo-500 shadow-inner h-32 resize-none custom-scrollbar"
                    value={formPromptData.content}
                    onChange={e => setFormPromptData({...formPromptData, content: e.target.value})}
                    placeholder="Nội dung câu lệnh gửi cho AI..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Mô tả mục đích</label>
                  <textarea 
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4.5 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 shadow-inner h-24 resize-none custom-scrollbar"
                    value={formPromptData.description}
                    onChange={e => setFormPromptData({...formPromptData, description: e.target.value})}
                    placeholder="Prompt này hỗ trợ giáo viên/học sinh như thế nào?"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Chuyên mục</label>
                    <select 
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4.5 text-xs font-black text-slate-700 focus:ring-2 focus:ring-indigo-500 shadow-inner appearance-none"
                      value={formPromptData.category}
                      onChange={e => setFormPromptData({...formPromptData, category: e.target.value})}
                    >
                      <option>Toán học</option><option>Vật lý</option><option>Hóa học</option>
                      <option>Ngữ văn</option><option>Lịch sử</option><option>Địa lý</option>
                      <option>Tiếng Anh</option><option>Lập trình</option><option>Tổng hợp</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2.5 block">Đối tượng</label>
                    <select 
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4.5 text-xs font-black text-slate-700 focus:ring-2 focus:ring-indigo-500 shadow-inner appearance-none"
                      value={formPromptData.role}
                      onChange={e => setFormPromptData({...formPromptData, role: e.target.value as UserRole})}
                    >
                      <option value={UserRole.STUDENT}>Học sinh</option>
                      <option value={UserRole.TEACHER}>Giáo viên</option>
                    </select>
                  </div>
                </div>
                <button 
                  onClick={handleSaveOrUpdatePrompt}
                  disabled={isSaving || !formPromptData.title.trim() || !formPromptData.content.trim()}
                  className="w-full btn-primary py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-indigo-100 flex items-center justify-center gap-4 active:scale-95 transition-all mt-4"
                >
                  {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isEditingMode ? "Cập nhật thay đổi ✨" : "Xác nhận lưu thư viện ✨")}
                </button>
             </div>
          </div>
        </div>
      )}

      {activeQuickTest && quickTestPos && (
        <div 
          ref={popupRef}
          className="absolute z-[100] w-full max-w-sm animate-fade shadow-2xl px-4 md:px-0"
          style={{ 
              left: window.innerWidth < 768 ? '50%' : `${quickTestPos.x}px`, 
              top: window.innerWidth < 768 ? '100px' : `${quickTestPos.y + 60}px`,
              transform: window.innerWidth < 768 ? 'translateX(-50%)' : 'none'
          }}
        >
          <div className="glass-panel p-6 md:p-8 rounded-[3rem] border border-white shadow-2xl relative bg-white/95 backdrop-blur-3xl">
            <button 
              onClick={() => setActiveQuickTest(null)} 
              className="absolute -top-3 -right-3 w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-lg transition-all hover:scale-110"
            >
              ✕
            </button>
            <div className="mb-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">🧪</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Sandbox Test nhanh</h4>
                <p className="text-xs font-black text-slate-800 truncate leading-none">{activeQuickTest.title}</p>
              </div>
            </div>
            
            {!quickTestResult && (
                <div className="mb-6 bg-slate-50 p-1.5 rounded-xl flex gap-1 border border-slate-100">
                    <button 
                        onClick={() => setQuickTestMode('FAST')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 ${quickTestMode === 'FAST' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                        <Zap size={12} fill={quickTestMode === 'FAST' ? 'currentColor' : 'none'}/> Nhanh
                    </button>
                    <button 
                        onClick={() => setQuickTestMode('THINKING')}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 ${quickTestMode === 'THINKING' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'}`}
                    >
                        <Brain size={12} /> Tư duy
                    </button>
                </div>
            )}

            {!quickTestResult && !isQuickTesting && extractVariables(activeQuickTest.content).length > 0 && (
              <div className="space-y-5 mb-8 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                {extractVariables(activeQuickTest.content).map(v => (
                  <div key={v} className="group">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1.5 block group-focus-within:text-indigo-600 transition-colors">{v}</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-xs font-black text-indigo-900 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                      placeholder={`Nhập ${v}...`}
                      value={quickTestVars[v] || ''}
                      onChange={e => setQuickTestVars(prev => ({...prev, [v]: e.target.value}))}
                    />
                  </div>
                ))}
              </div>
            )}

            {!quickTestResult && (
              <button 
                onClick={handleRunQuickTest}
                disabled={isQuickTesting}
                className={`w-full btn-primary py-4.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 mb-2 ${quickTestMode === 'THINKING' ? 'shadow-purple-200 bg-gradient-to-r from-purple-600 to-pink-600' : 'shadow-indigo-100'}`}
              >
                {isQuickTesting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>AI đang phân tích...</span>
                  </>
                ) : (
                  <>🚀 Kích hoạt Phản hồi</>
                )}
              </button>
            )}

            {quickTestResult && (
              <div className="mt-2 animate-fade">
                <div className="text-[13px] font-medium text-slate-700 leading-relaxed max-h-96 overflow-y-auto pr-4 custom-scrollbar prose prose-sm scroll-smooth">
                  <TypewriterMarkdown content={quickTestResult} speed={10} />
                </div>
                <button 
                  onClick={() => setQuickTestResult(null)} 
                  className="mt-8 w-full py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase rounded-2xl hover:bg-slate-100 transition-all tracking-widest border border-slate-100"
                >
                  Thử lại với tham số khác
                </button>
              </div>
            )}
            <div className="mt-6 pt-6 border-t border-slate-100/50">
               <p className="text-[10px] text-slate-400 font-bold italic text-center leading-relaxed">Kết quả test chỉ mang tính chất tham khảo. <br/>Dùng "Thực thi" để thảo luận đầy đủ.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptLibrary;
