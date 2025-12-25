import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './infrastructure/ui/App.tsx'
import { supabaseClient } from './infrastructure/lib/supabaseClient.ts'
import { SupabaseCaptchaAdapter } from './infrastructure/adapters/SupabaseCaptchaAdapter.ts'
import { LoginUseCase } from './application/auth/LoginUseCase.ts';
import { SignUpUseCase } from './application/auth/SignUpUseCase.ts';
import { LogOutUseCase } from './application/auth/LogOutUseCase.ts';
import { AuthProvider } from './infrastructure/ui/context/AuthProvider.tsx';
import { SupabaseAuthAdapter } from './infrastructure/adapters/SupabaseAuthAdapter.ts'

const captchaUrl = import.meta.env.VITE_CAPTCHA_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
if (!captchaUrl) {
  throw new Error('Missing CAPTCHA_URL environment variable');
}
if (!supabaseKey) {
  throw new Error('Missing SUPABASE_KEY environment variable');
}
const captchaService = new SupabaseCaptchaAdapter(captchaUrl, supabaseKey);
const authAdapter = new SupabaseAuthAdapter(supabaseClient, captchaService);
const loginUseCase = new LoginUseCase(authAdapter);
const signUpUseCase = new SignUpUseCase(authAdapter);
const logOutUseCase = new LogOutUseCase(authAdapter);

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
    />
    </AuthProvider>
  </StrictMode>,
)
