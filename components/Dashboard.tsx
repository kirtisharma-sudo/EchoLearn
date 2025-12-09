import React from 'react';
import { StudyFeature, StudyMode } from '../types';
import { BookOpen, BrainCircuit, FileText, Calculator, Flame, Clock, Mic2 } from 'lucide-react';

interface DashboardProps {
  onSelectFeature: (feature: StudyFeature) => void;
  currentMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectFeature, currentMode, onSelectMode }) => {
  const features = [
    {
      id: StudyFeature.EXPLAIN,
      title: 'Concept Explanations',
      desc: 'Smart summaries & examples.',
      icon: <BookOpen className="w-8 h-8 text-blue-400" />,
      color: 'hover:border-blue-500/50 hover:bg-blue-500/10'
    },
    {
      id: StudyFeature.NOTES,
      title: 'Notes Mode',
      desc: 'Bullet points & formula sheets.',
      icon: <FileText className="w-8 h-8 text-emerald-400" />,
      color: 'hover:border-emerald-500/50 hover:bg-emerald-500/10'
    },
    {
      id: StudyFeature.QUIZ,
      title: 'Quiz Generator',
      desc: 'MCQs to test mastery.',
      icon: <BrainCircuit className="w-8 h-8 text-purple-400" />,
      color: 'hover:border-purple-500/50 hover:bg-purple-500/10'
    },
    {
      id: StudyFeature.ECHOSPEAK,
      title: 'EchoSpeak Evaluator',
      desc: 'Oral answer feedback & scoring.',
      icon: <Mic2 className="w-8 h-8 text-pink-400" />,
      color: 'hover:border-pink-500/50 hover:bg-pink-500/10'
    },
    {
      id: StudyFeature.SOLVER,
      title: 'Numerical Solver',
      desc: 'Step-by-step math help.',
      icon: <Calculator className="w-8 h-8 text-orange-400" />,
      color: 'hover:border-orange-500/50 hover:bg-orange-500/10'
    }
  ];

  const modes = [
    { id: StudyMode.TUTOR, label: '👨‍🏫 Tutor', desc: 'Detailed' },
    { id: StudyMode.FRIEND, label: '🤜🤛 Friend', desc: 'Casual' },
    { id: StudyMode.EXAM, label: '📝 Exam', desc: 'Strict' },
    { id: StudyMode.FUN, label: '🎉 Fun', desc: 'Jokes' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in pb-12">
      
      {/* Welcome & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
           <h2 className="text-3xl font-bold text-white mb-2 font-montserrat">Welcome back, Scholar!</h2>
           <p className="text-slate-400">Your AI study companion is ready.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Streak</p>
              <p className="text-white font-bold">12 Days</p>
            </div>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <div>
               <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Recent</p>
               <p className="text-white font-bold">Thermodynamics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="bg-slate-800/50 p-2 rounded-2xl flex overflow-x-auto border border-slate-700 gap-2">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onSelectMode(m.id)}
            className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
              currentMode === m.id 
              ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]' 
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <span className="text-base font-bold">{m.label}</span>
            <span className="text-[10px] opacity-80 font-normal uppercase tracking-wider">{m.desc}</span>
          </button>
        ))}
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => onSelectFeature(f.id)}
            className={`p-6 bg-slate-800 border border-slate-700 rounded-3xl text-left transition-all duration-300 group hover:shadow-2xl hover:-translate-y-1 ${f.color}`}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-3 bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                {f.icon}
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors font-montserrat">{f.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
          </button>
        ))}
      </div>

    </div>
  );
};

export default Dashboard;