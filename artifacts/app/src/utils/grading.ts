export type Grade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F" | "W" | "I";

const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  "A":  4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B":  3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C":  2.0,
  "C-": 1.7,
  "D":  1.0,
  "F":  0.0,
};

export function gradeToPoint(grade: string): number | null {
  const g = grade.trim().toUpperCase();
  if (g in GRADE_POINTS) return GRADE_POINTS[g];
  return null;
}

export function gradeColor(grade: string): string {
  const p = gradeToPoint(grade);
  if (p === null) return "text-gray-400";
  if (p >= 4.0) return "text-emerald-600";
  if (p >= 3.7) return "text-emerald-500";
  if (p >= 3.3) return "text-teal-600";
  if (p >= 3.0) return "text-teal-500";
  if (p >= 2.7) return "text-blue-500";
  if (p >= 2.3) return "text-yellow-500";
  if (p >= 2.0) return "text-orange-400";
  if (p >= 1.7) return "text-orange-500";
  if (p >= 1.0) return "text-red-400";
  return "text-red-600";
}

export function gradeBg(grade: string): string {
  const p = gradeToPoint(grade);
  if (p === null) return "bg-gray-100 text-gray-500";
  if (p >= 4.0) return "bg-emerald-100 text-emerald-700";
  if (p >= 3.7) return "bg-emerald-50 text-emerald-600";
  if (p >= 3.3) return "bg-teal-100 text-teal-700";
  if (p >= 3.0) return "bg-teal-50 text-teal-600";
  if (p >= 2.7) return "bg-blue-100 text-blue-700";
  if (p >= 2.3) return "bg-yellow-100 text-yellow-700";
  if (p >= 2.0) return "bg-orange-100 text-orange-700";
  if (p >= 1.7) return "bg-orange-50 text-orange-600";
  if (p >= 1.0) return "bg-red-100 text-red-600";
  return "bg-red-200 text-red-700";
}

export type ResultRow = {
  code: string;
  credit: number;
  levelTerm: string;
  sessional: boolean;
  grade: string;
  type: string;
};

export type SemesterResult = {
  levelTerm: string;
  gpa: number | null;
  totalCredit: number;
  earnedCredit: number;
  courses: CourseResult[];
};

export type CourseResult = {
  code: string;
  name: string;
  credit: number;
  sessional: boolean;
  grade: string | null;
  gradePoint: number | null;
  published: boolean;
};

export function computeGpa(courses: CourseResult[]): number | null {
  const graded = courses.filter((c) => c.gradePoint !== null && c.grade !== null && c.grade !== "");
  if (graded.length === 0) return null;
  const totalPoints = graded.reduce((sum, c) => sum + c.gradePoint! * c.credit, 0);
  const totalCredit = graded.reduce((sum, c) => sum + c.credit, 0);
  if (totalCredit === 0) return null;
  return Math.round((totalPoints / totalCredit) * 100) / 100;
}

export function computeCgpa(semesters: SemesterResult[]): number | null {
  const valid = semesters.filter((s) => s.gpa !== null);
  if (valid.length === 0) return null;
  const totalPoints = valid.reduce((sum, s) => {
    const graded = s.courses.filter((c) => c.gradePoint !== null);
    return sum + graded.reduce((a, c) => a + c.gradePoint! * c.credit, 0);
  }, 0);
  const totalCredit = valid.reduce((sum, s) => {
    return sum + s.courses.filter((c) => c.gradePoint !== null).reduce((a, c) => a + c.credit, 0);
  }, 0);
  if (totalCredit === 0) return null;
  return Math.round((totalPoints / totalCredit) * 100) / 100;
}
