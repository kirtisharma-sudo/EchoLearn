import React, { useState } from 'react';
import { Sparkles, Brain } from 'lucide-react';
import Dashboard from './components/Dashboard';
import UniversalInput from './components/UniversalInput';
import ResultView from './components/ResultView';
import { generateStudyHelp } from './services/geminiService';
import { AppState, StudyFeature, StudyMode, StudyResponse } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.DASHBOARD);
  const [mode, setMode] = useState<StudyMode>(StudyMode.TUTOR);
  const [feature, setFeature] = useState<StudyFeature | null>(null);
  const [resultData, setResultData] = useState<StudyResponse | null>(null);
  
  const handleFeatureSelect = (selectedFeature: StudyFeature) => {
    setFeature(selectedFeature);
    setAppState(AppState.INPUT);
  };

  const handleSubmit = async (text: string, blob?: Blob) => {
    if (!feature) return;

    setAppState(AppState.PROCESSING);
    try {
      const response = await generateStudyHelp(feature, mode, text, blob);
      setResultData(response);
      setAppState(AppState.RESULT);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
      setAppState(AppState.INPUT);
    }
  };

  const getFeatureTitle = () => {
    switch (feature) {
      case StudyFeature.EXPLAIN: return "What concept should I explain?";
      case StudyFeature.NOTES: return "What topic do you need notes for?";
      case StudyFeature.QUIZ: return "What topic should the quiz cover?";
      case StudyFeature.SOLVER: return "Enter the numerical problem:";
      case StudyFeature.ECHOSPEAK: return "Explain a topic to me (Text or Voice):";
      default: return "";
    }
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.DASHBOARD:
        return (
          <Dashboard 
            onSelectFeature={handleFeatureSelect} 
            currentMode={mode}
            onSelectMode={setMode}
          />
        );
      case AppState.INPUT:
      case AppState.PROCESSING:
        return (
          <UniversalInput 
            featureTitle={getFeatureTitle()}
            isProcessing={appState === AppState.PROCESSING}
            onSubmit={handleSubmit}
            onCancel={() => {
              setAppState(AppState.DASHBOARD);
              setFeature(null);
            }}
          />
        );
      case AppState.RESULT:
        return resultData ? (
          <ResultView 
            data={resultData}
            onBack={() => {
              setAppState(AppState.DASHBOARD);
              setFeature(null);
              setResultData(null);
            }}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white font-poppins">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => {
                setAppState(AppState.DASHBOARD);
                setFeature(null);
                setResultData(null);
              }}
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-montserrat">
                  EchoLearn
                </h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Smart Explanations • Oral Learning</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Mode: {mode}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-4 md:p-8">
           {renderContent()}
        </main>

        {/* Footer */}
        <footer className="w-full border-t border-slate-800 py-6 text-center text-slate-600 text-sm font-light">
          <p>© {new Date().getFullYear()} EchoLearn. Explain • Notes • Quiz • EchoSpeak</p>
        </footer>
      </div>
    </div>
  );
};

export default App;