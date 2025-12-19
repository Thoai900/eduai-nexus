
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import PromptLibrary from './components/PromptLibrary';
import StudySpace from './components/StudySpace';
import AIForEducation from './components/AIForEducation';
import ChatAssistant from './components/ChatAssistant';
import ExecutionChatView from './components/ExecutionChatView';
import Scanner from './components/Scanner';
import { AppView, UserProfile, UserRole, ExecutionState } from './types';
import { AuthService, DataService } from './services/firebaseService';
import { Rocket, Library, ScanLine, Brain, User, X } from 'lucide-react';

const GUEST_PROFILE: UserProfile = {
  id: 'guest',
  name: 'Khách',
  email: '',
  role: UserRole.STUDENT,
  avatar: ''
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(GUEST_PROFILE);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [execState, setExecState] = useState<ExecutionState | null>(null);
  const [studySpaceContent, setStudySpaceContent] = useState<string>('');
  
  // State for Profile Modal
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const storedProfile = localStorage.getItem('user_profile_minimal');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoginLoading(true);
    try {
        const profile = await AuthService.loginWithGoogle();
        setUserProfile(profile);
        setIsAuthenticated(true);
        localStorage.setItem('user_profile_minimal', JSON.stringify(profile));
    } catch (error) { console.error("Login failed", error); }
    finally { setIsLoginLoading(false); }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    localStorage.removeItem('user_profile_minimal');
    setUserProfile(GUEST_PROFILE);
    setIsAuthenticated(false);
    setCurrentView(AppView.HOME);
    setShowProfileModal(false);
  };

  const startExecution = (data: ExecutionState) => {
    setExecState(data);
    setCurrentView(AppView.EXECUTION_CHAT);
  };

  const handleContinueToStudy = (content: string) => {
    setStudySpaceContent(content);
    setCurrentView(AppView.STUDY_SPACE);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.LIBRARY: 
        return <PromptLibrary user={userProfile} onExecute={startExecution} />;
      case AppView.STUDY_SPACE: 
        return <StudySpace initialContent={studySpaceContent} />;
      case AppView.SCANNER:
        return <Scanner onExecute={startExecution} />;
      case AppView.EDUCATION: 
        return <AIForEducation />;
      case AppView.EXECUTION_CHAT:
        return execState ? (
          <ExecutionChatView 
            key={btoa(encodeURIComponent(execState.title + execState.content)).slice(0, 32)} 
            title={execState.title} 
            description={execState.description}
            content={execState.content} 
            onBack={() => setCurrentView(AppView.LIBRARY)}
            onContinueToStudy={handleContinueToStudy}
          />
        ) : <PromptLibrary user={userProfile} onExecute={startExecution} />;
      case AppView.HOME:
      default:
        return (
          <div className="relative px-4 sm:px-6 pb-24 animate-fade overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
                <div className="absolute top-20 right-0 w-64 h-64 md:w-96 md:h-96 bg-indigo-200/40 rounded-full blur-[80px] md:blur-[100px] animate-pulse"></div>
                <div className="absolute top-40 left-0 w-56 h-56 md:w-80 md:h-80 bg-purple-200/40 rounded-full blur-[80px] md:blur-[100px] animate-pulse delay-700"></div>
            </div>

            <div className="mx-auto max-w-7xl pt-12 md:pt-24 pb-20 md:pb-32">
               <div className="flex flex-col items-center text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white border border-slate-100 shadow-sm text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-8 md:mb-10 text-indigo-600">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                    Educational Excellence 4.0
                  </div>
                  <h1 className="text-4xl sm:text-6xl md:text-[7.5rem] font-black tracking-tighter leading-[0.9] mb-8 md:mb-12 uppercase">
                    Kỷ nguyên<br/>
                    <span className="gradient-text">Học tập</span><br/>
                    Tương lai.
                  </h1>
                  <p className="text-base md:text-xl text-slate-500 mb-10 md:mb-14 max-w-2xl font-medium leading-relaxed italic px-4">
                    Tận dụng sức mạnh trí tuệ nhân tạo để cá nhân hóa lộ trình tri thức, 
                    phân tích học liệu chuyên sâu và khơi dậy đam mê sáng tạo.
                  </p>
                  
                  <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-4 sm:gap-8 px-4 sm:px-0">
                    <button 
                       onClick={() => setCurrentView(AppView.STUDY_SPACE)}
                       className="w-full sm:w-auto btn-primary px-10 md:px-16 py-5 md:py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs md:text-sm shadow-2xl shadow-indigo-200 transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                       <Rocket size={20} />
                       Khám phá Góc học tập
                    </button>
                    <button 
                       onClick={() => setCurrentView(AppView.SCANNER)}
                       className="w-full sm:w-auto px-10 md:px-16 py-5 md:py-6 bg-white border-2 border-slate-200 text-slate-800 rounded-[2rem] font-black uppercase tracking-widest text-xs md:text-sm hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-2"
                    >
                       <ScanLine size={20} />
                       Scanner AI
                    </button>
                  </div>
               </div>
            </div>

            <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 px-2 md:px-0">
               {[
                 { title: 'Kiến trúc Prompt', desc: 'Sở hữu bộ câu lệnh tối ưu bậc nhất cho giáo dục đa lĩnh vực.', icon: '📜', color: 'bg-blue-50 text-blue-600' },
                 { title: 'Phân tích Đa kênh', desc: 'Xử lý thông minh từ Word, PDF đến sơ đồ và hình ảnh.', icon: '⚙️', color: 'bg-indigo-50 text-indigo-600' },
                 { title: 'Tư duy Đạo đức', desc: 'Hướng dẫn sử dụng AI bền vững, chính trực và có tư duy phản biện.', icon: '🧭', color: 'bg-purple-50 text-purple-600' }
               ].map((card, i) => (
                 <div key={i} className="bg-white border border-slate-100 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] hover:border-indigo-200 transition-all group shadow-sm hover:shadow-2xl">
                    <div className={`w-14 h-14 md:w-16 md:h-16 ${card.color} rounded-3xl flex items-center justify-center text-2xl md:text-3xl mb-6 md:mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                       {card.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase mb-3 md:mb-4 tracking-tight">{card.title}</h3>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">{card.desc}</p>
                 </div>
               ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navigation 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        userProfile={userProfile} 
        onOpenProfile={() => setShowProfileModal(true)} 
        onLogout={handleLogout} 
        isAuthenticated={isAuthenticated} 
        onLogin={handleLogin} 
      />
      
      {currentView !== AppView.EXECUTION_CHAT && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar mask-gradient-x">
            <button onClick={() => setCurrentView(AppView.STUDY_SPACE)} className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm flex-shrink-0">
                <Rocket size={16} /> Vào học ngay
            </button>
            <button onClick={() => setCurrentView(AppView.LIBRARY)} className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm flex-shrink-0">
                <Library size={16} /> Thư viện Prompt
            </button>
            <button onClick={() => setCurrentView(AppView.SCANNER)} className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm flex-shrink-0">
                <ScanLine size={16} /> Scanner AI
            </button>
            <button onClick={() => setCurrentView(AppView.EDUCATION)} className="whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm flex-shrink-0">
                <Brain size={16} /> Hiểu về AI
            </button>
          </div>
        </div>
      )}

      <main className="animate-fade pb-20 md:pb-0">{renderView()}</main>
      <ChatAssistant />
      
      {/* Login Loading Overlay */}
      {isLoginLoading && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6">
             <div className="flex flex-col items-center gap-6 bg-white p-12 rounded-[4rem] border border-white shadow-2xl">
                 <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                 <div className="text-center">
                    <span className="font-black text-slate-800 uppercase text-sm tracking-widest block mb-1">Xác thực người dùng</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">EduAI Nexus is connecting...</span>
                 </div>
             </div>
        </div>
      )}

      {/* Profile View Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade">
           <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl border border-white relative overflow-hidden flex flex-col items-center">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-indigo-500 to-purple-500 shadow-xl mb-6 mt-4">
                  <div className="w-full h-full rounded-full border-4 border-white overflow-hidden bg-white">
                      {userProfile.avatar ? (
                         <img src={userProfile.avatar} alt="Large Avatar" className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                            <User size={64} />
                         </div>
                      )}
                  </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 text-center mb-1">{userProfile.name}</h3>
              <p className="text-sm font-medium text-slate-500 text-center mb-6">{userProfile.email}</p>
              
              <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest mb-8 ${userProfile.role === UserRole.TEACHER ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {userProfile.role}
              </span>

              <button 
                onClick={handleLogout}
                className="w-full py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold uppercase text-xs tracking-widest hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                Đăng xuất
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
