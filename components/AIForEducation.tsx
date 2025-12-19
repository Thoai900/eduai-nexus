import React from 'react';
import { AI_MODELS, ETHICS_GUIDE } from '../constants';

const AIForEducation: React.FC = () => {
  const getModelImage = (provider: string) => {
      switch(provider) {
          case 'Google': 
            return 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?auto=format&fit=crop&q=80&w=800'; 
          case 'OpenAI': 
            return 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800'; 
          case 'Anthropic': 
            return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'; 
          default: 
            return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800';
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
      
      {/* 1. HERO SECTION */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 text-white mb-20 shadow-2xl border border-slate-700/50">
         {/* Background Image with stronger overlay for text readability */}
         <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000" 
              alt="AI Background" 
              className="w-full h-full object-cover opacity-30" 
            />
            {/* Gradient to ensure text doesn't overlap with busy image details */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent"></div>
         </div>

         {/* Hero Content */}
         <div className="relative z-10 p-10 lg:p-16 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-950/50 backdrop-blur-md text-indigo-300 font-bold text-xs uppercase tracking-wider mb-8">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                Kiến thức nền tảng
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
              Hiểu và Ứng dụng AI <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400 filter drop-shadow-lg">
                Đúng cách & Hiệu quả
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
              Trí tuệ nhân tạo là trợ lý đắc lực, không phải phép màu. Hãy trang bị kiến thức để làm chủ công cụ, tránh các bẫy thông tin và phát triển tư duy sáng tạo.
            </p>
         </div>
      </div>

      {/* 2. MODELS SECTION */}
      <div className="mb-24">
        <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Các "Siêu trí tuệ" phổ biến</h2>
           <p className="text-slate-600 max-w-2xl mx-auto">Mỗi mô hình AI có một thế mạnh riêng. Chọn đúng công cụ cho đúng việc là chìa khóa của thành công.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {AI_MODELS.map((model) => (
            <div key={model.name} className="flex flex-col bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group h-full">
              
              {/* Card Image Area */}
              <div className="h-64 relative overflow-hidden shrink-0">
                 <img 
                    src={getModelImage(model.provider)} 
                    alt={model.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                 />
                 {/* Stronger gradient at bottom for text contrast */}
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
                 
                 <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-4xl filter drop-shadow-md">{model.icon}</span>
                        <h3 className="text-2xl font-bold text-white tracking-tight">{model.name}</h3>
                    </div>
                    <span className="inline-block px-2 py-1 rounded bg-white/20 backdrop-blur-sm text-xs text-white/90 font-semibold uppercase tracking-wider border border-white/10">
                        {model.provider}
                    </span>
                 </div>
              </div>

              {/* Card Content Area */}
              <div className="p-8 flex-1 flex flex-col bg-white">
                <p className="text-slate-600 mb-8 text-sm leading-7 font-medium flex-1">
                    {model.description}
                </p>
                
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px bg-slate-100 flex-1"></div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Điểm mạnh</p>
                    <div className="h-px bg-slate-100 flex-1"></div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {model.strengths.map((str) => (
                      <span key={str} className="text-xs font-bold bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                        {str}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ETHICS SECTION */}
      <div className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100 relative overflow-hidden">
         {/* Decoration Background */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

         <div className="relative z-10">
            {/* Header Centered */}
            <div className="text-center max-w-4xl mx-auto mb-12">
               <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                   La bàn đạo đức <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">trong kỷ nguyên số</span>
               </h2>
               <p className="text-slate-600 text-lg leading-relaxed">
                  Sử dụng AI giống như cầm trong tay một chiếc la bàn quyền năng. Nó có thể dẫn bạn đến kho báu tri thức, nhưng cũng có thể đưa bạn lạc vào mê cung của thông tin sai lệch nếu thiếu sự tỉnh táo.
               </p>
            </div>

            {/* Visual Container with Overlay Cards */}
            <div className="relative">
               {/* Large Image */}
               <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white h-64 md:h-96 w-full relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1501139083565-b74976629e2e?auto=format&fit=crop&q=80&w=2000" 
                    alt="Digital Compass" 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center pb-24 md:pb-16">
                       <p className="text-white/90 text-lg font-medium italic">"Công nghệ là phương tiện, đạo đức là tay lái."</p>
                  </div>
               </div>

               {/* Cards - overlapping */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 -mt-24 relative z-20">
                   {ETHICS_GUIDE.map((guide, idx) => (
                      <div key={idx} className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                         <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl mb-4 shadow-md shrink-0">
                            {idx + 1}
                         </div>
                         <h3 className="text-lg font-bold text-slate-900 mb-2">{guide.title}</h3>
                         <p className="text-slate-600 text-sm leading-relaxed flex-1">
                            {guide.content}
                         </p>
                      </div>
                   ))}
               </div>
            </div>

            {/* Footer Quote */}
            <div className="mt-12 text-center max-w-2xl mx-auto">
               <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 border border-white/50 shadow-sm">
                  <p className="text-indigo-900 font-medium text-lg italic">
                   "AI không thay thế con người, nhưng những người biết sử dụng AI một cách có đạo đức sẽ dẫn đầu tương lai."
                  </p>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default AIForEducation;