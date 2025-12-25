import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import type { LoginUseCase } from '../../../application/auth/LoginUseCase.ts';
import { Link } from 'react-router-dom';

interface LoginPageProps {
  loginUseCase: LoginUseCase;
}

export function LoginPage({ loginUseCase }: LoginPageProps) {
  
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await loginUseCase.execute(email, password);
      setUser(user);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Canvas animation logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = globalThis.innerWidth);
    let height = (canvas.height = globalThis.innerHeight);

    const resize = () => {
      width = canvas.width = globalThis.innerWidth;
      height = canvas.height = globalThis.innerHeight;
    };
    globalThis.addEventListener('resize', resize);

    const nodes = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 1.2 + 0.8,
      brightness: Math.random() * 0.6 + 0.4,
      pulseSpeed: Math.random() * 0.015 + 0.01,
      phase: Math.random() * Math.PI * 2,
      connections: [] as number[],
      connectionTimer: Math.random() * 120 + 60,
    }));

    function draw() {
      if (!ctx) return;
      
      ctx.fillStyle = '#010310';
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() * 0.001;

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        
        nodeA.connectionTimer--;
        if (nodeA.connectionTimer <= 0) {
          nodeA.connectionTimer = Math.random() * 90 + 30;
          nodeA.connections = [];
          
          const numConnections = Math.floor(Math.random() * 2) + 1;
          for (let c = 0; c < numConnections; c++) {
            const randomNodeIndex = Math.floor(Math.random() * nodes.length);
            if (randomNodeIndex !== i) {
              nodeA.connections.push(randomNodeIndex);
            }
          }
        }

        for (const j of nodeA.connections) {
          const nodeB = nodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 200) {
            const pulse = (Math.sin(time * 4 + i) + 1) / 2;
            const alpha = (1 - dist / 200) * (0.15 + pulse * 0.2);
            
            const gradient = ctx.createLinearGradient(
              nodeA.x, nodeA.y, nodeB.x, nodeB.y
            );
            gradient.addColorStop(0, `rgba(160, 220, 255, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(120, 200, 255, ${alpha * 1.2})`);
            gradient.addColorStop(1, `rgba(160, 220, 255, ${alpha})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.6 + pulse * 0.4;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();

            if (pulse > 0.7 && Math.random() < 0.3) {
              const travelPos = (time * 3) % 1;
              const sparkX = nodeA.x + dx * travelPos;
              const sparkY = nodeA.y + dy * travelPos;
              
              ctx.beginPath();
              ctx.arc(sparkX, sparkY, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
              ctx.fill();
            }
          }
        }
      }

      for (const node of nodes) {
        const pulse = (Math.sin(time * node.pulseSpeed + node.phase) + 1) / 2;
        const currentBrightness = node.brightness * (0.8 + pulse * 0.4);

        const halo = ctx.createRadialGradient(
          node.x, node.y, 0, node.x, node.y, node.size * 6
        );
        halo.addColorStop(0, `rgba(160, 220, 255, ${currentBrightness * 0.3})`);
        halo.addColorStop(0.6, `rgba(120, 200, 255, ${currentBrightness * 0.1})`);
        halo.addColorStop(1, 'rgba(120, 200, 255, 0)');
        
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 230, 255, ${currentBrightness})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentBrightness * 1.2})`;
        ctx.fill();

        if (Math.random() < 0.008) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 220, 255, ${currentBrightness * 0.8})`;
          ctx.fill();
        }
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
    return () => globalThis.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#010310] overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="backdrop-blur-lg bg-white/3 rounded-xl border border-white/10 p-8 transition-all duration-300">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-linear-to-br from-sky-500/90 to-blue-600/90">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-light text-white tracking-wide mb-2">
              GScribe
            </h1>
            <p className="text-xs text-gray-400 font-light mb-3">
              Intelligent Platform
            </p>
            <div className="h-px w-12 mx-auto bg-linear-to-r from-transparent via-gray-500 to-transparent"></div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
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
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-300 text-center">
                  {error}
                </p>
              </div>
            )}

            <button
              disabled={isLoading}
              type="submit"
              className="w-full py-3.5 bg-sky-500/95 text-white rounded-lg font-medium hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sky-400 hover:text-sky-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}