/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  Award, 
  Home, 
  ExternalLink, 
  CheckCircle2, 
  ChevronRight,
  Send,
  User,
  PlayCircle
} from 'lucide-react';
import { initializeAppodeal, showInterstitial } from './services/adService';

// --- Types ---

interface Module {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
}

interface DailyEntry {
  date: string;
  learnt: string;
  feel: string;
  action: string;
}

// --- Data ---

const MODULES: Module[] = [
  {
    id: 'fundamentals',
    title: 'Fundamentals of Business',
    description: 'Core concepts of starting and running a business.',
    url: 'https://www.merlot.org/merlot/viewMaterial.htm?id=1225330',
    icon: <BookOpen className="w-6 h-6 text-blue-500" />
  },
  {
    id: 'management',
    title: 'Management',
    description: 'Principles of effective organizational management.',
    url: 'https://www.merlot.org/merlot/viewMaterial.htm?id=906847',
    icon: <User className="w-6 h-6 text-purple-500" />
  },
  {
    id: 'innovation',
    title: 'Networking Minds',
    description: 'Open innovation and solving complex problems (Video).',
    url: 'https://www.merlot.org/merlot/viewMaterial.htm?id=1379748',
    icon: <ExternalLink className="w-6 h-6 text-orange-500" />
  },
  {
    id: 'vc-game',
    title: 'Venture Capital Game',
    description: 'Interactive simulation of the VC investment process.',
    url: 'https://www.merlot.org/merlot/viewMaterial.htm?id=83899',
    icon: <Award className="w-6 h-6 text-green-500" />
  }
];

// --- Components ---

const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
  <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`} onClick={onClick}>
    {children}
  </div>
);

const Button = ({ children, onClick, className = "", variant = "primary" }: { children: React.ReactNode, onClick?: () => void, className?: string, variant?: "primary" | "secondary" | "outline" }) => {
  const base = "px-4 py-2 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-200 text-gray-600 hover:bg-gray-50"
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'modules' | 'log' | 'cert'>('home');
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [newEntry, setNewEntry] = useState({ learnt: '', feel: '', action: '' });

  // Load entries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ggts_entries');
    if (saved) setEntries(JSON.parse(saved));
    
    // Initialize Appodeal
    initializeAppodeal();
  }, []);

  const saveEntry = () => {
    if (!newEntry.learnt || !newEntry.feel || !newEntry.action) return;
    const entry: DailyEntry = {
      ...newEntry,
      date: new Date().toLocaleDateString()
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem('ggts_entries', JSON.stringify(updated));
    setNewEntry({ learnt: '', feel: '', action: '' });
    setShowEntryForm(false);
  };

  const progress = Math.min((entries.length / 180) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-blue-600">GGTS Entrepreneur</h1>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Gifted & Talented School</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <Award className="w-6 h-6 text-blue-600" />
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Welcome Card */}
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none">
                <h2 className="text-2xl font-bold mb-2">Welcome, Future Leader</h2>
                <p className="text-blue-100 text-sm mb-4">
                  Master the fundamentals of entrepreneurship and earn your certificate of proficiency.
                </p>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Certification Progress</span>
                    <span>{entries.length} / 180 Days</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" className="h-24 flex-col" onClick={() => setActiveTab('log')}>
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <span className="text-sm">Daily Log</span>
                </Button>
                <Button variant="secondary" className="h-24 flex-col" onClick={() => window.open('https://widget.kommunicate.io/chat?appId=257c6b05db5c501f9b97f3b9ff6507cae', '_blank')}>
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                  <span className="text-sm">Chat Guru</span>
                </Button>
                <Button variant="secondary" className="col-span-2 h-16" onClick={showInterstitial}>
                  <PlayCircle className="w-6 h-6 text-red-500" />
                  <span className="text-sm">Show Interstitial Ad (Demo)</span>
                </Button>
              </div>

              {/* Featured Module */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold">Featured Modules</h3>
                  <button onClick={() => setActiveTab('modules')} className="text-blue-600 text-sm font-medium">View All</button>
                </div>
                <div className="space-y-3">
                  {MODULES.slice(0, 2).map(module => (
                    <Card key={module.id} className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => window.open(module.url, '_blank')}>
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                        {module.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{module.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{module.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </Card>
                  ))}
                </div>
              </section>

              {/* School Info */}
              <section className="pt-4 pb-8 text-center">
                <p className="text-xs text-gray-400 mb-2">Created by</p>
                <a 
                  href="https://www.gladstar.sch.ng" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Gladstar Gifted & Talented School
                  <ExternalLink className="w-3 h-3" />
                </a>
              </section>
            </motion.div>
          )}

          {activeTab === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold">Learning Resources</h2>
              <div className="space-y-3">
                {MODULES.map(module => (
                  <Card key={module.id} className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => window.open(module.url, '_blank')}>
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{module.title}</h4>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-300" />
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'log' && (
            <motion.div
              key="log"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Daily Learning Log</h2>
                <Button onClick={() => setShowEntryForm(true)}>Add Entry</Button>
              </div>

              {showEntryForm && (
                <Card className="space-y-4 border-blue-200 bg-blue-50/30">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">What have you just learnt?</label>
                    <textarea 
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm min-h-[80px]"
                      placeholder="Today I learned about..."
                      value={newEntry.learnt}
                      onChange={e => setNewEntry({...newEntry, learnt: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">How do you feel about it?</label>
                    <textarea 
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm min-h-[80px]"
                      placeholder="I feel inspired because..."
                      value={newEntry.feel}
                      onChange={e => setNewEntry({...newEntry, feel: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-500">What are you going to do about it?</label>
                    <textarea 
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm min-h-[80px]"
                      placeholder="I will apply this by..."
                      value={newEntry.action}
                      onChange={e => setNewEntry({...newEntry, action: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={saveEntry}>Save Entry</Button>
                    <Button variant="outline" onClick={() => setShowEntryForm(false)}>Cancel</Button>
                  </div>
                </Card>
              )}

              <div className="space-y-4">
                {entries.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No entries yet. Start your 180-day challenge today!</p>
                  </div>
                ) : (
                  entries.map((entry, i) => (
                    <Card key={i} className="space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                        <span className="text-xs font-bold text-blue-600">{entry.date}</span>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Learnt</p>
                        <p className="text-sm">{entry.learnt}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Feelings</p>
                        <p className="text-sm italic text-gray-600">"{entry.feel}"</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Action Plan</p>
                        <p className="text-sm font-medium text-blue-800">{entry.action}</p>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'cert' && (
            <motion.div
              key="cert"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Certification</h2>
              <Card className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-10 h-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Certificate of Proficiency</h3>
                  <p className="text-sm text-gray-500">Gladstar Gifted and Talented School</p>
                </div>
                <div className="px-4">
                  <p className="text-sm text-gray-600">
                    To qualify for this certificate, you must complete the 180-day learning challenge by logging your daily insights and actions.
                  </p>
                </div>
                <div className="pt-4">
                  <div className="text-3xl font-bold text-blue-600">{entries.length} / 180</div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Days Completed</p>
                </div>
                {entries.length >= 180 ? (
                  <Button className="w-full">Claim Certificate</Button>
                ) : (
                  <div className="text-sm text-blue-600 font-medium">
                    {180 - entries.length} days remaining
                  </div>
                )}
              </Card>

              <section className="space-y-3">
                <h3 className="font-bold text-sm">How to Earn Your Certificate</h3>
                <ul className="space-y-3">
                  {[
                    "Study one learning resource daily.",
                    "Answer the 3 reflection questions in your log.",
                    "Share your answers on social media with #ggtsentrepreneurship.",
                    "Complete this process for 180 consecutive days."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600">
                      <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 flex justify-around items-center z-20 shadow-lg">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home />} label="Home" />
        <NavButton active={activeTab === 'modules'} onClick={() => setActiveTab('modules')} icon={<BookOpen />} label="Learn" />
        <NavButton active={activeTab === 'log'} onClick={() => setActiveTab('log')} icon={<Calendar />} label="Log" />
        <NavButton active={activeTab === 'cert'} onClick={() => setActiveTab('cert')} icon={<Award />} label="Cert" />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}
    >
      <div className={`transition-transform ${active ? 'scale-110' : 'scale-100'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}
