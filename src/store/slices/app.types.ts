export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface AppState {
  user: User | null;
}
