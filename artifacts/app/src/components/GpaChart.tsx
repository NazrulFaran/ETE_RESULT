import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import type { SemesterResult } from "../utils/grading";

type Props = {
  semesters: SemesterResult[];
  cgpa: number | null;
};

function shortLabel(lt: string): string {
  const m = lt.match(/Level\s*(\d)\s*-?\s*Term\s*([IVX]+)/i);
  if (m) return `L${m[1]}-T${toArabic(m[2])}`;
  return lt.slice(0, 6);
}

function toArabic(roman: string): string {
  const map: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5 };
  return String(map[roman.toUpperCase()] ?? roman);
}

export default function GpaChart({ semesters, cgpa }: Props) {
  const data = semesters
    .filter((s) => s.gpa !== null)
    .map((s) => ({ name: shortLabel(s.levelTerm), gpa: s.gpa! }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white border border-teal-100 rounded-xl p-6 shadow-md">
      <h2 className="text-lg font-bold text-gray-900 mb-4">GPA Trend</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <YAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tick={{ fontSize: 11, fill: "#6b7280" }} />
          <Tooltip
            formatter={(value: number) => [value.toFixed(2), "GPA"]}
            contentStyle={{ borderRadius: 8, border: "1px solid #d1fae5", fontSize: 12 }}
          />
          {cgpa !== null && (
            <ReferenceLine
              y={cgpa}
              stroke="#0d9488"
              strokeDasharray="4 4"
              label={{ value: `CGPA ${cgpa.toFixed(2)}`, fill: "#0d9488", fontSize: 11, position: "insideTopRight" }}
            />
          )}
          <Line
            type="monotone"
            dataKey="gpa"
            stroke="#0d9488"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#0d9488", strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
