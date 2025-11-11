import { useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../../../core/domain/User";
import { AuthContext } from "./AuthContext";

// Create the Provider (the "emitter")
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const value = { user, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}