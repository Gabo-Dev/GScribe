import { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import type { SignUpUseCase } from "../../../application/auth/SignUpUseCase.ts";
import { Link, useNavigate } from "react-router-dom";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { StarfieldBackground } from "../components/StarfieldBackground.tsx";

interface SignUpPageProps {
  signUpUseCase: SignUpUseCase;
}

const validatePassword = (password: string): string | null => {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"|,.<>?~`]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSymbol) {
    return "Password must include uppercase, lowercase, numbers, and symbols";
  }
  return null;
};

export function SignUpPage({ signUpUseCase }: SignUpPageProps) {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alias, setAlias] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const captchaRef = useRef<HCaptcha>(null);
  const hCaptchaSiteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

  if (!hCaptchaSiteKey) {
    console.error("hCaptcha Site Key is not defined. Check your .env file.");
  }

  const handleSignUp = async (captchaToken: string) => {
    try {
      const user = await signUpUseCase.execute(
        email,
        alias,
        password,
        captchaToken
      );
      setUser(user);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err instanceof Error){
        setError(err.message);
      }
      else {
        setError("An unexpected error occurred. Please check your connection.");
      }
      captchaRef.current?.resetCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (!captchaRef.current) {
      setError("System Error: Captcha validation unavailable.");
      return;
    }

    setIsLoading(true);
    captchaRef.current.execute();
  };

  return (
    <div className="relative min-h-screen bg-[#010310] overflow-hidden flex items-center justify-center">
      <StarfieldBackground />

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="backdrop-blur-lg bg-white/3 rounded-xl border border-white/10 p-8 transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-white tracking-wide mb-2">
              Create Account
            </h1>
            <p className="text-xs text-gray-400 font-light mb-3">
              Join GScribe Platform
            </p>
            <div className="h-px w-12 mx-auto bg-linear-to-r from-transparent via-gray-500 to-transparent"></div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Alias
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400/60 focus:bg-white/8 transition-all duration-200"
                placeholder="Your public name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400/60 focus:bg-white/8 transition-all duration-200"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-gray-600/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-sky-400/60 focus:bg-white/8 transition-all duration-200"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-300 text-center">{error}</p>
              </div>
            )}

            {hCaptchaSiteKey ? (
              <HCaptcha
                ref={captchaRef}
                sitekey={hCaptchaSiteKey || ""}
                onVerify={(token) => {
                  console.log(
                    "hCaptcha token received: ",
                    token ? "YES" : "NO"
                  );
                  handleSignUp(token);
                }}
                onError={() => {
                  console.error("hCaptcha error.");
                  setError("Security verification failed. Please try again.");
                }}
                onExpire={() =>
                  setError("Security check expired. Please try again.")
                }
                size="invisible"
              />
            ) : (
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-200 text-center">
                  ⚠️ Missing Captcha Key
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-sky-500/95 text-white rounded-lg font-medium hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-sky-400 hover:text-sky-300 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}