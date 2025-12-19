
import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage, AIMode } from '../types';
import ReactMarkdown from 'react-markdown';
import TypewriterMarkdown from './TypewriterMarkdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Zap, Brain } from 'lucide-react';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AIMode>('FAST');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMsg.text, mode);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`fixed z-50 flex flex-col items-end ${isOpen ? 'inset-0 sm:inset-auto sm:bottom-6 sm:right-6' : 'bottom-24 right-4 sm:bottom-6 sm:right-6'}`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white sm:rounded-2xl shadow-2xl border border-slate-200 w-full h-full sm:w-96 sm:h-[550px] mb-0 sm:mb-4 flex flex-col overflow-hidden animate-fade-in transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 pb-3 flex flex-col gap-3 text-white">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <div>
                    <h3 className="font-bold text-sm">Trợ lý AI</h3>
                    <p className="text-xs opacity-80">Luôn sẵn sàng hỗ trợ</p>
                </div>
                </div>
                <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            
            {/* Mode Switcher */}
            <div className="bg-white/10 p-1 rounded-xl flex gap-1">
                <button 
                  onClick={() => setMode('FAST')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${mode === 'FAST' ? 'bg-white text-indigo-600 shadow-sm' : 'text-white/70 hover:bg-white/5'}`}
                >
                    <Zap size={12} fill={mode === 'FAST' ? 'currentColor' : 'none'} /> Nhanh
                </button>
                <button 
                  onClick={() => setMode('THINKING')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 sm:py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${mode === 'THINKING' ? 'bg-white text-purple-600 shadow-sm' : 'text-white/70 hover:bg-white/5'}`}
                >
                    <Brain size={12} /> Tư duy
                </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 mt-12">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    {mode === 'FAST' ? '⚡' : '🧠'}
                </div>
                <p className="text-sm font-bold text-slate-600">
                    Chế độ: {mode === 'FAST' ? 'Phản hồi nhanh' : 'Tư duy sâu'}
                </p>
                <p className="text-xs mt-1 text-slate-400 max-w-[200px] mx-auto">
                    {mode === 'FAST' 
                        ? 'Sử dụng Gemini Flash Lite cho tốc độ tối đa.' 
                        : 'Sử dụng Gemini Pro với khả năng suy luận phức tạp.'}
                </p>
              </div>
            )}
            {messages.map((msg, idx) => {
              const isLastMessage = idx === messages.length - 1;
              return (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm overflow-hidden ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm prose prose-sm max-w-none'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      msg.text
                    ) : (
                      // Only animate the very last message from the model
                      isLastMessage ? 
                      <TypewriterMarkdown content={msg.text} /> : 
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.text}</ReactMarkdown>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 pb-safe sm:pb-3">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn..."
                disabled={isLoading}
                className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-full text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className={`absolute right-1.5 top-1.5 p-2 rounded-full text-white disabled:opacity-50 transition-colors ${mode === 'THINKING' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
            <span className="text-xl sm:text-2xl transform group-hover:rotate-12 transition-transform">💬</span>
        </button>
      )}
    </div>
  );
};

export default ChatAssistant;
