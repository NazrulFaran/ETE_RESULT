import { CATALOG, normalizeCode } from "../data/courseCatalog";
import {
  computeGpa,
  gradeToPoint,
  type CourseResult,
  type ResultRow,
  type SemesterResult,
} from "./grading";

export function buildSemesters(rows: ResultRow[]): SemesterResult[] {
  const byTerm = new Map<string, ResultRow[]>();
  for (const row of rows) {
    const key = row.levelTerm;
    if (!byTerm.has(key)) byTerm.set(key, []);
    byTerm.get(key)!.push(row);
  }

  return CATALOG.map((sem) => {
    const termRows = byTerm.get(sem.levelTerm) ?? [];

    const courses: CourseResult[] = sem.courses.map((cat) => {
      const normCodes = cat.codes.map(normalizeCode);
      const match = termRows.find((r) => normCodes.includes(normalizeCode(r.code)));

      if (match && match.grade && match.grade !== "") {
        return {
          code: match.code,
          name: cat.name,
          credit: cat.credit,
          sessional: cat.sessional ?? false,
          grade: match.grade,
          gradePoint: gradeToPoint(match.grade),
          published: true,
        };
      }

      return {
        code: cat.codes[0],
        name: cat.name,
        credit: cat.credit,
        sessional: cat.sessional ?? false,
        grade: null,
        gradePoint: null,
        published: false,
      };
    });

    const gpa = computeGpa(courses);
    const earnedCredit = courses
      .filter((c) => c.gradePoint !== null && c.gradePoint > 0)
      .reduce((sum, c) => sum + c.credit, 0);

    return {
      levelTerm: sem.levelTerm,
      gpa,
      totalCredit: sem.totalCredit,
      earnedCredit,
      courses,
    };
  });
}
