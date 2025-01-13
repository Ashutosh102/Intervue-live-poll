export type UserRole = 'student' | 'teacher' | null;

export interface UserState {
  role: UserRole;
  name?: string;
  id?: string;
}

