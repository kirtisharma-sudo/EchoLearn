import { GoogleGenAI, Type, Schema } from "@google/genai";
import { StudyResponse, StudyFeature, StudyMode } from '../types';
import { blobToBase64 } from '../utils/audioUtils';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for Quiz Mode
const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    type: { type: Type.STRING, enum: [StudyFeature.QUIZ] },
    quizData: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          answer: { type: Type.STRING },
          hint: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["question", "options", "answer", "hint", "explanation"]
      }
    }
  },
  required: ["title", "type", "quizData"]
};

// Schema for EchoSpeak
const echoSpeakSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    type: { type: Type.STRING, enum: [StudyFeature.ECHOSPEAK] },
    echoSpeakData: {
      type: Type.OBJECT,
      properties: {
        accuracyScore: { type: Type.NUMBER, description: "0-100 score of accuracy" },
        transcription: { type: Type.STRING, description: "What the user said/typed" },
        mistakes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of factual errors or missing key points" },
        feedback: { type: Type.STRING, description: "Markdown formatted feedback including corrections and tips" }
      },
      required: ["accuracyScore", "transcription", "mistakes", "feedback"]
    }
  },
  required: ["title", "type", "echoSpeakData"]
};

// Schema for Text Content (Explain, Notes, Solver)
const contentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    type: { type: Type.STRING, enum: [StudyFeature.EXPLAIN, StudyFeature.NOTES, StudyFeature.SOLVER] },
    markdownContent: { type: Type.STRING, description: "The formatted content using Markdown (headers, bullets, bold, math symbols)." }
  },
  required: ["title", "type", "markdownContent"]
};

export const generateStudyHelp = async (
  feature: StudyFeature,
  mode: StudyMode,
  inputText: string,
  audioBlob?: Blob
): Promise<StudyResponse> => {
  
  let base64Audio = null;
  if (audioBlob) {
    base64Audio = await blobToBase64(audioBlob);
  }

  const systemInstruction = `
    You are EchoLearn, a premium AI study companion. 
    Current Mode: ${mode.toUpperCase()}.
    
    📌 MODES:
    - TUTOR: Detailed + Clear.
    - FRIEND: Casual + Friendly.
    - EXAM: Strict + Crisp (High yield facts).
    - FUN: Analogies + Jokes (Pirates, Sci-fi, etc).

    📌 GLOBAL FORMATTING RULES (For Markdown Outputs):
    1. **NO LaTeX**: Write formulas in plain text inside code blocks. 
       Example: \`y = (m * x) + c\` NOT \`\\frac{dy}{dx}\`.
    2. **Structure**: Use Headings, Icons, and clear spacing.
    3. **Tone**: Supportive, motivating, never rude.

    📌 SPECIFIC STRUCTURE FOR 'EXPLAIN' & 'SOLVER':
    When explaining a topic or solving a problem, STRICTLY use this structure:
    🔹 **Summary** (One sentence overview)
    🔹 **Key Points** (Bulleted list)
    🔹 **Detailed Explanation** (Step-by-step)
    🔹 **Example** (Real-life application)
    🔹 **Quick Revision Lines** (Punchy memory hooks)

    For 'NOTES':
    - Only bullet points.
    - Highlight formulas.
    - Summary sheet at the end.

    For 'ECHOSPEAK' (Oral Answer Evaluator):
    - Analyze the user's explanation.
    - Provide an accuracy score (0-100).
    - List specific mistakes or missing concepts.
    - Give constructive feedback.
  `;

  let prompt = "";
  let schema = contentSchema;

  switch (feature) {
    case StudyFeature.EXPLAIN:
      prompt = `Explain this concept strictly following the summary/key-points/detailed structure: "${inputText}".`;
      break;
    case StudyFeature.NOTES:
      prompt = `Create study notes for: "${inputText}". Use a clean bulleted format.`;
      break;
    case StudyFeature.SOLVER:
      prompt = `Solve this numerical problem using the structured format (Summary, Formula, Steps, Answer): "${inputText}".`;
      break;
    case StudyFeature.QUIZ:
      prompt = `Generate a quiz about: "${inputText}". Create 5 MCQs with increasing difficulty.`;
      schema = quizSchema;
      break;
    case StudyFeature.ECHOSPEAK:
      prompt = `The user is explaining a topic. Evaluate their explanation for accuracy and clarity. Input: "${inputText}" (or audio).`;
      schema = echoSpeakSchema;
      break;
  }

  try {
    const parts: any[] = [{ text: prompt }];
    
    if (base64Audio) {
      parts.unshift({
        inlineData: {
          mimeType: audioBlob?.type || "audio/webm",
          data: base64Audio,
        },
      });
      parts.push({ text: "The user input is audio. Transcribe it and then perform the requested task." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: mode === StudyMode.FUN ? 0.8 : 0.3,
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as StudyResponse;
    } else {
      throw new Error("No response received.");
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};