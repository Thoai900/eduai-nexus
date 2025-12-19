
import React, { useState, useEffect } from 'react';
import { AppView, UserProfile } from '../types';
import { Home, Library, Rocket, Brain, User, Settings, LogOut, ScanLine } from 'lucide-react';

interface NavigationProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
  onLogin: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ 
    currentView, 
    onNavigate, 
    userProfile, 
    onOpenProfile, 
    onLogout, 
    isAuthenticated, 
    onLogin 
}) => {
  const [imgError, setImgError] = useState(false);

  // Reset error state when avatar changes
  useEffect(() => {
    setImgError(false);
  }, [userProfile.avatar]);

  const navItems = [
    { id: AppView.HOME, label: 'Trang chủ', icon: Home },
    { id: AppView.LIBRARY, label: 'Thư viện Prompt', icon: Library },
    { id: AppView.STUDY_SPACE, label: 'Góc học tập', icon: Rocket },
    { id: AppView.SCANNER, label: 'Scanner AI', icon: ScanLine },
    { id: AppView.EDUCATION, label: 'Hiểu về AI', icon: Brain },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <div className="sticky top-0 z-50 px-4 pt-4 hidden md:block">
        <nav className="mx-auto max-w-7xl rounded-3xl px-6 bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg shadow-indigo-100/50">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => onNavigate(AppView.HOME)}
            >
              <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
                E
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  EduAI Nexus
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] -mt-1">Tương lai giáo dục</span>
              </div>
            </div>

            {/* Desktop Nav Items */}
            <div className="flex items-center gap-1 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-100">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-indigo-600 hover:bg-white/50'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                  </button>
                );
              })}
            </div>
            
            {/* User Profile / Login */}
            <div className="flex items-center group relative">
              <button className="flex items-center gap-3 p-1 pr-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-0.5 shadow-inner overflow-hidden flex-shrink-0">
                     {isAuthenticated && userProfile.avatar && !imgError ? (
                       <img 
                          src={userProfile.avatar} 
                          alt="Avatar" 
                          className="w-full h-full rounded-[10px] object-cover bg-white" 
                          onError={() => setImgError(true)}
                       />
                     ) : (
                       <div className="w-full h-full rounded-[10px] flex items-center justify-center text-xl text-slate-400 bg-white"><User size={20} /></div>
                     )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-slate-800 leading-none mb-1 max-w-[120px] truncate">
                      {isAuthenticated ? userProfile.name : "Khách"}
                  </p>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                      {isAuthenticated ? userProfile.role : "Trải nghiệm"}
                  </p>
                </div>
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden transform group-hover:translate-y-0 translate-y-2">
                  {isAuthenticated ? (
                      <div className="p-3">
                          <div className="px-4 py-3 mb-2 bg-slate-50 rounded-2xl">
                             <p className="text-xs text-slate-500 font-medium">Đăng nhập với</p>
                             <p className="text-sm font-bold text-slate-800 truncate" title={userProfile.email}>{userProfile.email}</p>
                          </div>
                          <button onClick={onOpenProfile} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 rounded-xl font-bold transition-colors flex items-center gap-3">
                              <User size={16} /> Hồ sơ cá nhân
                          </button>
                          <div className="h-px bg-slate-100 my-2"></div>
                          <button onClick={onLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl font-bold transition-colors flex items-center gap-3">
                              <LogOut size={16} /> Đăng xuất
                          </button>
                      </div>
                  ) : (
                      <div className="p-6 text-center">
                          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4">🔐</div>
                          <h4 className="font-bold text-slate-800 mb-1">Tham gia cộng đồng</h4>
                          <p className="text-xs text-slate-500 mb-6 leading-relaxed">Đăng nhập để lưu trữ các bài học và prompt cá nhân của bạn.</p>
                          <button 
                              onClick={onLogin} 
                              className="w-full btn-primary px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100"
                          >
                              Đăng nhập bằng Google
                          </button>
                      </div>
                  )}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Header (Sticky Logo Only) */}
      <div className="md:hidden sticky top-0 z-50 px-4 pt-4">
        <div className="rounded-2xl px-5 py-3 bg-white/80 backdrop-blur-xl border border-white/40 shadow-md flex justify-between items-center">
          <div className="flex items-center gap-2" onClick={() => onNavigate(AppView.HOME)}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">E</div>
            <span className="font-black text-slate-900 tracking-tight">EduAI Nexus</span>
          </div>
          {isAuthenticated ? (
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-100 shadow-sm" onClick={onOpenProfile}>
               {userProfile.avatar && !imgError ? (
                 <img 
                    src={userProfile.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                    onError={() => setImgError(true)}
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400"><User size={16} /></div>
               )}
            </div>
          ) : (
            <button onClick={onLogin} className="text-[10px] font-black uppercase text-indigo-600">Đăng nhập</button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <nav className="glass-panel rounded-full px-2 py-2 flex justify-between items-center shadow-2xl shadow-indigo-200/50 border border-white/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-full transition-all flex-1 gap-1 ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50/50'
                    : 'text-slate-400'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-[9px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {item.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Navigation;
