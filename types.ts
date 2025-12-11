
export enum View {
  DASHBOARD = 'DASHBOARD',
  NEUROMAP = 'NEUROMAP',
  MINDMELD = 'MINDMELD',
  VISIONLAB = 'VISIONLAB',
  QUANTUM_QUIZ = 'QUANTUM_QUIZ',
  NEXUS_CHAT = 'NEXUS_CHAT',
  COSMOS_LEARN = 'COSMOS_LEARN',
  IDEA_VAULT = 'IDEA_VAULT',
  MATH_PATH = 'MATH_PATH',
  SKILL_FORGE = 'SKILL_FORGE',
  CODE_NEXUS = 'CODE_NEXUS'
}

export type LanguageCode = 'en' | 'bn' | 'es' | 'fr' | 'hi';

export type AIProvider = 'GOOGLE' | 'OPENAI' | 'ANTHROPIC' | 'DEEPSEEK';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinedAt: number;
  isGuest?: boolean;
}

export interface AIModel {
    id: string;
    name: string;
    provider: AIProvider;
    description: string;
    icon?: string;
    isPro?: boolean;
}

export interface Node {
  id: string;
  group: number;
  val: number; // radius
  desc?: string; // Short description
  // D3 internal props
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface Link {
  source: string | Node;
  target: string | Node;
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export interface ChatSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  image?: string;
  sources?: ChatSource[];
  isThinking?: boolean;
  modelUsed?: string;
}

export interface SavedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  explanation: string;
  timestamp: number;
  style?: string;
  modelUsed?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  timestamp: number;
}

export interface UserStats {
  sessionsCompleted: number;
  nodesExplored: number;
  minutesDebated: number;
  weeklyActivity: { day: string; value: number }[];
  quizScore: number;
  level?: number;
  title?: string;
}

export interface AppProps {
    stats: UserStats;
    updateStats: (newStats: Partial<UserStats>) => void;
    language: LanguageCode;
    user?: UserProfile;
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  description: string;
  systemInstruction: string;
  voiceName: string;
  color: string;
}

export interface LearningModule {
  id: string;
  title: string;
  channelName: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
}

export interface MathTopic {
    id: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface MathConcept {
    explanation: string;
    exampleProblem: string;
    solution: string;
}

export interface CodeTopic {
    id: string;
    title: string;
    description: string;
    language: string;
}

export interface CodeConcept {
    explanation: string;
    codeSnippet: string;
    keyTakeaway: string;
}

export interface SkillChallenge {
    id: string;
    title: string;
    scenario: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
}

export interface SkillEvaluation {
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
    betterExample: string;
}