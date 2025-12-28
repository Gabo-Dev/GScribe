import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.ts";
import { LoginPage } from "./pages/LoginPage.tsx";
import { SignUpPage } from "./pages/SignUpPage.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";

import { ToastProvider } from "./context/ToastProvider.tsx";

import type { LoginUseCase } from "../../application/auth/LoginUseCase.ts";
import type { SignUpUseCase } from "../../application/auth/SignUpUseCase.ts";
import type { LogOutUseCase } from "../../application/auth/LogOutUseCase.ts";

interface AppProps {
  loginUseCase: LoginUseCase;
  signUpUseCase: SignUpUseCase;
  logOutUseCase: LogOutUseCase;
}

function App({ loginUseCase, signUpUseCase, logOutUseCase }: AppProps) {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <LoginPage loginUseCase={loginUseCase} />
              )
            }
          />

          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to="/" />
              ) : (
                <SignUpPage signUpUseCase={signUpUseCase} />
              )
            }
          />

          <Route
            path="/"
            element={
              user ? (
                <DashboardPage logOutUseCase={logOutUseCase} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
