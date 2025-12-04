import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import type { SignUpUseCase } from "../../../application/auth/SignUpUseCase.ts";
import { Link, useNavigate } from "react-router-dom";
import HCaptcha from "@hcaptcha/react-hcaptcha";

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
    // Podrías renderizar un error aquí
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

  

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = globalThis.innerWidth);
    let height = (canvas.height = globalThis.innerHeight);

    const resize = () => {
      width = canvas.width = globalThis.innerWidth;
      height = canvas.height = globalThis.innerHeight;
    };
    globalThis.addEventListener("resize", resize);

    const nodes = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.2 + 0.8,
      brightness: Math.random() * 0.6 + 0.4,
      pulseSpeed: Math.random() * 0.015 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    function draw() {
      if (!ctx) return;
      ctx.fillStyle = "#010310";
      ctx.fillRect(0, 0, width, height);
      const time = Date.now() * 0.001;

      for (const node of nodes) {
        const pulse = (Math.sin(time * node.pulseSpeed + node.phase) + 1) / 2;
        const currentBrightness = node.brightness * (0.8 + pulse * 0.4);

        const halo = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.size * 6
        );
        halo.addColorStop(0, `rgba(160, 220, 255, ${currentBrightness * 0.3})`);
        halo.addColorStop(
          0.6,
          `rgba(120, 200, 255, ${currentBrightness * 0.1})`
        );
        halo.addColorStop(1, "rgba(120, 200, 255, 0)");

        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 230, 255, ${currentBrightness})`;
        ctx.fill();
      }

      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.max(30, Math.min(width - 30, node.x));
        node.y = Math.max(30, Math.min(height - 30, node.y));
      }
      requestAnimationFrame(draw);
    }
    draw();
    return () => globalThis.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#010310] overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

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
