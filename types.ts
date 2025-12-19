
export enum AppView {
  HOME = 'HOME',
  LIBRARY = 'LIBRARY',
  EDUCATION = 'EDUCATION',
  STUDY_SPACE = 'STUDY_SPACE',
  EXECUTION_CHAT = 'EXECUTION_CHAT',
  SCANNER = 'SCANNER',
}

export enum UserRole {
  STUDENT = 'Học sinh',
  TEACHER = 'Giáo viên',
}

export type AIMode = 'FAST' | 'THINKING';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  sources?: { title: string; uri: string }[];
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  role: UserRole;
  category: string;
  authorId?: string;
  isPublic: boolean;
  createdAt: number;
  likes?: number;
  likedBy?: string[];
}

export interface ExecutionState {
  title: string;
  description?: string;
  content: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface RelatedTopic {
  title: string;
  description: string;
  relevance: string;
}

export interface AIModelInfo {
  name: string;
  provider: string;
  description: string;
  strengths: string[];
  icon: string;
}
