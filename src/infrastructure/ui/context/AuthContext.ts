import { createContext } from 'react';
import type { User } from '../../../core/domain/User.ts';

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

// Create and export the Context (the "signal")
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

