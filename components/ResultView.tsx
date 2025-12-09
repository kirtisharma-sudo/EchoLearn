import React from 'react';
import { StudyResponse, StudyFeature } from '../types';
import { ArrowLeft, Share2, Copy, FileText, Calculator, BookOpen, Mic2, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import QuizModule from './QuizModule';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ResultViewProps {
  data: StudyResponse;
  onBack: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ data, onBack }) => {
  
  if (data.type === StudyFeature.QUIZ && data.quizData) {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <button onClick={onBack} className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
           <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <QuizModule quizData={data.quizData} onComplete={onBack} title={data.title} />
      </div>
    );
  }

  const getIcon = () => {
    switch (data.type) {
      case StudyFeature.NOTES: return <FileText className="w-6 h-6 text-emerald-400" />;
      case StudyFeature.SOLVER: return <Calculator className="w-6 h-6 text-orange-400" />;
      case StudyFeature.ECHOSPEAK: return <Mic2 className="w-6 h-6 text-pink-400" />;
      default: return <BookOpen className="w-6 h-6 text-blue-400" />;
    }
  };

  // Render EchoSpeak specific view
  if (data.type === StudyFeature.ECHOSPEAK && data.echoSpeakData) {
    const { accuracyScore, transcription, mistakes, feedback } = data.echoSpeakData;
    const scoreData = [{ name: 'Score', value: accuracyScore, fill: '#ec4899' }]; // Pink for EchoSpeak

    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-in">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-lg w-fit">
           <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Score Card */}
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex flex-col items-center justify-center relative shadow-xl">
             <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Accuracy Score</h3>
             <div className="h-40 w-40 relative">
               <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" cy="50%" innerRadius="80%" outerRadius="100%" 
                  barSize={10} data={scoreData} startAngle={90} endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background dataKey="value" cornerRadius={30 / 2} fill="#ec4899" />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{accuracyScore}%</span>
              </div>
            </div>
          </div>

          {/* Feedback & Transcription */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
              <h3 className="flex items-center gap-2 text-white font-bold mb-4 font-montserrat">
                <Mic2 className="w-5 h-5 text-pink-400" /> Transcription
              </h3>
              <p className="text-slate-300 italic text-sm border-l-4 border-pink-500 pl-4 py-1 bg-slate-900/30 rounded-r-lg">
                "{transcription}"
              </p>
            </div>

            {mistakes.length > 0 && (
              <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
                 <h3 className="flex items-center gap-2 text-white font-bold mb-4 font-montserrat">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" /> Areas for Improvement
                 </h3>
                 <ul className="space-y-2">
                   {mistakes.map((m, i) => (
                     <li key={i} className="flex gap-2 text-slate-300 text-sm">
                       <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-yellow-500 shrink-0" />
                       {m}
                     </li>
                   ))}
                 </ul>
              </div>
            )}
          </div>
        </div>

        {/* Deep Feedback */}
        <div className="mt-6 bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-xl">
           <h3 className="flex items-center gap-2 text-white font-bold mb-6 font-montserrat">
              <Lightbulb className="w-5 h-5 text-indigo-400" /> Coach's Feedback
           </h3>
           <div className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300">
             {feedback.split('\n').map((line, i) => <p key={i}>{line}</p>)}
           </div>
        </div>
      </div>
    );
  }

  // Standard Markdown View (Explain, Notes, Solver)
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-lg">
           <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex gap-2">
           <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white border border-slate-700 hover:border-indigo-500 transition-all">
             <Copy className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-700 bg-slate-900/50 flex items-center gap-4">
           <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 shadow-inner">
             {getIcon()}
           </div>
           <h1 className="text-2xl font-bold text-white font-montserrat">{data.title}</h1>
        </div>
        
        <div className="p-8 bg-slate-800">
          <div className="prose prose-invert prose-lg max-w-none 
            font-poppins
            prose-headings:text-indigo-300 prose-headings:font-bold prose-headings:font-montserrat
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-li:text-slate-300 prose-li:marker:text-indigo-500
            prose-strong:text-white prose-strong:font-bold
            prose-code:bg-slate-900 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:text-pink-300 prose-code:font-mono prose-code:border prose-code:border-slate-700 prose-code:shadow-sm
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-pre:rounded-2xl
            prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-slate-900/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          ">
            {/* Simple Markdown Rendering */}
            {data.markdownContent?.split('\n').map((line, i) => {
              if (line.startsWith('###')) return <h3 key={i} className="mt-8 mb-4 text-xl flex items-center gap-2">{line.replace('###', '')}</h3>;
              if (line.startsWith('##')) return <h2 key={i} className="mt-10 mb-5 text-2xl border-b border-slate-700 pb-3">{line.replace('##', '')}</h2>;
              if (line.startsWith('🔹')) return <h3 key={i} className="mt-8 mb-3 text-lg font-bold text-indigo-300 flex items-center gap-2">{line}</h3>;
              if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc mb-1">{line.replace('- ', '')}</li>;
              if (line.startsWith('1. ')) return <li key={i} className="ml-4 list-decimal mb-1">{line.replace(/^\d+\.\s/, '')}</li>;
              if (line.trim() === '') return <div key={i} className="h-2"></div>;
              return <p key={i} className="mb-3">{line}</p>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;