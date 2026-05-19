import { useState } from "react";
import { LogOut, User, BookOpen, TrendingUp, Award, BarChart3 } from "lucide-react";
import SemesterCard from "./SemesterCard";
import GpaChart from "./GpaChart";
import { buildSemesters } from "../utils/buildSemesters";
import { computeCgpa } from "../utils/grading";
import type { ResultRow } from "../utils/grading";

type LoginData = {
  ok: true;
  rows: ResultRow[];
  studentId?: string;
  name?: string;
  department?: string;
  batch?: string;
};

type Props = {
  data: LoginData;
  onLogout: () => void;
};

export default function ResultsDashboard({ data, onLogout }: Props) {
  const semesters = buildSemesters(data.rows);
  const cgpa = computeCgpa(semesters);
  const publishedSemesters = semesters.filter((s) => s.gpa !== null);
  const totalEarned = semesters.reduce((sum, s) => sum + s.earnedCredit, 0);
  const totalCatalog = semesters.reduce((sum, s) => sum + s.totalCredit, 0);

  const [expandAll, setExpandAll] = useState(false);

  const bestGpa = publishedSemesters.length > 0
    ? Math.max(...publishedSemesters.map((s) => s.gpa!))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-teal-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-teal-600" />
            <span className="font-bold text-gray-900">CUET Result Viewer</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">{data.name ?? data.studentId ?? "Student"}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="bg-white border border-teal-100 rounded-xl p-6 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{data.name ?? "Student"}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {data.studentId && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-mono">
                    ID: {data.studentId}
                  </span>
                )}
                {data.department && (
                  <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full">
                    {data.department}
                  </span>
                )}
                {data.batch && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                    Batch {data.batch}
                  </span>
                )}
              </div>
            </div>
            {cgpa !== null && (
              <div className="text-right bg-gradient-to-br from-teal-50 to-emerald-50 rounded-lg p-4 border border-teal-200">
                <div className="text-4xl font-bold text-teal-600">{cgpa.toFixed(2)}</div>
                <div className="text-gray-600 text-sm mt-1">CGPA / 4.00</div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={<TrendingUp className="w-5 h-5 text-teal-600" />}
            label="CGPA"
            value={cgpa !== null ? cgpa.toFixed(2) : "—"}
            sub="out of 4.00"
          />
          <StatCard
            icon={<Award className="w-5 h-5 text-emerald-600" />}
            label="Best Semester"
            value={bestGpa !== null ? bestGpa.toFixed(2) : "—"}
            sub="GPA"
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-amber-600" />}
            label="Credits Earned"
            value={totalEarned.toFixed(2)}
            sub={`of ${totalCatalog.toFixed(2)}`}
          />
          <StatCard
            icon={<BarChart3 className="w-5 h-5 text-rose-600" />}
            label="Semesters"
            value={`${publishedSemesters.length}/${semesters.length}`}
            sub="completed"
          />
        </div>

        <GpaChart semesters={semesters} cgpa={cgpa} />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Semester Results</h2>
            <button
              onClick={() => setExpandAll((v) => !v)}
              className="text-sm font-medium text-teal-600 hover:text-teal-700 px-3 py-2 rounded-lg hover:bg-teal-50 transition"
            >
              {expandAll ? "Collapse all" : "Expand all"}
            </button>
          </div>
          <div className="space-y-3">
            {semesters.map((sem, i) => (
              <SemesterCard
                key={sem.levelTerm}
                semester={sem}
                index={i}
                defaultOpen={expandAll || (sem.gpa !== null && i === publishedSemesters.length - 1)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-gray-600 text-xs font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-gray-500 text-xs mt-1">{sub}</div>
    </div>
  );
}
