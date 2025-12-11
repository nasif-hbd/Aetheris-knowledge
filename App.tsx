
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Network, Mic2, MessageSquare, BookOpen, Menu, Sparkles, Image as ImageIcon, GraduationCap, Globe, X, LogOut, Lightbulb, Timer, Calculator, Sword, Terminal, UserPlus } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { NeuroMap } from './components/NeuroMap';
import { MindMeld } from './components/MindMeld';
import { VisionLab } from './components/VisionLab';
import { QuantumQuiz } from './components/QuantumQuiz';
import { NexusChat } from './components/NexusChat';
import { CosmosLearn } from './components/CosmosLearn';
import { IdeaVault } from './components/IdeaVault';
import { MathPath } from './components/MathPath';
import { SkillForge } from './components/SkillForge';
import { CodeNexus } from './components/CodeNexus';
import { AetherisLogo } from './components/Logo';
import { AuthGate } from './components/AuthGate';
import { View, UserStats, LanguageCode, UserProfile } from './types';
import { LANGUAGES, TRANSLATIONS } from './constants';
import { getStats, saveStats, updateActivity, calculateLevel, resetData, getCurrentUser, logoutUser } from './services/storageService';

const App: React.FC = () => {
  // Auth State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [stats, setStats] = useState<UserStats>(getStats());
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  // Timer State
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  const t = TRANSLATIONS[language];

  // Check for existing session on mount
  useEffect(() => {
      const init = async () => {
          const currentUser = getCurrentUser();
          if (currentUser) {
              setUser(currentUser);
              // Refresh stats from storage (which might have been hydrated from cloud)
              setStats(getStats());
          }
          setLoadingUser(false);
      };
      init();
  }, []);

  // When user changes, ensure we have fresh stats
  useEffect(() => {
      if (user) {
          setStats(getStats());
      }
  }, [user]);

  // Timer Logic
  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
        interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
        setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const toggleTimer = () => setTimerActive(!timerActive);
  const formatTime = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const updateStatsWrapper = (newStats: Partial<UserStats>) => {
    const merged = { ...stats, ...newStats };
    const leveled = calculateLevel(merged);
    const scoreDiff = (leveled.quizScore || 0) - (stats.quizScore || 0);
    const minDiff = (leveled.minutesDebated || 0) - (stats.minutesDebated || 0);
    const nodeDiff = (leveled.nodesExplored || 0) - (stats.nodesExplored || 0);
    const activityVal = (scoreDiff / 10) + (minDiff * 5) + (nodeDiff * 10);
    const finalStats = activityVal > 0 ? updateActivity(leveled, activityVal) : leveled;
    setStats(finalStats);
    saveStats(finalStats);
  };

  const handleLogout = async () => {
      if (confirm("Are you sure you want to log out?")) {
          await logoutUser();
          setUser(null);
      }
  };

  // If user is guest, logging out essentially resets the guest session
  const handleGuestSignup = async () => {
      if (confirm("Sign up now to save your progress permanently?")) {
         await logoutUser(); // Clear guest session
         setUser(null); // Triggers AuthGate
      }
  }

  if (loadingUser) return <div className="h-screen w-screen flex items-center justify-center bg-slate-50"><AetherisLogo className="w-20 h-20 animate-pulse" /></div>;

  // Render AuthGate if not logged in
  if (!user) {
      return <AuthGate onLogin={(u) => setUser(u)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard stats={stats} onNavigate={setCurrentView} language={language} updateStats={updateStatsWrapper} user={user} />;
      case View.NEUROMAP: return <NeuroMap stats={stats} updateStats={updateStatsWrapper} language={language} />;
      case View.MINDMELD: return <MindMeld stats={stats} updateStats={updateStatsWrapper} language={language} />;
      case View.VISIONLAB: return <VisionLab stats={stats} updateStats={updateStatsWrapper} language={language} />;
      case View.QUANTUM_QUIZ: return <QuantumQuiz stats={stats} updateStats={updateStatsWrapper} language={language} />;
      case View.NEXUS_CHAT: return <NexusChat stats={stats} updateStats={updateStatsWrapper} language={language} />;
      case View.COSMOS_LEARN: return <CosmosLearn stats={stats} updateStats={updateStatsWrapper} language={language} />;
      case View.IDEA_VAULT: return <IdeaVault stats={stats} updateStats={updateStatsWrapper} language={language} />;
      case View.MATH_PATH: return <MathPath stats={stats} updateStats={updateStatsWrapper} language={language} />;
      case View.SKILL_FORGE: return <SkillForge stats={stats} updateStats={updateStatsWrapper} language={language} />;
      case View.CODE_NEXUS: return <CodeNexus stats={stats} updateStats={updateStatsWrapper} language={language} />;
      default: return <Dashboard stats={stats} onNavigate={setCurrentView} language={language} updateStats={updateStatsWrapper} user={user} />;
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false);
      }}
      className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
        currentView === view
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-[1.02]'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
      }`}
    >
      <Icon 
        size={18} 
        className={`transition-colors duration-200 ${
          currentView === view ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
        }`} 
      />
      <span>{label}</span>
      {currentView === view && (
         <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
      )}
    </button>
  );

  return (
    <div className="flex h-[100dvh] bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* MOBILE OVERLAY BACKDROP */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
           <div className="mr-3 flex-shrink-0">
              <AetherisLogo className="w-10 h-10 drop-shadow-md" />
           </div>
           <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Aetheris</h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Flow State OS</p>
           </div>
           <button 
             onClick={() => setIsSidebarOpen(false)} 
             className="ml-auto md:hidden text-slate-400 hover:text-slate-600"
           >
             <X size={24} />
           </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 no-scrollbar">
           <div className="px-4 mb-2 text-xs font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
             Command
           </div>
           <NavItem view={View.DASHBOARD} label={t.dashboard} icon={LayoutGrid} />
           <NavItem view={View.NEXUS_CHAT} label={t.nexusChat} icon={MessageSquare} />
           <NavItem view={View.IDEA_VAULT} label={t.ideaVault} icon={Lightbulb} />
           
           <div className="mt-8 px-4 mb-2 text-xs font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500">
             Academy
           </div>
           <NavItem view={View.COSMOS_LEARN} label={t.cosmosLearn} icon={BookOpen} />
           <NavItem view={View.MATH_PATH} label={t.mathPath} icon={Calculator} />
           <NavItem view={View.CODE_NEXUS} label={t.codeNexus} icon={Terminal} />
           <NavItem view={View.SKILL_FORGE} label={t.skillForge} icon={Sword} />
           <NavItem view={View.QUANTUM_QUIZ} label={t.quantumQuiz} icon={GraduationCap} />

           <div className="mt-8 px-4 mb-2 text-xs font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
             Neural Tools
           </div>
           <NavItem view={View.NEUROMAP} label={t.neuroMap} icon={Network} />
           <NavItem view={View.MINDMELD} label={t.mindMeld} icon={Mic2} />
           <NavItem view={View.VISIONLAB} label={t.visionLab} icon={ImageIcon} />
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-2">
           {/* Focus Timer */}
           <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-600 font-bold">
                    <Timer size={16} />
                    <span className="font-mono">{formatTime(timeLeft)}</span>
                </div>
                <button 
                    onClick={toggleTimer}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${timerActive ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}`}
                >
                    {timerActive ? 'PAUSE' : 'FOCUS'}
                </button>
           </div>

           <button 
             onClick={() => setIsLangMenuOpen(true)}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 text-sm font-medium"
           >
             <Globe size={18} className="text-slate-400" />
             <span>Language: <span className="text-slate-900 font-bold">{language.toUpperCase()}</span></span>
           </button>
           
           {user.isGuest ? (
               <button 
                 onClick={handleGuestSignup}
                 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors text-sm font-bold animate-pulse"
               >
                 <UserPlus size={18} />
                 <span>Sign Up to Save</span>
               </button>
           ) : (
               <button 
                 onClick={handleLogout}
                 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors text-slate-500 text-sm font-medium"
               >
                 <LogOut size={18} />
                 <span>Log Out</span>
               </button>
           )}
        </div>
      </aside>

      {/* LANGUAGE SELECTOR MODAL */}
      {isLangMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsLangMenuOpen(false)}>
           <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900">Select Region</h3>
                <button onClick={() => setIsLangMenuOpen(false)}><X size={20} className="text-slate-400"/></button>
              </div>
              <div className="space-y-2">
                 {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setIsLangMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          language === lang.code 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-transparent hover:bg-slate-50'
                      }`}
                    >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-bold text-sm">{lang.name}</span>
                    </button>
                 ))}
              </div>
           </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative bg-[#f8fafc]">
        {/* MOBILE HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 md:hidden flex items-center justify-between px-4 flex-shrink-0 z-20">
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
           >
             <Menu size={24} />
           </button>
           <div className="font-bold text-slate-900 flex items-center gap-2">
             <AetherisLogo className="w-8 h-8" />
             Aetheris
           </div>
           <div className="w-8" /> {/* Spacer */}
        </header>

        {/* SCROLL AREA */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8">
           <div className="max-w-6xl mx-auto h-full">
              {renderContent()}
           </div>
        </div>
      </main>

    </div>
  );
};

export default App;
