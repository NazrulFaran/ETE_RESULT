import { useState } from "react";
import LoginForm from "./components/LoginForm";
import ResultsDashboard from "./components/ResultsDashboard";
import type { ResultRow } from "./utils/grading";

type LoginData = {
  ok: true;
  rows: ResultRow[];
  studentId?: string;
  name?: string;
  department?: string;
  batch?: string;
};

export default function App() {
  const [results, setResults] = useState<LoginData | null>(null);

  function handleSuccess(data: unknown) {
    setResults(data as LoginData);
  }

  function handleLogout() {
    setResults(null);
  }

  if (results) {
    return <ResultsDashboard data={results} onLogout={handleLogout} />;
  }

  return <LoginForm onSuccess={handleSuccess} />;
}
