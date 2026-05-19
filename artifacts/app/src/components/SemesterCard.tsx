import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { gradeBg } from "../utils/grading";
import type { SemesterResult } from "../utils/grading";

function formatLevelTerm(lt: string): string {
  return lt
    .replace("Level ", "LEVEL-")
    .replace(" - Term ", " TERM-")
    .replace("Term ", "TERM-")
    .toUpperCase();
}

type Props = {
  semester: SemesterResult;
  index: number;
  defaultOpen?: boolean;
};

export default function SemesterCard({ semester, index, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const publishedCount = semester.courses.filter((c) => c.published).length;
  const total = semester.courses.length;

  const colors = [
    { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", text: "text-emerald-600" },
    { bg: "bg-sky-50", border: "border-sky-200", badge: "bg-sky-100 text-sky-700", text: "text-sky-600" },
    { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", text: "text-amber-600" },
    { bg: "bg-rose-50", border: "border-rose-200", badge: "bg-rose-100 text-rose-700", text: "text-rose-600" },
  ];

  const color = colors[index % colors.length];

  return (
    <div className={`bg-white border ${color.border} rounded-xl overflow-hidden transition-all shadow-md`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-6 py-4 hover:${color.bg} transition-colors`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${color.badge}`}>
            {formatLevelTerm(semester.levelTerm)}
          </span>
          <span className="text-sm text-gray-600">
            {publishedCount}/{total} courses
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            {semester.gpa !== null ? (
              <div>
                <span className={`text-lg font-bold ${color.text}`}>{semester.gpa.toFixed(2)}</span>
                <span className="text-gray-500 text-xs ml-1">GPA</span>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">—</span>
            )}
            <div className="text-gray-500 text-xs">{semester.totalCredit} credits</div>
          </div>
          {open ? (
            <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-6 py-3 text-gray-600 font-semibold text-xs uppercase tracking-wide">Code</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold text-xs uppercase tracking-wide">Course Name</th>
                  <th className="text-center px-4 py-3 text-gray-600 font-semibold text-xs uppercase tracking-wide">Credit</th>
                  <th className="text-center px-4 py-3 text-gray-600 font-semibold text-xs uppercase tracking-wide">Grade</th>
                  <th className="text-center px-4 py-3 text-gray-600 font-semibold text-xs uppercase tracking-wide">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {semester.courses.map((course) => (
                  <tr
                    key={course.code}
                    className={`transition-colors ${course.published ? "hover:bg-gray-50" : "opacity-50"}`}
                  >
                    <td className="px-6 py-3 font-mono text-gray-700 text-xs">{course.code}</td>
                    <td className="px-4 py-3 text-gray-700">
                      <span>{course.name}</span>
                      {course.sessional && (
                        <span className="ml-2 text-xs text-gray-500 italic">sessional</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">{course.credit.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      {course.grade ? (
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${gradeBg(course.grade)}`}>
                          {course.grade}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 text-xs font-medium">
                      {course.gradePoint !== null ? course.gradePoint.toFixed(1) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td colSpan={2} className="px-6 py-3 text-gray-700 text-xs font-semibold">
                    Semester Total
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 text-xs font-semibold">
                    {semester.totalCredit.toFixed(2)}
                  </td>
                  <td colSpan={2} className="px-4 py-3 text-center">
                    {semester.gpa !== null ? (
                      <span className={`font-bold ${color.text}`}>GPA {semester.gpa.toFixed(2)}</span>
                    ) : (
                      <span className="text-gray-500 text-xs">Pending</span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
