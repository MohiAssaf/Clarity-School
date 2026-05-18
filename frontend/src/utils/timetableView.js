export const getSelectedGradeLessons = ({
  schedule,
  day,
  gradeId,
  periodsCount,
}) => {
  if (!schedule || !day || !gradeId || periodsCount <= 0) return [];

  const gradeSchedule = schedule?.[day]?.[String(gradeId)] || {};

  return Array.from({ length: periodsCount }, (_, index) => {
    const period = index + 1;

    return {
      period,
      lesson: gradeSchedule[String(period)] || null,
    };
  });
};

export const getSelectedTeacherLessons = ({
  schedule,
  day,
  teacherId,
  periodsCount,
  grades,
}) => {
  if (!schedule || !day || !teacherId || periodsCount <= 0) return [];

  return Array.from({ length: periodsCount }, (_, index) => {
    const period = index + 1;
    const lesson = findTeacherLesson({
      daySchedule: schedule[day] || {},
      teacherId,
      period,
      grades,
    });

    return { period, lesson };
  });
};

export const formatLabel = (value) =>
  String(value)
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());

const findTeacherLesson = ({ daySchedule, teacherId, period, grades }) => {
  for (const [gradeId, gradeSchedule] of Object.entries(daySchedule)) {
    const lesson = gradeSchedule[String(period)];

    if (lesson?.teacherId === teacherId) {
      return {
        ...lesson,
        gradeName: getGradeName(grades, gradeId),
      };
    }
  }

  return null;
};

const getGradeName = (grades, gradeId) => {
  const grade = grades.find((item) => String(item.id) === String(gradeId));
  return grade?.name || `Grade ${gradeId}`;
};
