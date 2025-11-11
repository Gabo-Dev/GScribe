import { createContext } from 'react';
import type { User } from '../../../core/domain/User';

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Create and export the Context (the "signal")
export const AuthContext = createContext<AuthContextType | undefined>(undefined);