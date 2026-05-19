export type CatalogCourse = {
  codes: string[];
  name: string;
  credit: number;
  sessional?: boolean;
};

export type CatalogSemester = {
  levelTerm: string;
  totalCredit: number;
  courses: CatalogCourse[];
};

export const CATALOG: CatalogSemester[] = [
  {
    levelTerm: "Level 1 - Term I",
    totalCredit: 19.75,
    courses: [
      { codes: ["EEE 181"], name: "Basic Electrical Engineering", credit: 4.0 },
      { codes: ["EEE 182"], name: "Basic Electrical Engineering Sessional", credit: 1.5, sessional: true },
      { codes: ["MATH 181"], name: "Differential and Integral Calculus", credit: 3.0 },
      { codes: ["MATH 183"], name: "Ordinary & Partial Differential Equations and Matrix", credit: 3.0 },
      { codes: ["CHEM 181"], name: "Chemistry", credit: 3.0 },
      { codes: ["CHEM 182"], name: "Chemistry Sessional", credit: 1.5, sessional: true },
      { codes: ["HUM 181"], name: "Technical English", credit: 3.0 },
      { codes: ["ME 182"], name: "Mechanical Engineering Drawing", credit: 0.75, sessional: true },
    ],
  },
  {
    levelTerm: "Level 1 - Term II",
    totalCredit: 21.25,
    courses: [
      { codes: ["ETE 101"], name: "Electronics-I", credit: 3.0 },
      { codes: ["ETE 102"], name: "Electronics-I Sessional", credit: 1.5, sessional: true },
      { codes: ["EEE 183"], name: "Fundamentals of Electrical Machines", credit: 3.0 },
      { codes: ["EEE 184"], name: "Fundamentals of Electrical Machines Sessional", credit: 0.75, sessional: true },
      { codes: ["PHY 181"], name: "Engineering Physics", credit: 3.0 },
      { codes: ["PHY 182"], name: "Engineering Physics Sessional", credit: 1.5, sessional: true },
      { codes: ["MATH 185"], name: "Vector Analysis and Operational Calculus", credit: 3.0 },
      { codes: ["CSE 181"], name: "Computer Programming and Numerical Analysis", credit: 4.0 },
      { codes: ["CSE 182"], name: "Computer Programming and Numerical Analysis Sessional", credit: 1.5, sessional: true },
    ],
  },
  {
    levelTerm: "Level 2 - Term I",
    totalCredit: 19.5,
    courses: [
      { codes: ["ETE 201"], name: "Electronics-II", credit: 3.0 },
      { codes: ["ETE 202"], name: "Electronics-II Sessional", credit: 1.5, sessional: true },
      { codes: ["ETE 203"], name: "Signals and Systems", credit: 3.0 },
      { codes: ["ETE 204"], name: "Signals and Systems Sessional", credit: 1.5, sessional: true },
      { codes: ["CSE 281"], name: "Data Structures and Algorithms", credit: 3.0 },
      { codes: ["CSE 282"], name: "Data Structures and Algorithms Sessional", credit: 1.5, sessional: true },
      { codes: ["MATH 281"], name: "Engineering Statistics and Complex Variables", credit: 3.0 },
      { codes: ["HUM 281"], name: "Financial Accounting and Management", credit: 3.0 },
    ],
  },
  {
    levelTerm: "Level 2 - Term II",
    totalCredit: 20.25,
    courses: [
      { codes: ["ETE 205"], name: "Digital Logic Design", credit: 3.0 },
      { codes: ["ETE 206"], name: "Digital Logic Design Sessional", credit: 1.5, sessional: true },
      { codes: ["ETE 207"], name: "Electromagnetic Fields and Waves", credit: 3.0 },
      { codes: ["ETE 209"], name: "Analog Communications", credit: 3.0 },
      { codes: ["ETE 210"], name: "Analog Communications Sessional", credit: 1.5, sessional: true },
      { codes: ["ETE 211"], name: "Control System Engineering", credit: 3.0 },
      { codes: ["ETE 212"], name: "Control System Engineering Sessional", credit: 0.75, sessional: true },
      { codes: ["CSE 284"], name: "Object Oriented Programming", credit: 1.5 },
      { codes: ["HUM 283"], name: "Economics and Sociology", credit: 3.0 },
    ],
  },
  {
    levelTerm: "Level 3 - Term I",
    totalCredit: 20.25,
    courses: [
      { codes: ["ETE 301"], name: "Semiconductor Physics and Devices", credit: 3.0 },
      { codes: ["ETE 303"], name: "Industrial Electronics", credit: 3.0 },
      { codes: ["ETE 304"], name: "Industrial Electronics Sessional", credit: 0.75, sessional: true },
      { codes: ["ETE 305"], name: "Digital Communication", credit: 3.0 },
      { codes: ["ETE 306"], name: "Digital Communication Sessional", credit: 1.5, sessional: true },
      { codes: ["ETE 307"], name: "Microwave and Antenna Engineering", credit: 3.0 },
      { codes: ["ETE 308"], name: "Microwave and Antenna Engineering Sessional", credit: 0.75, sessional: true },
      { codes: ["ETE 309"], name: "Digital Signal Processing", credit: 3.0 },
      { codes: ["ETE 310"], name: "Digital Signal Processing Sessional", credit: 0.75, sessional: true },
      { codes: ["CSE 380"], name: "Internet Programming", credit: 1.5 },
    ],
  },
  {
    levelTerm: "Level 3 - Term II",
    totalCredit: 19.5,
    courses: [
      { codes: ["ETE 300"], name: "Electronic System Design and Project", credit: 0.75, sessional: true },
      { codes: ["ETE 311"], name: "Information Theory and Coding", credit: 3.0 },
      { codes: ["ETE 313"], name: "Electronic Measurement and Instrumentation", credit: 3.0 },
      { codes: ["ETE 314"], name: "Electronic Measurement and Instrumentation Sessional", credit: 0.75, sessional: true },
      { codes: ["ETE 315"], name: "Computer Communications and Networks", credit: 3.0 },
      { codes: ["ETE 316"], name: "Computer Communications and Networks Sessional", credit: 1.5, sessional: true },
      { codes: ["ETE 317"], name: "Power System for Communication Engineering", credit: 3.0 },
      { codes: ["ETE 318"], name: "Power System for Communication Engineering Sessional", credit: 0.75, sessional: true },
      { codes: ["ETE 319"], name: "Microprocessor and Microcontroller", credit: 3.0 },
      { codes: ["ETE 320"], name: "Microprocessor and Microcontroller Sessional", credit: 0.75, sessional: true },
    ],
  },
  {
    levelTerm: "Level 4 - Term I",
    totalCredit: 21.0,
    courses: [
      { codes: ["ETE 400"], name: "Project and Thesis", credit: 0.75, sessional: true },
      { codes: ["ETE 480"], name: "Industrial Training (2 Weeks)", credit: 0.75, sessional: true },
      { codes: ["ETE 401"], name: "Telecommunication Networks and Switching", credit: 3.0 },
      { codes: ["ETE 402"], name: "Telecommunication Networks and Switching Sessional", credit: 0.75, sessional: true },
      { codes: ["ETE 403"], name: "VLSI Technology", credit: 3.0 },
      { codes: ["ETE 404"], name: "VLSI Technology Sessional", credit: 0.75, sessional: true },
      { codes: ["ETE 405"], name: "Wireless and Mobile Communication", credit: 3.0 },
      { codes: ["ETE 406"], name: "Wireless and Mobile Communication Sessional", credit: 0.75, sessional: true },
      { codes: ["ETE 407"], name: "Multimedia Communication", credit: 3.0 },
      { codes: ["ETE 408"], name: "Multimedia Communication Sessional", credit: 1.5, sessional: true },
      { codes: ["ETE 421", "ETE 423", "ETE 425", "ETE 429", "ETE 431"], name: "Elective I", credit: 3.0 },
      { codes: ["ETE 422", "ETE 424", "ETE 426", "ETE 430", "ETE 432"], name: "Sessional based on Elective I", credit: 0.75, sessional: true },
    ],
  },
  {
    levelTerm: "Level 4 - Term II",
    totalCredit: 20.0,
    courses: [
      { codes: ["ETE 400"], name: "Project and Thesis", credit: 3.0, sessional: true },
      { codes: ["ETE 411"], name: "Optical Fiber Communications", credit: 3.0 },
      { codes: ["ETE 412"], name: "Optical Fiber Communications Sessional", credit: 0.75, sessional: true },
      { codes: ["ETE 413"], name: "Satellite Communications and RADAR", credit: 3.0 },
      { codes: ["ETE 414"], name: "Satellite Communications and RADAR Sessional", credit: 0.75, sessional: true },
      { codes: ["ETE 415"], name: "IoT and Industrial Automation", credit: 3.0 },
      { codes: ["ETE 416"], name: "IoT and Industrial Automation Sessional", credit: 0.75, sessional: true },
      { codes: ["ETE 417"], name: "Engineering Ethics and Entrepreneurship", credit: 2.0 },
      { codes: ["ETE 409", "ETE 451", "ETE 453", "ETE 455", "ETE 457", "ETE 459", "ETE 461"], name: "Elective II", credit: 3.0 },
      { codes: ["ETE 410", "ETE 452", "ETE 454", "ETE 456", "ETE 458", "ETE 460", "ETE 462"], name: "Sessional based on Elective II", credit: 0.75, sessional: true },
    ],
  },
];

export function normalizeCode(code: string): string {
  return code.replace(/\s+/g, "").toUpperCase();
}

export function findCatalogSemester(levelTerm: string): CatalogSemester | undefined {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  return CATALOG.find((s) => norm(s.levelTerm) === norm(levelTerm));
}
