import { useState, useEffect, useCallback } from "react";
import { RefreshCw, LogIn, BookOpen } from "lucide-react";

const API_BASE = "/api";

type CaptchaPayload = { cookie: string; csrf: string; image: string };

type Props = {
  onSuccess: (data: unknown) => void;
};

export default function LoginForm({ onSuccess }: Props) {
  const [captcha, setCaptcha] = useState<CaptchaPayload | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState("");

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    setCaptchaError("");
    setCaptchaInput("");
    try {
      const res = await fetch(`${API_BASE}/cuet-captcha`, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to load captcha`);
      }

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (!data.cookie || !data.csrf || !data.image) {
        throw new Error("Invalid captcha response");
      }
      setCaptcha(data);
    } catch (e) {
      setCaptchaError(e instanceof Error ? e.message : "Failed to load captcha");
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCaptcha();
  }, [loadCaptcha]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captcha) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/cuet-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId.trim(),
          password,
          captcha: captchaInput.trim(),
          cookie: captcha.cookie,
          csrf: captcha.csrf,
        }),
      });

      const responseText = await res.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!res.ok || data.error) {
        setError(data.error ?? "Login failed");
        await loadCaptcha();
        return;
      }

      if (data.ok === true && data.rows) {
        onSuccess(data);
      } else if (data.rows) {
        onSuccess(data);
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
      await loadCaptcha();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-500/30 mb-4">
            <BookOpen className="w-8 h-8 text-sky-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CUET Result Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Electronics & Telecommunication Engineering</p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 2108001"
                required
                className="w-full bg-slate-900/70 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your portal password"
                required
                className="w-full bg-slate-900/70 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Captcha</label>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 bg-slate-900 border border-slate-700 rounded-lg h-14 flex items-center justify-center overflow-hidden">
                  {captchaLoading ? (
                    <RefreshCw className="w-5 h-5 text-slate-500 animate-spin" />
                  ) : captchaError ? (
                    <span className="text-xs text-red-400 px-2 text-center">{captchaError}</span>
                  ) : captcha?.image ? (
                    <img src={captcha.image} alt="captcha" className="h-full object-contain" />
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={loadCaptcha}
                  disabled={captchaLoading}
                  className="p-2.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-slate-300 transition disabled:opacity-50"
                  title="Refresh captcha"
                >
                  <RefreshCw className={`w-4 h-4 ${captchaLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter the captcha text"
                required
                className="w-full bg-slate-900/70 border border-slate-600 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || captchaLoading || !captcha}
              className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg py-3 text-sm transition-all duration-200 shadow-lg shadow-sky-900/30"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  View My Results
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          Connects securely to course.cuet.ac.bd
        </p>
      </div>
    </div>
  );
}
