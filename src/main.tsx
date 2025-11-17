import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './infrastructure/ui/App.tsx'
import { supabaseClient } from './infrastructure/lib/supabaseClient.ts'
import { LoginUseCase } from './application/auth/LoginUseCase.ts';
import { SignUpUseCase } from './application/auth/SignUpUseCase.ts';
import { LogOutUseCase } from './application/auth/LogOutUseCase.ts';
import {SignInAnonymouslyUseCase} from './application/auth/SignInAnonymouslyUseCase.ts'
import { AuthProvider } from './infrastructure/ui/context/AuthProvider.tsx';
import { SupabaseAuthAdapter } from './infrastructure/adapters/SupabaseAuthAdapter.ts'

const authAdapter = new SupabaseAuthAdapter(supabaseClient);
const loginUseCase = new LoginUseCase(authAdapter);
const signUpUseCase = new SignUpUseCase(authAdapter);
const logOutUseCase = new LogOutUseCase(authAdapter);
const signInAnonymouslyUseCase = new SignInAnonymouslyUseCase(authAdapter);

/**
 * Composition Root (Dependency Injection)
 * As per Clean Architecture, this is the app's maoin entrypoint
 * responsible for instantiating and "wiring" all the dependencies.
 * 
 * 1. Infrastructure Adapters are instantiated (e.g., SupabaseClient).
 * 2. Adapters are injected into Application Use Cases.
 * 3. Application Use Cases are injected into React Components.
 * 
 * This decouples the core logic from concrete implementations.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App
      loginUseCase={loginUseCase}
      signUpUseCase={signUpUseCase}
      logOutUseCase={logOutUseCase}
      signInAnonymouslyUseCase={signInAnonymouslyUseCase}
    />
    </AuthProvider>
  </StrictMode>,
)
