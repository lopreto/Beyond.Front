import { Progression } from "./progression.dto";

export interface TodoItem {
  id: number;
  title?: string;
  description?: string;
  category?: string;
  progressions?: Progression[];
  isCompleted?: boolean;
}