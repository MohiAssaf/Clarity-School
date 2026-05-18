const GENERATED_TIMETABLE_KEY = "claritySchoolGeneratedTimetable";

const hasSessionStorage = () =>
  typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";

export const saveGeneratedTimetable = ({ result, school, teachers }) => {
  if (!hasSessionStorage()) return;

  window.sessionStorage.setItem(
    GENERATED_TIMETABLE_KEY,
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      result,
      school,
      teachers,
    })
  );
};

export const loadGeneratedTimetable = () => {
  if (!hasSessionStorage()) return null;

  try {
    const savedTimetable = window.sessionStorage.getItem(GENERATED_TIMETABLE_KEY);
    return savedTimetable ? JSON.parse(savedTimetable) : null;
  } catch {
    return null;
  }
};
