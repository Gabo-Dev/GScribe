import type { LoginUseCase } from '../../application/auth/LoginUseCase';
import type { SignUpUseCase } from '../../application/auth/SignUpUseCase';
import type { LogOutUseCase } from '../../application/auth/LogOutUseCase';

interface AppProps {
  loginUseCase: LoginUseCase;
  signUpUseCase: SignUpUseCase;
  logOutUseCase: LogOutUseCase;
}
function App({ loginUseCase, signUpUseCase, logOutUseCase }: AppProps) {
  console.log("Login Use Case Injected:", loginUseCase);
  console.log("Sign Up Use Case Injected:", signUpUseCase);
  console.log("Log Out Use Case Injected:", logOutUseCase);
  return (
    <>
      <div className="bg-gray-900 text-white min-h-screen p-8">
      <h1 className="text-3xl font-bold text-cyan-400">
        GScribe
      </h1>
    </div>
    </>
  );
}

export default App;
