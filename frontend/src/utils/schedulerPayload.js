const normalizeText = (value) => String(value || "").trim();

const getGrades = (quesData) =>
  quesData?.grades ||
  Array.from({ length: Number(quesData?.gradesCount || 0) }, (_, i) => ({
    id: i + 1,
    name: `Grade ${i + 1}`,
  }));

const getTotalPeriodsPerWeek = (daysOfWeek, periodsPerDay) =>
  daysOfWeek.reduce((total, day) => total + Number(periodsPerDay[day] || 0), 0);

const getTeacherWeeklyLoad = (teacher) =>
  (teacher.assignments || []).reduce(
    (total, assignment) => total + Number(assignment.frequency || 0),
    0
  );

export const buildSchedulerPayload = ({ quesData, teachers, subjects }) => {
  const daysOfWeek = quesData?.daysOfWeek || [];
  const periodsPerDay = Object.fromEntries(
    daysOfWeek.map((day) => [day, Number(quesData?.periodsPerDay?.[day] || 0)])
  );
  const grades = getGrades(quesData).map((grade) => ({
    id: Number(grade.id),
    name: normalizeText(grade.name),
  }));
  const totalPeriodsPerWeek = getTotalPeriodsPerWeek(daysOfWeek, periodsPerDay);
  const totalClassSlots =
    Number(quesData?.totalClassSlots) || grades.length * totalPeriodsPerWeek;

  const normalizedTeachers = teachers.map((teacher) => ({
    id: teacher.id,
    name: normalizeText(teacher.name),
    email: normalizeText(teacher.email),
    availability: teacher.availability || "flexible",
    maxWeeklyHours: Number(teacher.maxWeeklyHours || 0),
    assignedWeeklyLoad: getTeacherWeeklyLoad(teacher),
  }));

  const normalizedSubjects = subjects.map((subject) => ({
    id: subject.id,
    name: normalizeText(subject.name),
    description: normalizeText(subject.description),
  }));

  const assignments = teachers.flatMap((teacher) =>
    (teacher.assignments || []).map((assignment, index) => ({
      id: `${teacher.id}-${index}`,
      teacherId: teacher.id,
      teacherName: normalizeText(teacher.name),
      subject: normalizeText(assignment.subject),
      grade: Number(assignment.grade),
      frequency: Number(assignment.frequency),
      availability: teacher.availability || "flexible",
      maxWeeklyHours: Number(teacher.maxWeeklyHours || 0),
    }))
  );

  return {
    school: {
      grades,
      days: daysOfWeek,
      periodsPerDay,
      totalPeriodsPerWeek,
      totalClassSlots,
    },
    teachers: normalizedTeachers,
    subjects: normalizedSubjects,
    assignments,
  };
};
