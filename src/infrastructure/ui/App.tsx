import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.ts';
import { LoginPage } from './pages/LoginPage.tsx';
import { SignUpPage } from './pages/SignUpPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';

import type { LoginUseCase } from '../../application/auth/LoginUseCase.ts';
import type { SignUpUseCase } from '../../application/auth/SignUpUseCase.ts';
import type { LogOutUseCase } from '../../application/auth/LogOutUseCase.ts';
import type { SignInAnonymouslyUseCase } from '../../application/auth/SignInAnonymouslyUseCase.ts';

interface AppProps {
  loginUseCase: LoginUseCase;
  signUpUseCase: SignUpUseCase;
  logOutUseCase: LogOutUseCase;
  signInAnonymouslyUseCase: SignInAnonymouslyUseCase;
}

function App({ 
  loginUseCase, 
  signUpUseCase, 
  logOutUseCase, 
  signInAnonymouslyUseCase 
}: AppProps) {
  
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/" /> : 
            <LoginPage 
              loginUseCase={loginUseCase} 
              signInAnonymouslyUseCase={signInAnonymouslyUseCase} 
            />
          } 
        />
        
        <Route 
          path="/signup" 
          element={
            user ? <Navigate to="/" /> : 
            <SignUpPage signUpUseCase={signUpUseCase} />
          } 
        />
        
        <Route 
          path="/" 
          element={
            user ? 
            <DashboardPage logOutUseCase={logOutUseCase} /> : 
            <Navigate to="/login" />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;