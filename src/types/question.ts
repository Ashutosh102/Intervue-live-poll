export interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  timeLimit: number;
  answers: Answer[];
}

