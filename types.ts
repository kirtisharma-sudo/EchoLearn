export enum AppState {
  DASHBOARD = 'DASHBOARD',
  INPUT = 'INPUT',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  QUIZ = 'QUIZ'
}

export enum StudyMode {
  TUTOR = 'Tutor',
  FRIEND = 'Friend',
  EXAM = 'Exam',
  FUN = 'Fun'
}

export enum StudyFeature {
  EXPLAIN = 'EXPLAIN',
  NOTES = 'NOTES',
  QUIZ = 'QUIZ',
  SOLVER = 'SOLVER',
  ECHOSPEAK = 'ECHOSPEAK'
}

// For Quiz Feature
export interface QuizItem {
  question: string;
  options: string[];
  answer: string; // Correct answer
  hint: string;   // Hint before showing full answer
  explanation: string; // Full explanation
}

// For EchoSpeak Feature
export interface EchoSpeakData {
  accuracyScore: number;
  transcription: string;
  mistakes: string[];
  feedback: string;
}

// Unified Response from Gemini
export interface StudyResponse {
  type: StudyFeature;
  markdownContent?: string; // For Explain, Notes, Solver
  quizData?: QuizItem[];    // For Quiz
  echoSpeakData?: EchoSpeakData; // For EchoSpeak
  title: string;            // Title of the generated content
}

export interface AudioVisualizerProps {
  stream: MediaStream | null;
  isRecording: boolean;
}