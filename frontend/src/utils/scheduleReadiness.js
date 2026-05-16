const normalizeText = (value) => String(value || "").trim().toLowerCase();

const getGrades = (quesData) =>
  quesData?.grades ||
  Array.from({ length: Number(quesData?.gradesCount || 0) }, (_, i) => ({
    id: i + 1,
    name: `Grade ${i + 1}`,
  }));

const getTotalPeriodsPerWeek = (quesData) => {
  if (quesData?.totalPeriodsPerWeek) return Number(quesData.totalPeriodsPerWeek);

  return (quesData?.daysOfWeek || []).reduce(
    (total, day) => total + Number(quesData?.periodsPerDay?.[day] || 0),
    0
  );
};

const getTeacherLoad = (teacher) =>
  (teacher.assignments || []).reduce(
    (total, assignment) => total + Number(assignment.frequency || 0),
    0
  );

export const evaluateScheduleReadiness = ({ quesData, teachers, subjects }) => {
  const blockers = [];
  const warnings = [];
  const grades = getGrades(quesData);
  const daysOfWeek = quesData?.daysOfWeek || [];
  const totalPeriodsPerWeek = getTotalPeriodsPerWeek(quesData);
  const totalClassSlots =
    Number(quesData?.totalClassSlots) || grades.length * totalPeriodsPerWeek;

  if (!quesData) {
    blockers.push("Complete the school setup questionnaire first.");
  }

  if (grades.length === 0) {
    blockers.push("Add at least one grade.");
  }

  if (daysOfWeek.length === 0) {
    blockers.push("Select at least one working day.");
  }

  if (totalPeriodsPerWeek <= 0) {
    blockers.push("Add valid periods for each working day.");
  }

  if (subjects.length === 0) {
    blockers.push("Add at least one subject.");
  }

  if (teachers.length === 0) {
    blockers.push("Add at least one teacher.");
  }

  const gradeIds = new Set(grades.map((grade) => Number(grade.id)));
  const gradeLabels = new Map(
    grades.map((grade) => [Number(grade.id), grade.name || `Grade ${grade.id}`])
  );
  const requestedPeriodsByGrade = new Map(
    grades.map((grade) => [Number(grade.id), 0])
  );
  const subjectNames = new Set(subjects.map((subject) => normalizeText(subject.name)));
  const usedSubjectNames = new Set();
  let assignmentCount = 0;
  let totalRequestedPeriods = 0;

  for (const teacher of teachers) {
    const teacherLoad = getTeacherLoad(teacher);
    const maxWeeklyHours = Number(teacher.maxWeeklyHours || 0);

    if (!teacher.assignments?.length) {
      warnings.push(`${teacher.name} has no teaching assignments.`);
      continue;
    }

    if (maxWeeklyHours > 0 && teacherLoad > maxWeeklyHours) {
      blockers.push(
        `${teacher.name} is assigned ${teacherLoad} periods, above their ${maxWeeklyHours} period weekly limit.`
      );
    }

    for (const assignment of teacher.assignments) {
      assignmentCount += 1;

      const grade = Number(assignment.grade);
      const subject = String(assignment.subject || "").trim();
      const frequency = Number(assignment.frequency);

      if (!Number.isInteger(grade) || !gradeIds.has(grade)) {
        blockers.push(`${teacher.name} has an assignment for an invalid grade.`);
      }

      if (!subject || !subjectNames.has(normalizeText(subject))) {
        blockers.push(
          `${teacher.name} has an assignment for a subject that is not in the subject list.`
        );
      } else {
        usedSubjectNames.add(normalizeText(subject));
      }

      if (!Number.isInteger(frequency) || frequency <= 0) {
        blockers.push(`${teacher.name} has an assignment with an invalid frequency.`);
      } else {
        totalRequestedPeriods += frequency;
        if (gradeIds.has(grade)) {
          requestedPeriodsByGrade.set(
            grade,
            (requestedPeriodsByGrade.get(grade) || 0) + frequency
          );
        }

        if (frequency > totalPeriodsPerWeek) {
          blockers.push(
            `${teacher.name} has an assignment that needs more periods than the weekly calendar allows.`
          );
        }
      }
    }
  }

  if (assignmentCount === 0) {
    blockers.push("Add at least one teaching assignment.");
  }

  if (totalRequestedPeriods > totalClassSlots) {
    blockers.push(
      `Requested periods (${totalRequestedPeriods}) exceed available class slots (${totalClassSlots}).`
    );
  }

  if (totalRequestedPeriods < totalClassSlots) {
    blockers.push(
      `Requested periods (${totalRequestedPeriods}) must fill all available class slots (${totalClassSlots}).`
    );
  }

  for (const [gradeId, requestedPeriods] of requestedPeriodsByGrade.entries()) {
    if (requestedPeriods !== totalPeriodsPerWeek) {
      blockers.push(
        `${gradeLabels.get(gradeId)} has ${requestedPeriods} assigned periods but needs ${totalPeriodsPerWeek}.`
      );
    }
  }

  const unusedSubjects = subjects.filter(
    (subject) => !usedSubjectNames.has(normalizeText(subject.name))
  );

  if (unusedSubjects.length > 0) {
    warnings.push(`${unusedSubjects.length} subjects are not assigned to any teacher.`);
  }

  const gradeCoverage = grades.map((grade) => {
    const gradeId = Number(grade.id);
    const assignedPeriods = requestedPeriodsByGrade.get(gradeId) || 0;
    const difference = assignedPeriods - totalPeriodsPerWeek;

    return {
      gradeId,
      gradeName: grade.name || `Grade ${grade.id}`,
      assignedPeriods,
      requiredPeriods: totalPeriodsPerWeek,
      missingPeriods: Math.max(totalPeriodsPerWeek - assignedPeriods, 0),
      excessPeriods: Math.max(assignedPeriods - totalPeriodsPerWeek, 0),
      status:
        difference === 0 ? "ready" : difference < 0 ? "missing" : "excess",
    };
  });

  return {
    isReady: blockers.length === 0,
    blockers,
    warnings,
    summary: {
      assignmentCount,
      gradeCount: grades.length,
      subjectCount: subjects.length,
      teacherCount: teachers.length,
      totalClassSlots,
      totalPeriodsPerWeek,
      totalRequestedPeriods,
      requestedPeriodsByGrade: Object.fromEntries(requestedPeriodsByGrade),
      gradeCoverage,
    },
  };
};
