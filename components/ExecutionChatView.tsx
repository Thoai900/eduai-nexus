
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChatMessage, AIMode } from '../types';
import { createStudyChatSession } from '../services/geminiService';
import TypewriterMarkdown from './TypewriterMarkdown';
import { Chat } from '@google/genai';
import { Zap, Brain, Rocket, ExternalLink, Globe } from 'lucide-react';

interface ExecutionChatViewProps {
  title: string;
  description?: string;
  content: string;
  onBack: () => void;
  onContinueToStudy: (content: string) => void;
}

const ExecutionChatView: React.FC<ExecutionChatViewProps> = ({ title, description, content, onBack, onContinueToStudy }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [isAITyping, setIsAITyping] = useState(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [promptContent, setPromptContent] = useState(content);
  const [mode, setMode] = useState<AIMode>('THINKING'); // Default to Thinking for complex execution
  const scrollRef = useRef<HTMLDivElement>(null);

  // Extract variables dynamically from current promptContent state
  const variables = useMemo(() => {
    const matches = promptContent.match(/\[([^\]]+)\]/g) || [];
    return Array.from(new Set(matches.map(m => m.slice(1, -1))));
  }, [promptContent]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAITyping]);

  // Helper function to extract sources
  const extractSources = (response: any) => {
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web)
      .map((web: any) => ({ title: web.title, uri: web.uri }));
  };

  const handleStart = async () => {
    setIsAITyping(true);
    let finalPrompt = promptContent;
    
    // Replace variable markers with actual values
    Object.entries(variableValues).forEach(([key, value]) => {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\[${escapedKey}\\]`, 'g');
      finalPrompt = finalPrompt.replace(regex, value || `[${key}]`);
    });

    try {
      const session = createStudyChatSession(
        "Bạn là trợ lý giáo dục YouLearn AI chuyên nghiệp. Hãy thực thi các yêu cầu dưới đây một cách chi tiết, chính xác và có cấu trúc rõ ràng.",
        mode
      );
      setChatSession(session);
      
      setMessages([{ role: 'user', text: finalPrompt }]);
      
      const response = await session.sendMessage({ message: finalPrompt });
      const sources = extractSources(response);
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || "", sources }]);
    } catch (e) {
      console.error("Execution error:", e);
      setMessages(prev => [...prev, { role: 'model', text: "Lỗi thực thi. Hãy kiểm tra lại kết nối API hoặc nội dung prompt." }]);
    } finally {
      setIsAITyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsAITyping(true);
    try {
      const response = await chatSession.sendMessage({ message: userMsg });
      const sources = extractSources(response);
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || "", sources }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "Lỗi AI. Hãy thử lại." }]);
    } finally {
      setIsAITyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-white overflow-hidden animate-fade">
      {/* Sidebar: Parameters & Prompt Info */}
      <div className="w-full lg:w-[450px] border-r border-slate-100 flex flex-col bg-slate-50/50 overflow-y-auto custom-scrollbar">
        <div className="p-10 border-b border-slate-100 bg-white">
          <button onClick={onBack} className="mb-8 flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Quay lại thư viện
          </button>
          
          <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white text-3xl shadow-2xl shadow-indigo-100 mb-8">⚡</div>
          
          <h2 className="text-3xl font-black text-slate-900 leading-tight uppercase tracking-tighter mb-4">{title}</h2>
          {description && (
            <p className="text-sm text-slate-500 font-medium leading-relaxed italic border-l-4 border-indigo-100 pl-4 py-1">
              {description}
            </p>
          )}
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
               <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Ready</p>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-12 flex-1">
          {/* Mode Selector */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Chế độ xử lý</h4>
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
               <button 
                 onClick={() => setMode('FAST')}
                 className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all ${mode === 'FAST' ? 'bg-indigo-50 text-indigo-600 shadow-inner' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                  <Zap size={18} className="mb-1" fill={mode === 'FAST' ? "currentColor" : "none"}/>
                  <span className="text-[10px] font-black uppercase tracking-wider">Nhanh</span>
               </button>
               <button 
                 onClick={() => setMode('THINKING')}
                 className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all ${mode === 'THINKING' ? 'bg-purple-50 text-purple-600 shadow-inner' : 'text-slate-400 hover:bg-slate-50'}`}
               >
                  <Brain size={18} className="mb-1" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Tư duy</span>
               </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 text-center italic">
                {mode === 'FAST' ? 'Tốc độ cao (Gemini Flash Lite)' : 'Suy luận sâu (Gemini Pro + Thinking)'}
            </p>
          </div>

          {variables.length > 0 && (
            <div className="animate-fade">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cấu hình tham số</h4>
                <span className="text-[9px] bg-indigo-100 text-indigo-600 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest">{variables.length} biến số</span>
              </div>
              <div className="space-y-6">
                {variables.map((v: string) => (
                  <div key={v} className="group">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2 block group-focus-within:text-indigo-600 transition-colors">{v}</label>
                    <input 
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm group-hover:border-slate-300"
                      placeholder={`Nhập giá trị cho [${v}]...`}
                      value={variableValues[v] || ''}
                      onChange={e => setVariableValues(prev => ({...prev, [v]: e.target.value}))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mã nguồn Prompt</label>
              <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">Editable</div>
            </div>
            <textarea 
              className="w-full h-48 bg-slate-900 border-none rounded-3xl p-6 font-mono text-[11px] leading-relaxed text-indigo-300 focus:ring-2 focus:ring-indigo-500 resize-none shadow-2xl custom-scrollbar selection:bg-indigo-500/30"
              value={promptContent}
              onChange={e => setPromptContent(e.target.value)}
              placeholder="Chưa có nội dung mã lệnh..."
            />
          </div>

          <button 
            onClick={handleStart}
            disabled={isAITyping}
            className={`w-full btn-primary py-5 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 mt-6 ${mode === 'THINKING' ? 'shadow-purple-200 bg-gradient-to-r from-purple-600 to-pink-600' : 'shadow-indigo-200'}`}
          >
            {isAITyping ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>Kích hoạt Workspace {mode === 'FAST' ? '⚡' : '🧠'}</>
            )}
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50 relative">
        <div className="flex-1 overflow-y-auto p-8 lg:p-14 space-y-12 pb-40 custom-scrollbar scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 animate-pulse">
              <div className="w-32 h-32 bg-white rounded-[3.5rem] flex items-center justify-center text-7xl mb-10 shadow-sm border border-slate-100">💡</div>
              <h3 className="text-2xl font-black uppercase tracking-[0.2em] text-slate-400 mb-4">YouLearn AI Engine</h3>
              <p className="text-sm font-medium italic text-slate-400 max-w-sm text-center leading-relaxed px-10">
                Hãy hoàn thành cấu hình bên trái và nhấn <strong>Kích hoạt</strong> để bắt đầu hành trình khai phá tri thức cùng AI.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isLastModelMessage = msg.role === 'model' && idx === messages.length - 1;
              return (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade`}>
                  <div className={`max-w-[85%] lg:max-w-[80%] p-8 lg:p-10 rounded-[3.5rem] text-sm lg:text-base leading-loose shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white chat-bubble-user shadow-indigo-100 font-mono whitespace-pre-wrap' 
                      : 'bg-white border border-slate-100 text-slate-800 chat-bubble-model prose prose-indigo max-w-none shadow-slate-100'
                  }`}>
                    {msg.role === 'model' ? (
                      <div>
                        <TypewriterMarkdown content={msg.text} speed={10} />
                        
                        {/* Grounding Sources Display */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-2 mb-3 text-slate-400">
                                <Globe size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Nguồn tham khảo</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {msg.sources.map((source, i) => (
                                    <a 
                                      key={i}
                                      href={source.uri}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-100 hover:bg-white transition-all max-w-full truncate"
                                      title={source.title}
                                    >
                                        <ExternalLink size={10} />
                                        <span className="truncate max-w-[150px]">{source.title}</span>
                                    </a>
                                ))}
                            </div>
                          </div>
                        )}

                        <button 
                          onClick={() => onContinueToStudy(msg.text)}
                          className="mt-6 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100 hover:shadow-lg"
                        >
                           <Rocket size={14} /> Tiếp tục tại Góc học tập
                        </button>
                      </div>
                    ) : (
                      <div className="text-[13px] font-bold opacity-90 leading-relaxed">{msg.text}</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          {isAITyping && (
            <div className="flex justify-start animate-fade">
              <div className="bg-white border border-slate-100 p-6 rounded-[2.5rem] chat-bubble-model shadow-sm flex gap-2.5">
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Floating Input Bar */}
        {chatSession && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
            <div className="glass-panel rounded-[3.5rem] border border-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.3)] p-3 flex items-center gap-4 bg-white/70 backdrop-blur-3xl">
              <input 
                type="text" 
                className="flex-1 bg-transparent border-none text-sm lg:text-base font-bold text-slate-800 focus:ring-0 px-8 py-5"
                placeholder="Đặt câu hỏi tiếp theo hoặc yêu cầu AI tinh chỉnh kết quả..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isAITyping || !input.trim()}
                className={`w-16 h-16 text-white rounded-[2rem] shadow-2xl hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center shrink-0 active:scale-90 ${mode === 'THINKING' ? 'bg-purple-600 shadow-purple-200 hover:bg-purple-700' : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700'}`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionChatView;
